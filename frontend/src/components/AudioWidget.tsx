"use client"

import React, { useEffect, useRef, useState } from 'react'
import globalAudio from '../lib/globalAudio'
import globalTTS, { extractPageText } from '../lib/globalTTS'

export default function AudioWidget() {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  // track whether current playback is using audio playlist or TTS
  const [mode, setMode] = useState<'audio' | 'tts' | null>(null)
  const lastTtsTextRef = useRef<string | null>(null)
  const userActiveRef = useRef(false)
  const [, setUserActive] = useState(false)
  const userPausedRef = useRef(false)
  const [userPaused, setUserPaused] = useState(false)
  const [hasBeenRead, setHasBeenRead] = useState(false)
  const modeRef = useRef<typeof mode>(null)

  function setModeAndRef(v: 'audio' | 'tts' | null) {
    setMode(v)
    modeRef.current = v
  }

  useEffect(() => {
    const unsub = globalAudio.subscribe(s => {
      setPlaying(!!s.playing)
      setPaused(!!s.paused)
      setCurrentSrc(s.currentSrc)
      // Update userPaused to match the actual audio state
      userPausedRef.current = !!s.paused
      setUserPaused(!!s.paused)
      // Only clear audio mode when playback truly stopped (no currentSrc).
      // This avoids clearing mode during short transitions between tracks
      // where `playing` may briefly be false while the next `Audio` is created.
      if (modeRef.current === 'audio' && !s.playing && !s.paused && userActiveRef.current) {
        if (!s.currentSrc) {
          userActiveRef.current = false
          setUserActive(false)
          userPausedRef.current = false
          setUserPaused(false)
          setModeAndRef(null)
        }
      }
    })
    return () => unsub()
  }, [])

  const startAll = () => {
    const servicesList = ['/assets/dichvuhotro.mp3', '/assets/saoy.mp3', '/assets/cccd.mp3', '/assets/luonghuu.mp3', '/assets/xacnhancutru.mp3', '/assets/nhadat.mp3', '/assets/dichuc.mp3']
    const list = ['/audio1.mp3', ...servicesList, '/assets/cachthuchoatdong.mp3']
    globalAudio.playAll(list).catch?.(() => {})
    setOpen(true)
  }

  // TTS controls
  const [ttsSpeaking, setTtsSpeaking] = useState(false)
  const [, setTtsPaused] = useState(false)

  useEffect(() => {
    const unsub = globalTTS.subscribe(s => {
      setTtsSpeaking(!!s.speaking)
      setTtsPaused(!!s.paused)
      // clear TTS mode when it finishes (not when paused)
      if (!s.speaking && !s.paused && userActiveRef.current) {
        userActiveRef.current = false
        setUserActive(false)
        userPausedRef.current = false
        setUserPaused(false)
        setModeAndRef(null)
      }
    })
    return () => unsub()
  }, [])

  // Observe changes in the main content and restart TTS when content updates
  useEffect(() => {
    // Reset hasBeenRead when URL changes
    setHasBeenRead(false)
    
    if (typeof window === 'undefined') return
    const selectors = ['main', 'article', '[role=main]']
    let target: Element | null = null
    for (const s of selectors) {
      target = document.querySelector(s)
      if (target) break
    }
    if (!target) target = document.body

    const mo = new MutationObserver(() => {
      if (mode === 'tts' && lastTtsTextRef.current) {
        // re-extract text and restart if different
        const newText = extractPageText()
        if (newText && newText.trim() && newText !== lastTtsTextRef.current) {
          lastTtsTextRef.current = newText
          globalTTS.stop()
          globalTTS.speak(newText, 'vi-VN').catch?.(() => {})
        }
      }
    })
    mo.observe(target, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [mode])

  const readPage = async () => {
    // Mark page as being read
    setHasBeenRead(true)
    
    // If on / or /home use the existing audio playlist instead of TTS
    const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '/'
    if (path === '/' || path === '/home') {
      // play the preserved home playlist
      startAll()
      userActiveRef.current = true
      setUserActive(true)
      userPausedRef.current = false
      setUserPaused(false)
      setModeAndRef('audio')
      return
    }

    // stop any regular audio and start TTS for other pages
    globalAudio.stop()
    try {
      const text = extractPageText()
      if (!text || text.trim().length === 0) return
  lastTtsTextRef.current = text
  userActiveRef.current = true
  setUserActive(true)
  userPausedRef.current = false
  setUserPaused(false)
  await globalTTS.speak(text, 'vi-VN')
  setModeAndRef('tts')
      setOpen(true)
    } catch (e) {
      console.error('Failed to start TTS', e)
    }
  }

  const stopReading = () => {
    if (mode === 'audio') {
      globalAudio.stop()
    } else {
      globalTTS.stop()
    }
    setOpen(true)
    userActiveRef.current = false
    setUserActive(false)
    userPausedRef.current = false
    setUserPaused(false)
    setModeAndRef(null)
  }

  const pauseOrResumeReading = () => {
    // First update our internal state
    const newPausedState = !userPausedRef.current
    userPausedRef.current = newPausedState
    setUserPaused(newPausedState)

    // Then control the audio based on mode
    if (modeRef.current === 'audio') {
      globalAudio.togglePause()
    } else if (modeRef.current === 'tts') {
      if (newPausedState) {
        globalTTS.pause()
      } else {
        globalTTS.resume()
      }
    }
    
    // Keep menu open
    setOpen(true)
  }

  const restart = () => {
    // First update our internal state
    userActiveRef.current = true
    setUserActive(true)
    userPausedRef.current = false
    setUserPaused(false)

    // Then restart based on mode
    if (modeRef.current === 'audio') {
      globalAudio.playIndex(0)
    } else if (modeRef.current === 'tts') {
      const t = lastTtsTextRef.current
      if (t) {
        globalTTS.stop()
        globalTTS.speak(t, 'vi-VN').catch?.(() => {})
      }
    }
    
    // Keep menu open
    setOpen(true)
  }

  // Removed unused functions pauseOrResume and stop as they are not being used

  // click outside: only close the menu, don't affect audio state
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) {
        // Just close the menu without affecting audio state
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
          onClick={() => {
            // Only start reading if the page hasn't been read before and there's no active playback
            if (!hasBeenRead && !userActiveRef.current && !userPaused && !ttsSpeaking && !playing) {
              readPage()
            }
            // Always open the control menu
            setOpen(true)
          }}
          aria-label="Mở điều khiển âm thanh" 
          title="Mở điều khiển âm thanh"
          className="w-20 h-20 rounded-full bg-[#1446a0] text-white flex flex-col items-center justify-center shadow-lg text-sm px-2 transition-transform transform hover:scale-105 active:scale-95 hover:shadow-xl cursor-pointer ring-4 ring-transparent focus:outline-none focus:ring-[#8fb3e6]"
        >
          {/* Show icon and state based on current playback */}
          {currentSrc || ttsSpeaking ? (
            <>
              {paused || userPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M4 2v20l16-10L4 2z" />
                </svg>
              )}
              <span className="text-sm font-semibold">{paused || userPaused ? 'Tạm dừng' : 'Đang phát'}</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                <path d="M4 2v20l16-10L4 2z" />
              </svg>
              <span className="text-sm font-semibold">Đọc toàn bộ</span>
            </>
          )}
        </button>

        {open && (
          <div className="mt-2 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 min-w-[160px]">
            <>
              <button onMouseDown={(e) => e.stopPropagation()} onClick={pauseOrResumeReading} className="px-4 py-3 rounded-lg bg-yellow-400 text-[#0b3b8a] font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">{userPaused ? 'Tiếp tục' : 'Tạm dừng'}</button>
              <button onMouseDown={(e) => e.stopPropagation()} onClick={restart} className="px-4 py-3 rounded-lg bg-[#1446a0] text-white font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">Phát lại</button>
              <button onMouseDown={(e) => e.stopPropagation()} onClick={stopReading} className="px-4 py-3 rounded-lg bg-red-500 text-white font-semibold text-base transition-transform transform hover:scale-102 active:scale-95 hover:shadow-md focus:outline-none">Dừng</button>
            </>
          </div>
        )}
      </div>
    </div>
  )
}
