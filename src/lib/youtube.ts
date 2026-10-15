import snapshot from "@/data/videos.json";

export type BuildVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  durationSeconds?: number;
  url: string;
};

export const youtubeChannel = {
  name: snapshot.channelName,
  url: snapshot.channelUrl,
  feedUrl: snapshot.feedUrl,
};

export const buildVideos: BuildVideo[] = snapshot.videos;

// YouTube titles use mathematical italic characters. Normalize these to letters
// so the site's Japanese pixel typeface and assistive technology can read them.
export function videoTitle(video: BuildVideo) {
  return video.title.normalize("NFKC");
}

export function videoProject(video: BuildVideo) {
  const title = videoTitle(video);
  if (/MR2|MR-C/i.test(title)) return "Group C MR2";
  if (/Miata|MX-?5/i.test(title)) return "Cyberpunk Miata";
  if (/S13|Silvia/i.test(title)) return "S13 Silvia";
  if (/Suzuki Twin/i.test(title)) return "Suzuki Twin";
  if (/Stagea|Sky-gea|GTR Wagon/i.test(title)) return "GTR Wagon";
  return "Garage & travels";
}

export function videoDate(video: BuildVideo) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Pacific/Auckland",
  }).format(new Date(video.publishedAt));
}

export function videoDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
