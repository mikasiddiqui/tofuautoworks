"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./MusicPlayer.module.css";

const tracks = [
  {
    title: "Mute City",
    game: "F-Zero",
    file: "f-zero-mute-city.mp3",
    duration: 110,
    source: "https://snesmusic.org/v2/profile.php?profile=set&selected=840",
  },
  {
    title: "Wind Scene",
    game: "Chrono Trigger",
    file: "chrono-trigger-wind-scene.mp3",
    duration: 195,
    source: "https://snesmusic.org/v2/profile.php?selected=345&set=",
  },
  {
    title: "Overworld",
    game: "Super Mario World",
    file: "super-mario-world-overworld.mp3",
    duration: 87,
    source: "https://snesmusic.org/v2/profile.php?profile=set&selected=2753",
  },
  {
    title: "Big Blue",
    game: "F-Zero",
    file: "f-zero-big-blue.mp3",
    duration: 128,
    source: "https://snesmusic.org/v2/profile.php?profile=set&selected=840",
  },
];

const audioPath = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/music/${file}`;

function timeLabel(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function TransportIcon({ kind }: { kind: "previous" | "next" | "play" | "pause" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
      {kind === "play" && <path d="M5 2h3v2h3v2h3v6h-3v2H8v2H5z" />}
      {kind === "pause" && <path d="M4 3h4v12H4zM11 3h4v12h-4z" />}
      {kind === "previous" && <path d="M2 3h3v12H2zM13 3h3v12h-3v-2h-3v-2H7V7h3V5h3z" />}
      {kind === "next" && <path d="M13 3h3v12h-3zM2 3h3v2h3v2h3v4H8v2H5v2H2z" />}
    </svg>
  );
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const wantsPlayback = useRef(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(tracks[0].duration);
  const [volume, setVolume] = useState(40);
  const [error, setError] = useState("");
  const playerId = useId();
  const track = tracks[trackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    function pauseForVideo() {
      ++requestRef.current;
      wantsPlayback.current = false;
      audioRef.current?.pause();
      setLoading(false);
      setPlaying(false);
    }
    window.addEventListener("tofu:video-play", pauseForVideo);
    return () => window.removeEventListener("tofu:video-play", pauseForVideo);
  }, []);

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    wantsPlayback.current = true;
    setError("");
    setLoading(true);
    if (audio.error) audio.load();
    try {
      await audio.play();
      if (request === requestRef.current) {
        setStarted(true);
        setLoading(false);
      }
    } catch (reason) {
      if (request !== requestRef.current) return;
      wantsPlayback.current = false;
      setLoading(false);
      setPlaying(false);
      if (!(reason instanceof DOMException && reason.name === "AbortError")) {
        setError("Couldn’t play this track. Press play to retry.");
      }
    }
  }

  function pause() {
    ++requestRef.current;
    wantsPlayback.current = false;
    audioRef.current?.pause();
    setLoading(false);
    setPlaying(false);
  }

  function selectTrack(index: number, shouldPlay: boolean) {
    const audio = audioRef.current;
    if (!audio) return;
    ++requestRef.current;
    const next = (index + tracks.length) % tracks.length;
    audio.pause();
    audio.src = audioPath(tracks[next].file);
    wantsPlayback.current = shouldPlay;
    setTrackIndex(next);
    setPosition(0);
    setDuration(tracks[next].duration);
    setPlaying(false);
    setLoading(false);
    setError("");
    if (shouldPlay) void play();
  }

  return (
    <section className={styles.player} aria-labelledby={`${playerId}-title`}>
      <div className={styles.titleBar}>
        <h2 id={`${playerId}-title`}><span aria-hidden="true">♫</span> GARAGE RADIO</h2>
        <span aria-hidden="true">− □</span>
      </div>

      <div className={styles.body}>
        <div className={styles.kicker}><span lang="ja">音楽プレーヤー</span><span>16-BIT</span></div>

        <div className={styles.display}>
          <div className={styles.displayTop}>
            <span>{loading ? "LOADING" : playing ? "PLAYING" : started ? "PAUSED" : "PRESS PLAY"}</span>
            <span>{String(trackIndex + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}</span>
          </div>
          <p className={styles.trackTitle}>{track.title}</p>
          <p className={styles.gameTitle}>{track.game}</p>
          <div className={styles.meterRow}>
            <div className={`${styles.equalizer} ${playing && !loading ? styles.active : ""}`} aria-hidden="true">
              {[4, 7, 5, 9, 6, 4, 8, 5, 7, 3, 6, 4].map((height, index) => (
                <span key={index} style={{ height: `${height * 2}px`, animationDelay: `${index * -0.13}s` }} />
              ))}
            </div>
            <span className={styles.clock}>{timeLabel(position)}</span>
          </div>
        </div>

        <div className={styles.playbackControls}>
          <div className={styles.seekRow}>
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={Math.min(position, duration)}
            aria-label="Track position"
            aria-valuetext={`${timeLabel(position)} of ${timeLabel(duration)}`}
            onChange={(event) => {
              const seconds = Number(event.target.value);
              const audio = audioRef.current;
              if (audio && audio.readyState > 0) {
                audio.currentTime = seconds;
                setPosition(seconds);
              }
            }}
          />
          <span>{timeLabel(duration)}</span>
        </div>

        <div className={styles.transport}>
          <button type="button" aria-label="Previous track" onClick={() => selectTrack(trackIndex - 1, wantsPlayback.current)}>
            <TransportIcon kind="previous" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            aria-label={playing || loading ? "Pause music" : "Play music"}
            onClick={() => playing || loading ? pause() : void play()}
          >
            <TransportIcon kind={playing || loading ? "pause" : "play"} />
            <span>{playing || loading ? "PAUSE" : "PLAY"}</span>
          </button>
          <button type="button" aria-label="Next track" onClick={() => selectTrack(trackIndex + 1, wantsPlayback.current)}>
            <TransportIcon kind="next" />
          </button>
        </div>

        <div className={styles.volumeRow}>
          <label htmlFor={`${playerId}-volume`}>VOL</label>
          <input id={`${playerId}-volume`} type="range" min="0" max="100" step="1" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
          <span>{String(volume).padStart(2, "0")}</span>
        </div>
        </div>

        <p className={styles.error} role="status" hidden={!error}>{error}</p>

        <details className={styles.playlistPanel}>
          <summary>PLAYLIST <span>04 TRACKS +</span></summary>
          <ol className={styles.playlist} aria-label="SNES soundtrack playlist">
          {tracks.map((item, index) => (
            <li key={item.file}>
              <button
                type="button"
                className={index === trackIndex ? styles.selectedTrack : undefined}
                aria-current={index === trackIndex ? "true" : undefined}
                aria-label={`Play ${item.title} from ${item.game}`}
                onClick={() => selectTrack(index, true)}
              >
                <span className={styles.trackNumber}>{index === trackIndex ? "▸" : String(index + 1).padStart(2, "0")}</span>
                <span><strong>{item.title}</strong><small>{item.game}</small></span>
              </button>
            </li>
          ))}
          </ol>
        </details>

        <div className={styles.credit}>
          <span>SNES / SUPER FAMICOM</span>
          <a href={track.source} target="_blank" rel="noopener noreferrer">Music via SNESmusic.org ↗</a>
          <span className={styles.rights}>Music © respective owners.</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        // Keep React's initial src stable: selectTrack owns later source changes,
        // so re-rendering cannot interrupt a play() started in a user gesture.
        src={audioPath(tracks[0].file)}
        preload="none"
        onPlaying={() => { setPlaying(true); setLoading(false); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => { if (wantsPlayback.current) setLoading(true); }}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const length = event.currentTarget.duration;
          if (Number.isFinite(length)) setDuration(length);
        }}
        onEnded={() => selectTrack(trackIndex + 1, true)}
        onError={() => {
          wantsPlayback.current = false;
          setLoading(false);
          setPlaying(false);
          setError("Track unavailable. Try another track or press play to retry.");
        }}
      />
    </section>
  );
}
