type Listener = (state: { playing: boolean; paused: boolean; currentSrc?: string; index?: number }) => void

class GlobalAudio {
  private audio: HTMLAudioElement | null = null
  private playlist: string[] = []
  private index = 0
  private listeners: Listener[] = []
  private paused = false

  subscribe(l: Listener) {
    this.listeners.push(l)
    // emit current state
    l({ playing: !!this.audio && !this.audio.paused, paused: this.paused, currentSrc: this.audio?.src, index: this.index })
    return () => {
      this.listeners = this.listeners.filter(x => x !== l)
    }
  }

  private emit() {
    const state = { playing: !!this.audio && !this.audio.paused, paused: this.paused, currentSrc: this.audio?.src, index: this.index }
    this.listeners.forEach(l => l(state))
  }

  setPlaylist(list: string[]) {
    this.playlist = list
    this.index = 0
  }

  async playAll(list: string[]) {
    this.setPlaylist(list)
    this.index = 0
    await this.playIndex(this.index)
  }

  async playIndex(i: number) {
    if (!this.playlist || i >= this.playlist.length) {
      this.stop()
      return
    }
    this.index = i
    if (this.audio) {
      try {
        this.audio.pause()
        this.audio.currentTime = 0
      } catch {}
    }
    const src = this.playlist[this.index]
    const a = new Audio(src)
    this.audio = a
    this.paused = false
    a.onended = () => {
      this.index++
      if (this.index < this.playlist.length) {
        // play next
        this.playIndex(this.index)
      } else {
        this.stop()
      }
    }
    a.onplay = () => this.emit()
    a.onpause = () => this.emit()
    try {
      const p = a.play()
      if (p && typeof p.then === 'function') await p
    } catch (e) {
      console.error('GlobalAudio play failed', e)
      this.stop()
    }
    this.emit()
  }

  async playSingle(src: string) {
    // stop global playlist
    this.stop()
    const a = new Audio(src)
    this.audio = a
    this.paused = false
    a.onended = () => this.stop()
    a.onplay = () => this.emit()
    a.onpause = () => this.emit()
    try {
      const p = a.play()
      if (p && typeof p.then === 'function') await p
    } catch (e) {
      console.error('GlobalAudio playSingle failed', e)
      this.stop()
    }
    this.emit()
  }

  togglePause() {
    if (!this.audio) return
    if (this.paused) {
      this.audio.play().catch(e => console.error(e))
      this.paused = false
    } else {
      this.audio.pause()
      this.paused = true
    }
    this.emit()
  }

  stop() {
    if (this.audio) {
      try {
        this.audio.pause()
        this.audio.currentTime = 0
      } catch {}
    }
    this.audio = null
    this.playlist = []
    this.index = 0
    this.paused = false
    this.emit()
  }
}

const globalAudio = new GlobalAudio()

export default globalAudio
