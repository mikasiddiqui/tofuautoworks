"use client";

import Image from "next/image";
import { useState } from "react";
import {
  buildVideos,
  videoDate,
  videoDuration,
  videoProject,
  videoTitle,
  youtubeChannel,
} from "@/lib/youtube";
import styles from "./BuildLog.module.css";

const projects = [...new Set(buildVideos.map(videoProject))];
const pageSize = 3;

export default function BuildLog() {
  const [project, setProject] = useState("All projects");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videos = buildVideos.filter((video) => project === "All projects" || videoProject(video) === project);

  function changeProject(value: string) {
    setProject(value);
    setVisibleCount(pageSize);
    setPlayingId(null);
  }

  function playVideo(id: string) {
    window.dispatchEvent(new CustomEvent("tofu:video-play"));
    setPlayingId(id);
  }

  return (
    <section className={styles.blog} id="build-log" aria-labelledby="build-log-title">
      <header className={styles.heading}>
        <div className={styles.headingRow}>
          <h1 id="build-log-title">The build log</h1>
          <span lang="ja">製作日記</span>
        </div>
        <p>Projects, experiments & life in the workshop. Straight from our YouTube channel.</p>
        <div className={styles.filters}>
          <label htmlFor="project-filter">Browse</label>
          <select id="project-filter" value={project} onChange={(event) => changeProject(event.target.value)}>
            <option>All projects</option>
            {projects.map((name) => <option key={name}>{name}</option>)}
          </select>
          <span className={styles.count} aria-live="polite">{videos.length} videos</span>
        </div>
      </header>

      <div className={styles.posts}>
        {videos.slice(0, visibleCount).map((video, index) => (
          <article className={styles.post} key={video.id}>
            <div className={styles.postMeta}>
              <time dateTime={video.publishedAt}>{videoDate(video)}</time>
              <span>{videoProject(video)}</span>
            </div>
            <div className={styles.media}>
              {playingId === video.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={videoTitle(video)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button type="button" className={styles.thumbnail} onClick={() => playVideo(video.id)} aria-label={`Play ${videoTitle(video)}`}>
                  <Image
                    src={video.thumbnail}
                    alt={`Video thumbnail: ${videoTitle(video)}`}
                    width={1280}
                    height={720}
                    unoptimized
                    loading={index === 0 ? "eager" : "lazy"}
                    className={styles.image}
                  />
                  <span className={styles.play} aria-hidden="true">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M5 2h3v2h3v2h3v2h3v4h-3v2h-3v2H8v2H5z" /></svg>
                    Play video
                  </span>
                  {video.durationSeconds ? <span className={styles.duration}>{videoDuration(video.durationSeconds)}</span> : null}
                </button>
              )}
            </div>
            <div className={styles.postBody}>
              <h2>{videoTitle(video)}</h2>
              <div className={styles.postActions}>
                <a href={video.url} target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a>
                {playingId === video.id && (
                  <button type="button" onClick={() => setPlayingId(null)}>Close video</button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        {visibleCount < videos.length && (
          <button type="button" className={styles.more} onClick={() => setVisibleCount((count) => count + pageSize)}>
            Show more videos <span aria-hidden="true">↓</span>
          </button>
        )}
        <a href={`${youtubeChannel.url}/videos`} target="_blank" rel="noopener noreferrer">Visit the full YouTube archive <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
  );
}
