# Tofu Auto Works

A static Next.js website with a Japanese pixel / personal-homepage style, a YouTube build log, and a Super Famicom soundtrack player.

## Development

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build log

The blog uses real uploads from [Tofu Auto Works on YouTube](https://www.youtube.com/@TofuAutoWorks). The checked-in snapshot in `src/data/videos.json` includes the original video titles, publication dates, thumbnails, durations, and watch links. Visitors can filter projects, load older posts, and play a video inline. YouTube embeds load only after a visitor selects a video; opening a video pauses the radio.

Refresh the snapshot before publishing new posts:

```sh
pnpm sync:youtube
```

The script reads the channel RSS feed, with a fallback to verified official channel and watch-page metadata. It retains previously imported uploads as an archive. If a refresh fails, the existing snapshot is preserved. Builds use the saved snapshot and do not contact YouTube; new uploads appear after refreshing and rebuilding, not live on every visit.

## Garage radio

The player uses local MP3 renders of original SPC soundtracks from [SNESmusic.org](https://snesmusic.org/v2/). These are authentic SNES audio, not MIDI arrangements. Playback begins only after a click and supports pause, seeking, previous/next track, volume, and a playlist. Audio assets load on demand.

Track provenance, composers, source archives, render details, and the source archive's usage conditions are recorded in [public/music/README.md](public/music/README.md).

## Static builds

```sh
pnpm build
pnpm build:gh-pages
```

The second command configures the `/tofuautoworks` base path, including local images and soundtrack assets. Keep the root build for hosting at a domain root. The site does not need a backend or API credentials.

Products and Contact currently display coming-soon notices. About is removed from navigation.
