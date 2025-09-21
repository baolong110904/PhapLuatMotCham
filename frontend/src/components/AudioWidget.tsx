"use client"

import React, { useEffect, useRef, useState } from 'react'
import globalAudio from '../lib/globalAudio'

export default function AudioWidget() {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const unsub = globalAudio.subscribe(s => {
      setPlaying(!!s.playing)
      setPaused(!!s.paused)
      setCurrentSrc(s.currentSrc)
      // If there's an active audio session and not paused, keep widget visible
      // but we don't auto-open UI unless user started it
    })
    return () => unsub()
  }, [])

  const startAll = () => {
    const servicesList = ['/assets/dichvuhotro.mp3', '/assets/saoy.mp3', '/assets/cccd.mp3', '/assets/luonghuu.mp3', '/assets/xacnhancutru.mp3', '/assets/nhadat.mp3', '/assets/dichuc.mp3']
    const list = ['/audio1.mp3', ...servicesList, '/assets/cachthuchoatdong.mp3']
    globalAudio.playAll(list).catch?.(() => {})
    setOpen(true)
  }

  const restart = () => {
    globalAudio.playIndex(0)
    setOpen(true)
  }

  const pauseOrResume = () => {
    globalAudio.togglePause()
    // keep menu open while paused (per request)
    setOpen(true)
  }

  const stop = () => {
    globalAudio.stop()
    // keep widget open so user can restart
    setOpen(true)
  }

  // click outside: if menu open, resume if paused and close back to circular
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) {
        // clicked outside -> just close menu. Do NOT resume automatically when paused.
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 9999 }}>
      {/* Circular main button */}
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở điều khiển âm thanh"
          title="Mở điều khiển âm thanh"
          className="w-20 h-20 rounded-full bg-[#1446a0] text-white flex flex-col items-center justify-center shadow-lg text-sm px-2 transition-transform transform hover:scale-105 active:scale-95 hover:shadow-xl cursor-pointer ring-4 ring-transparent focus:outline-none focus:ring-[#8fb3e6]"
        >
          {/* Always show icon; do not auto-start playlist. When audio is active show paused/playing icon and label. */}
          {currentSrc ? (
            <>
              {paused ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M4 2v20l16-10L4 2z" />
                </svg>
              )}
              <span className="text-sm font-semibold">{paused ? 'Tạm dừng' : 'Đang phát'}</span>
            </>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
              <path d="M4 2v20l16-10L4 2z" />
            </svg>
          )}
        </button>

        {open && (
          <div className="mt-2 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 min-w-[160px]">
            <button onClick={pauseOrResume} className="px-4 py-3 rounded-lg bg-yellow-400 text-[#0b3b8a] font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">{paused ? 'Tiếp tục' : 'Tạm dừng'}</button>
            <button onClick={restart} className="px-4 py-3 rounded-lg bg-[#1446a0] text-white font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">Phát lại</button>
            <button onClick={stop} className="px-4 py-3 rounded-lg bg-red-500 text-white font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">Dừng</button>
          </div>
        )}
      </div>
    </div>
  )
}
