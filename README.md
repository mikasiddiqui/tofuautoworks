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

## Publishing

Push commits to `main` to publish automatically at https://tofuautoworks.com.
[The deployment workflow](.github/workflows/deploy-pages.yml) installs the locked
dependencies, builds the static website, and deploys it through GitHub Pages.
Check progress under the repository's **Actions** tab. The current live version
stays available if a build fails.

GitHub Pages must use **Settings → Pages → Build and deployment → Source →
GitHub Actions**, with the custom domain set to `tofuautoworks.com`. This is a
one-time setup; subsequent pushes need no local deployment command or settings
changes. The `github-pages` environment must allow deployments from `main`.

The workflow reads the publishing path from GitHub Pages. A custom domain uses
root paths such as `/_next/`, `/logo.webp`, and `/music/`. A `github.io` project
site uses the repository path instead. Do not hardcode `/tofuautoworks` for the
custom domain: doing so makes CSS, JavaScript, images, and audio return 404.

`public/CNAME` records the domain and `public/.nojekyll` keeps Next.js assets
available if branch publishing is ever used again. The old `pnpm run deploy` and
`pnpm deploy:gh-pages` commands are only legacy branch-publishing fallbacks;
they are not needed for Actions and do not trigger an Actions deployment.

## Local static build

```sh
pnpm build
```

The static export is written to `build/` using root asset paths, matching the
custom domain. `pnpm build:gh-pages` remains an alias for the same build. To test
a repository-subpath deployment explicitly, use
`PAGES_BASE_PATH=/tofuautoworks pnpm build`. The site does not need a backend or
API credentials.

Products and Contact currently display coming-soon notices. About is removed from navigation.
