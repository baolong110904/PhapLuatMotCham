import { WebSocketServer, WebSocket } from "ws";
import http from "http";

type Socket = WebSocket & { room?: string; id?: string };

export function createSignalingServer(server: http.Server) {
  const wss = new WebSocketServer({ server });

  const rooms = new Map<string, Set<Socket>>();

  wss.on("connection", (ws: Socket) => {
    ws.id = Math.random().toString(36).slice(2, 9);
    console.log("WS connected", ws.id);
    // send assigned id to the client
    try {
      ws.send(JSON.stringify({ type: "id", id: ws.id }));
    } catch (e) {}

    ws.on("message", (data: any) => {
      try {
        const msg = JSON.parse(data.toString());
        console.log('WS message from', ws.id, msg.type, msg.room || msg.to || '');
        const { type, room, payload, to } = msg;

        if (type === "join" && room) {
          // tell joiner who is already in the room
          const existing = rooms.get(room);
          const peers = existing ? Array.from(existing).map((s) => s.id) : [];
          try {
            ws.send(JSON.stringify({ type: "peers", peers }));
          } catch (e) {}

          // add to room and notify others
          ws.room = room;
          if (!rooms.has(room)) rooms.set(room, new Set());
          rooms.get(room)!.add(ws);
          broadcast(room, { type: "peer-joined", id: ws.id }, ws);
          return;
        }

        if (type === "leave") {
          if (ws.room) {
            const s = rooms.get(ws.room);
            s?.delete(ws);
            broadcast(ws.room, { type: "peer-left", id: ws.id }, ws);
            delete ws.room;
          }
          return;
        }

        // If 'to' is provided, route only to that peer
        if (to && ws.room) {
          const s = rooms.get(ws.room);
          if (!s) return;
          for (const c of s) {
            if (c.id === to && c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type, from: ws.id, payload }));
              break;
            }
          }
          return;
        }

        // Otherwise broadcast to room (excluding sender)
        if (ws.room) {
          broadcast(ws.room, { type, id: ws.id, payload }, ws);
        }
      } catch (e) {
        // ignore malformed
      }
    });

    ws.on("close", () => {
      if (ws.room) {
        const s = rooms.get(ws.room);
        s?.delete(ws);
        broadcast(ws.room, { type: "peer-left", id: ws.id }, ws);
        delete ws.room;
      }
      console.log("WS disconnected", ws.id);
    });
  });

  function broadcast(room: string, msg: any, except?: Socket) {
    const s = rooms.get(room);
    if (!s) return;
    const str = JSON.stringify(msg);
    for (const c of s) {
      if (c !== except && c.readyState === WebSocket.OPEN) {
        c.send(str);
      }
    }
  }

  return wss;
}
