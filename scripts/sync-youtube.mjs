#!/usr/bin/env node

// Run with Node 20+: node scripts/sync-youtube.mjs [--limit=15]
// The checked-in snapshot keeps static exports independent of YouTube uptime.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const channelId = "UCDqAevmQ5Zdmlr6e67KVEhQ";
const channelUrl = "https://www.youtube.com/@TofuAutoWorks";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const output = fileURLToPath(new URL("../src/data/videos.json", import.meta.url));
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? 15);

if (!Number.isInteger(limit) || limit < 1 || limit > 30) {
  throw new Error("--limit must be an integer between 1 and 30.");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0", "accept-language": "en-US,en;q=0.9" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return response.text();
}

function decodeXml(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number(entity.slice(1)));
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[entity];
  });
}

function xmlTag(xml, tag) {
  return decodeXml(xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "");
}

function extractJson(html, name) {
  const marker = `${name} = `;
  const start = html.indexOf(marker);
  if (start === -1) throw new Error(`YouTube did not include ${name}.`);
  const body = html.slice(start + marker.length);
  // YouTube embeds the response as one JSON object followed by a script terminator.
  const end = body.indexOf(";</script>");
  if (end === -1) throw new Error(`Cannot read YouTube's ${name} response.`);
  return JSON.parse(body.slice(0, end));
}

function findVideos(node, found = new Set()) {
  if (!node || typeof node !== "object") return found;
  const video = node.videoRenderer;
  const lockup = node.lockupViewModel;
  if (video?.videoId) found.add(video.videoId);
  if (lockup?.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" && lockup.contentId) found.add(lockup.contentId);
  for (const value of Object.values(node)) findVideos(value, found);
  return found;
}

async function fromFeed() {
  const xml = await fetchText(feedUrl);
  if (xmlTag(xml, "yt:channelId") !== channelId) throw new Error("Unexpected YouTube feed channel.");
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
    const id = xmlTag(entry, "yt:videoId");
    return {
      id,
      title: xmlTag(entry, "title"),
      publishedAt: xmlTag(entry, "published"),
      thumbnail: decodeXml(entry.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`),
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  });
  if (!videos.length) throw new Error("The YouTube feed contains no videos.");
  return videos.slice(0, limit);
}

async function fromChannel() {
  const html = await fetchText(`${channelUrl}/videos?hl=en`);
  const channel = extractJson(html, "ytInitialData");
  if (channel.metadata?.channelMetadataRenderer?.externalId !== channelId) {
    throw new Error("Channel identity verification failed.");
  }
  const ids = [...findVideos(channel.contents)].slice(0, limit);
  if (!ids.length) throw new Error("No videos found on the official channel page.");
  const videos = [];
  // Small batches keep this refresh polite to YouTube and avoid opening 30 requests at once.
  for (let offset = 0; offset < ids.length; offset += 3) {
    const batch = await Promise.all(ids.slice(offset, offset + 3).map(async (id) => {
      const url = `https://www.youtube.com/watch?v=${id}`;
      const page = await fetchText(`${url}&hl=en`);
      const player = extractJson(page, "ytInitialPlayerResponse");
      const details = player.videoDetails;
      const meta = player.microformat?.playerMicroformatRenderer;
      if (details?.channelId !== channelId || details.videoId !== id) {
        throw new Error(`Cannot verify channel ownership for ${id}.`);
      }
      if (!meta?.publishDate) throw new Error(`Cannot verify the publish date for ${id}.`);
      return {
        id,
        title: details.title,
        publishedAt: meta.publishDate,
        thumbnail: meta.thumbnail?.thumbnails?.[0]?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        durationSeconds: Number(details.lengthSeconds),
        url,
      };
    }));
    videos.push(...batch);
  }
  return videos;
}

async function main() {
  let source = feedUrl;
  let videos;
  try {
    videos = await fromFeed();
  } catch (error) {
    console.warn(`RSS unavailable (${error.message}). Reading the official channel and video metadata instead.`);
    source = `${channelUrl}/videos`;
    videos = await fromChannel();
  }
  for (const video of videos) {
    if (!/^[\w-]{11}$/.test(video.id) || !video.title || !Number.isFinite(Date.parse(video.publishedAt))) {
      throw new Error("Invalid video metadata; leaving the existing snapshot untouched.");
    }
  }
  // Keep earlier imported posts as the feed rolls over, forming a real archive.
  let previous = [];
  try {
    previous = JSON.parse(await readFile(output, "utf8")).videos ?? [];
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const merged = new Map(previous.map((video) => [video.id, video]));
  for (const video of videos) merged.set(video.id, { ...merged.get(video.id), ...video });
  const snapshot = {
    channelId,
    channelName: "Tofu Auto Works",
    channelUrl,
    feedUrl,
    source,
    fetchedAt: new Date().toISOString(),
    videos: [...merged.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
  };
  await mkdir(fileURLToPath(new URL("../src/data", import.meta.url)), { recursive: true });
  const temporary = `${output}.tmp`;
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
  await rename(temporary, output);
  console.log(`Synced ${videos.length} videos; ${snapshot.videos.length} posts saved to src/data/videos.json.`);
}

main().catch((error) => {
  console.error(`YouTube sync failed: ${error.message}\nThe existing snapshot has not been changed.`);
  process.exitCode = 1;
});
