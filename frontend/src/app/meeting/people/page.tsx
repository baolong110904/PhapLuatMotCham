"use client";

import React, { useEffect, useRef, useState } from "react";

function RoomNameLoader({ setRoomName }: { setRoomName: (s: string) => void }) {
  useEffect(() => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const r = params.get("room");
      if (r) setRoomName(r);
    } catch (e) {
      // ignore
    }
  }, [setRoomName]);

  return null;
}

type Peer = {
  id: string;
  pc: RTCPeerConnection;
  dc?: RTCDataChannel;
  stream?: MediaStream;
};

export default function PeopleMeetingPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const peersRef = useRef<Record<string, Peer>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const clientIdRef = useRef<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ from: string; text: string }>>([]);
  const [roomName, setRoomName] = useState<string>("PLMC_public");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const SIGNAL_URL = "ws://localhost:5000"; // backend ws server 

  useEffect(() => {
    return () => {
      // cleanup local tracks
        localStream?.getTracks().forEach((t) => t.stop());
        // close ws
        if (wsRef.current) wsRef.current.close();
        // close peer connections
        Object.values(peersRef.current).forEach((p) => p.pc.close());
    };
  }, []);

  async function ensureLocalStream() {
    if (localStream) return localStream;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(s);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = s;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch(() => {});
      }
      return s;
    } catch (e) {
      alert("Không thể truy cập Camera/Microphone. Hãy cấp quyền và thử lại.");
      throw e;
    }
  }

  function addChat(from: string, text: string) {
    setChatLog((c) => [...c, { from, text }]);
  }

  function sendSignaling(msg: any) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(msg));
  }

  async function startConference() {
    if (joined) return;
    setLoading(true);
    await ensureLocalStream();

    console.log("Starting conference, room:", roomName);
    const ws = new WebSocket(SIGNAL_URL.replace(/^http/, "ws"));
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS open, sending join for room", roomName);
      sendSignaling({ type: "join", room: roomName });
      setLoading(false);
    };

    ws.onmessage = async (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        console.log("WS message received:", msg);
        const { type } = msg;

        if (type === "id") {
          clientIdRef.current = msg.id;
        }

        if (type === "peers") {
          const peersList: string[] = msg.peers || [];
          console.log("Existing peers in room:", peersList);
          // create peer connections for each existing peer (we will be caller)
          for (const id of peersList) {
            await createPeerConnection(id, true);
          }
          setJoined(true);
        }

        if (type === "peer-joined") {
          const id = msg.id;
          // create pc as answerer (we will receive offer)
          await createPeerConnection(id, false);
        }

        if (type === "offer") {
          const from = msg.from;
          const sdp = msg.payload;
          console.log("Received offer from", from);
          let p = peersRef.current[from];
          if (!p) {
            // not present yet, create as answerer
            p = await createPeerConnection(from, false);
          }
          try {
            await p.pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await p.pc.createAnswer();
            await p.pc.setLocalDescription(answer);
            sendSignaling({ type: "answer", to: from, payload: p.pc.localDescription });
          } catch (e) {
            console.warn('Failed handling offer from', from, e);
          }
        }

        if (type === "answer") {
          const from = msg.from;
          const sdp = msg.payload;
          console.log("Received answer from", from);
          let p = peersRef.current[from];
          if (!p) {
            // create a peer entry if missing
            p = await createPeerConnection(from, false);
          }
          try {
            await p.pc.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (e) {
            console.warn('Failed setting remote description for answer from', from, e);
          }
        }

        if (type === "ice") {
          const from = msg.from;
          const candidate = msg.payload;
          console.log("Received ICE from", from, candidate && candidate.candidate ? candidate.candidate : candidate);
          let p = peersRef.current[from];
          if (!p) {
            // ensure we have a pc to add candidate to
            p = await createPeerConnection(from, false);
          }
          if (p && candidate) {
            try {
              await p.pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.warn('addIceCandidate failed for', from, e);
            }
          }
        }

        if (type === "peer-left") {
          const id = msg.id;
          if (peersRef.current[id]) {
            peersRef.current[id].pc.close();
            delete peersRef.current[id];
            setPeers({ ...peersRef.current });
            addChat("system", `Người dùng ${id} đã rời phòng`);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    ws.onclose = () => {
      console.log("WS closed");
      setJoined(false);
      setLoading(false);
    };
  }

  async function createPeerConnection(remoteId: string, isCaller: boolean) {
    if (peersRef.current[remoteId]) return peersRef.current[remoteId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    console.log("Created RTCPeerConnection for", remoteId, "isCaller", isCaller);

  const peer: Peer = { id: remoteId, pc };
  peersRef.current[remoteId] = peer;
  setPeers({ ...peersRef.current });

    // if stream already exists (race), attach to element
    if (peer.stream) {
      try {
        const vid = document.getElementById(`remote-${remoteId}`) as HTMLVideoElement | null;
        if (vid) {
          vid.srcObject = peer.stream;
          vid.playsInline = true;
          vid.play().catch(() => {});
        }
      } catch (e) {}
    }

    // add local tracks (ensure we have a stream)
    const s = await ensureLocalStream();
    if (s) {
      for (const t of s.getTracks()) pc.addTrack(t, s);
    }

    // data channel for chat
    if (isCaller) {
      const dc = pc.createDataChannel("chat");
      peer.dc = dc;
      dc.onmessage = (ev) => addChat(remoteId, ev.data);
    } else {
      pc.ondatachannel = (e) => {
        peer.dc = e.channel;
        peer.dc.onmessage = (ev) => addChat(remoteId, ev.data);
      };
    }

    pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      peer.stream = stream;
      peersRef.current[remoteId] = peer;
      setPeers({ ...peersRef.current });
      // try to attach immediately to the corresponding video element
      try {
        const vid = document.getElementById(`remote-${remoteId}`) as HTMLVideoElement | null;
        if (vid) {
          vid.srcObject = stream;
          vid.playsInline = true;
          vid.play().catch(() => {});
        }
      } catch (e) {}
    };

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        console.log('onicecandidate ->', remoteId, ev.candidate);
        sendSignaling({ type: "ice", to: remoteId, payload: ev.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('pc.connectionState', remoteId, pc.connectionState);
    };
    pc.oniceconnectionstatechange = () => {
      console.log('pc.iceConnectionState', remoteId, pc.iceConnectionState);
    };

    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignaling({ type: "offer", to: remoteId, payload: pc.localDescription });
    }

    return peer;
  }

  function sendChat(text: string) {
    addChat("me", text);
    // send via data channels
    for (const id in peers) {
      const p = peers[id];
      try {
        p.dc?.send(text);
      } catch (e) {}
    }
  }

  function leaveConference() {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "leave" }));
      wsRef.current.close();
      wsRef.current = null;
    }
    Object.values(peers).forEach((p) => p.pc.close());
    setPeers({});
    setJoined(false);
  }

  function toggleAudio() {
    if (!localStream) return;
    for (const t of localStream.getAudioTracks()) {
      t.enabled = !t.enabled;
      setMuted(!t.enabled);
    }
  }

  function toggleVideo() {
    if (!localStream) return;
    for (const t of localStream.getVideoTracks()) {
      t.enabled = !t.enabled;
      setCameraOff(!t.enabled);
    }
  }

  const copyRoomLink = async () => {
    const url = `${window.location.origin}/meeting/people?room=${encodeURIComponent(roomName)}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép link phòng vào clipboard");
    } catch (e) {
      prompt("Sao chép link phòng (Ctrl+C):", url);
    }
  };

  const createPrivateRoom = async (autoJoin = true) => {
    // generate a short random room id using crypto
    try {
      const array = new Uint8Array(6);
      window.crypto.getRandomValues(array);
      const id = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const newRoom = `PLMC_${id}`;
      setRoomName(newRoom);

      const url = `${window.location.origin}/meeting/people?room=${encodeURIComponent(newRoom)}`;
      try {
        await navigator.clipboard.writeText(url);
        alert("Phòng riêng được tạo và link đã được sao chép.");
      } catch (e) {
        prompt("Link phòng riêng (Ctrl+C):", url);
      }

      if (autoJoin) {
        // if already joined, leave first
        if (wsRef.current) leaveConference();
        // small delay to ensure state updates
        setTimeout(() => startConference(), 200);
      }
    } catch (e) {
      alert("Không thể tạo phòng riêng tự động trên trình duyệt này.");
    }
  };

  // Helpful emoji helper: copy emoji to clipboard and open chat for user to paste
  const sendEmojiHelper = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      // open chat so user can paste
      alert("Emoji đã được sao chép — hãy dán (Ctrl+V) vào chat để gửi.");
    } catch (e) {
      alert("Không thể sao chép emoji tự động; vui lòng dán thủ công.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* If URL contains ?room= use it so shared links open the same room */}
        {/* Read once on client load */}
        <RoomNameLoader setRoomName={setRoomName} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Phòng gặp gỡ cộng đồng</h1>
          <div className="flex gap-2">
            <button
              onClick={copyRoomLink}
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium"
            >
              Sao chép link phòng
            </button>
            <button
              onClick={() => createPrivateRoom(true)}
              className="px-4 py-2 rounded bg-yellow-600 text-white font-medium"
            >
              Tạo phòng riêng & Tham gia
            </button>
            {!joined ? (
              <button
                onClick={startConference}
                className="px-4 py-2 rounded bg-green-600 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Đang khởi tạo..." : "Tham gia phòng"}
              </button>
            ) : (
              <button
                onClick={leaveConference}
                className="px-4 py-2 rounded bg-red-600 text-white font-medium"
              >
                Rời phòng
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-white rounded shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <video ref={localVideoRef} className="w-full h-80 bg-black rounded" autoPlay playsInline />
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(peers).length === 0 ? (
                  // placeholders to keep layout stable
                  [1, 2, 3, 4].slice(0, 4).map((i) => (
                    <div key={`placeholder-${i}`} className="w-full h-40 bg-black rounded" />
                  ))
                ) : (
                  Object.values(peers).map((p) => (
                    <video
                      key={p.id}
                      id={`remote-${p.id}`}
                      className="w-full h-40 bg-black rounded"
                      autoPlay
                      playsInline
                      ref={(el) => {
                        if (el && p.stream) {
                          el.srcObject = p.stream;
                          el.play().catch(() => {});
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="mt-4">
              <strong>Chat</strong>
              <div className="h-40 overflow-auto p-2 bg-gray-50 rounded mt-2">
                {chatLog.map((c, i) => (
                  <div key={i} className="text-sm">
                    <strong className="mr-2">{c.from}:</strong>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input id="chatInput" className="flex-1 px-3 py-2 rounded border" />
                <button
                  onClick={() => {
                    const el = document.getElementById("chatInput") as HTMLInputElement | null;
                    if (el && el.value.trim()) {
                      sendChat(el.value.trim());
                      el.value = "";
                    }
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

          <aside className="md:col-span-1 bg-white rounded shadow p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <strong>Điều khiển nhanh</strong>
              <button
                onClick={toggleAudio}
                className="w-full px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                disabled={!joined}
              >
                {muted ? "Bật Micro" : "Tắt Micro"}
              </button>
              <button
                onClick={toggleVideo}
                className="w-full px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                disabled={!joined}
              >
                {cameraOff ? "Bật Camera" : "Tắt Camera"}
              </button>
            </div>

            <div>
              <strong>Emoji nhanh</strong>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["😀", "🎉", "❤️", "👍", "😂", "😢"].map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      // send as chat message directly via datachannels
                      if (joined) sendChat(e);
                      else sendEmojiHelper(e);
                    }}
                    className="px-3 py-2 rounded bg-yellow-50 hover:bg-yellow-100"
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Nếu đã vào phòng, emoji sẽ gửi trực tiếp qua chat; nếu chưa, emoji sẽ được sao chép vào clipboard.
              </p>
            </div>

            <div>
              <strong>Ghi chú</strong>
              <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
                <li>Phòng sử dụng WebRTC trực tiếp với signaling server (không cần tài khoản).</li>
                <li>Không cần đăng nhập; chia sẻ link là đủ để người khác vào phòng.</li>
                <li>Hiện tại là mô hình peer-to-peer (mesh) — tốt cho vài người nhỏ, không tối ưu cho hàng chục người.</li>
                <li>
                  Nếu cần scaling (nhiều người, recording, lobby...), cân nhắc một SFU (ví dụ Jitsi self-host hoặc Janus) hoặc thêm server trung gian.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
