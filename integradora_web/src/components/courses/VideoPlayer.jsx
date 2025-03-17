"use client"

import { useState, useRef, useEffect } from "react"

const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      if (!isNaN(video.duration)) { 
        setDuration(video.duration) // Solo se establece si el valor es válido
      }
    }

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (Number.parseInt(e.target.value) / 100) * video.duration
    video.currentTime = newTime
    setProgress(Number.parseInt(e.target.value))
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseInt(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
  
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.webkitRequestFullscreen) { // Para navegadores basados en WebKit (Safari)
        video.webkitRequestFullscreen()
      } else if (video.msRequestFullscreen) { // Para Internet Explorer / Edge antiguo
        video.msRequestFullscreen()
      }
    }
  }


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="video-player-container position-relative bg-dark rounded overflow-hidden">
      <video ref={videoRef} src={src} className="w-100" onClick={togglePlay} />
      <div className="video-controls position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50">
        <input
          type="range"
          className="form-range mb-2"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
        />
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button className="btn btn-sm btn-link text-white p-1" onClick={togglePlay}>
              <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} mr-2`}></i>
            </button>
            <div className="d-flex align-items-center ms-2">
              <i className="bi bi-volume-up text-white mr-2"></i>
              <input
                type="range"
                className="form-range mr-3"
                style={{ width: "80px" }}
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
              />
            </div>
            <span className="text-white ms-3 medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button className="btn btn-sm btn-link text-white p-1" onClick={toggleFullscreen}>
            <i className="bi bi-fullscreen"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer

