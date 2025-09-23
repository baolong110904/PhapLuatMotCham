"use client"

type Listener = (s: { speaking: boolean; paused: boolean; text?: string }) => void

class GlobalTTS {
  private utterance: SpeechSynthesisUtterance | null = null
  private paused = false
  private speaking = false
  private listeners: Listener[] = []

  subscribe(l: Listener) {
    this.listeners.push(l)
    l({ speaking: this.speaking, paused: this.paused, text: this.utterance?.text })
    return () => { this.listeners = this.listeners.filter(x => x !== l) }
  }

  private emit() {
    const state = { speaking: this.speaking, paused: this.paused, text: this.utterance?.text }
    this.listeners.forEach(l => l(state))
  }

  private selectVietnameseVoice(): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null
    const voices = speechSynthesis.getVoices()
    // Try to prefer a Vietnamese voice that sounds female/young (heuristic).
    // There is no gender metadata in the Web Speech API, so we use voice names and language as hints.
    const femaleKeywords = /female|woman|lady|girl|girl|girlvoice|femalevoice|womanvoice|young|child|kid|baby|bé|trẻ|nữ/i
    // 1) Vietnamese voices with female/child keywords in name
    let v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi') && femaleKeywords.test(v.name))
    if (v) return v
    // 2) Any Vietnamese voice
    v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi'))
    if (v) return v
    // 3) Any voice with female/child keywords (non-vi fallback)
    v = voices.find(v => femaleKeywords.test(v.name))
    if (v) return v
    // 4) Names mentioning Vietnam
    v = voices.find(v => /viet|vietnam/i.test(v.name))
    if (v) return v
    // 5) final fallback to first available voice
    return voices[0] ?? null
  }

  async speak(text: string, lang = 'vi-VN') {
    if (!('speechSynthesis' in window)) return Promise.reject(new Error('SpeechSynthesis not supported'))
    // stop any audio playback managed elsewhere should be handled by caller
    // cancel existing TTS
    this.stop()

    // ensure voices loaded
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise<void>(res => {
        const onVoices = () => { res(); speechSynthesis.removeEventListener('voiceschanged', onVoices) }
        speechSynthesis.addEventListener('voiceschanged', onVoices)
        // timeout fallback
        setTimeout(() => res(), 500)
      })
    }

    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    const voice = this.selectVietnameseVoice()
    if (voice) u.voice = voice

    u.onstart = () => { this.speaking = true; this.paused = false; this.utterance = u; this.emit() }
    u.onend = () => { this.speaking = false; this.paused = false; this.utterance = null; this.emit() }
    u.onerror = () => { this.speaking = false; this.paused = false; this.utterance = null; this.emit() }

    // Some browsers require calling speechSynthesis.speak in same tick
    try {
      speechSynthesis.speak(u)
    } catch (e) {
      console.error('TTS speak failed', e)
      return Promise.reject(e)
    }
    this.utterance = u
    this.emit()
    return Promise.resolve()
  }

  pause() {
    if (!('speechSynthesis' in window)) return
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      this.paused = true
      this.emit()
    }
  }

  resume() {
    if (!('speechSynthesis' in window)) return
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      this.paused = false
      this.emit()
    }
  }

  stop() {
    if (!('speechSynthesis' in window)) return
    try {
      speechSynthesis.cancel()
    } catch {}
    this.utterance = null
    this.paused = false
    this.speaking = false
    this.emit()
  }
}

const globalTTS = new GlobalTTS()

export default globalTTS

export function extractPageText(): string {
  // Try main, article, or fall back to body. Filter out scripts, nav, footer and too short text nodes.
  const selectors = ['main', 'article', '[role=main]']
  let el: Element | null = null
  for (const s of selectors) {
    el = document.querySelector(s)
    if (el) break
  }
  if (!el) el = document.body

  const forbidden = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'NAV', 'FOOTER', 'HEADER'])
  function gather(n: Node): string[] {
    const out: string[] = []
    n.childNodes.forEach(c => {
      if (c.nodeType === Node.TEXT_NODE) {
        const t = c.textContent?.trim() ?? ''
        if (t.length > 20) out.push(t)
      } else if (c.nodeType === Node.ELEMENT_NODE) {
        const elc = c as Element
        if (forbidden.has(elc.tagName)) return
        // ignore elements that are aria-hidden or visually hidden
        const style = window.getComputedStyle(elc)
        if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return
        out.push(...gather(c))
      }
    })
    return out
  }

  const parts = gather(el)
  // join with pauses (periods) to help the TTS
  return parts.join('. ')
}
