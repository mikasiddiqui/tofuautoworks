# Garage radio audio

These MP3s are browser-playable renders of authentic Super Nintendo / Super
Famicom SPC sound-chip dumps from [SNESmusic.org](https://snesmusic.org/v2/).
They are not MIDI arrangements. Sources were retrieved on 15 October 2026.

| Local file | Game / track | Archive file | Source set |
| --- | --- | --- | --- |
| `f-zero-mute-city.mp3` | F-Zero / Mute City | `fz-09.spc` | [F-Zero](https://snesmusic.org/v2/profile.php?profile=set&selected=840), project `fz` 1.03 |
| `chrono-trigger-wind-scene.mp3` | Chrono Trigger / Wind Scene | `ct-109.spc` | [Chrono Trigger](https://snesmusic.org/v2/profile.php?selected=345&set=), project `ct` 1.03 |
| `super-mario-world-overworld.mp3` | Super Mario World / Overworld | `smw-11a.spc` | [Super Mario World](https://snesmusic.org/v2/profile.php?profile=set&selected=2753), project `smw` 1.06 |
| `f-zero-big-blue.mp3` | F-Zero / Big Blue | `fz-02.spc` | F-Zero, project `fz` 1.03 |

F-Zero: composers Yumiko Kanki and Naoto Ishida; Nintendo. SPC dumpers Datschge
and nensondubois; tagged by Datschge.

Chrono Trigger: Wind Scene composed by Yasunori Mitsuda; Square. SPC dumper YK;
tagged by Datschge and YK. The source set also covers the Japanese release and
Satellaview music/character libraries.

Super Mario World: composed by Koji Kondo; Nintendo. SPC dumpers Datschge,
Agustin Huambachano, androl, nensondubois and KungFuFurby; tagged by Datschge
and Agustin Huambachano.

## Source notice

Music copyright belongs to the respective composers and publishers.
[SNESmusic.org's archive notice](https://snesmusic.org/v2/) describes its files
as being for educational and personal, non-profit preservation use. Inclusion
here does not grant a commercial or redistribution license. Obtain any needed
rights-holder permission before publishing these recordings on a commercial
site. These files are kept separate so they can readily be replaced.

## Rendering

The files were rendered with [Game Music Emu 0.6.4](https://github.com/libgme/game-music-emu/tree/0.6.4)
and FFmpeg 8.0.1 / libmp3lame: 32 kHz stereo, 96 kbps MP3, two-pass loudness
normalization targeting −18 LUFS / −2 dB true peak, and a five-second fade at
the end. Durations follow the archive track list: 110, 195, 87 and 128
seconds respectively. The player downloads audio only when the visitor starts
playback; it never autoplays on page load.

To reproduce a recording, download the appropriate RSN archive via the source
set page and extract it using a RAR-compatible utility. Build
`scripts/render-spc.cpp` against libgme, then:

```sh
render-spc fz-09.spc 110 > mute-city.s16le
ffmpeg -f s16le -ar 32000 -ac 2 -i mute-city.s16le \
  -af 'loudnorm=I=-18:TP=-2:LRA=11,afade=t=out:st=105:d=5' \
  -ar 32000 -c:a libmp3lame -b:a 96k \
  f-zero-mute-city.mp3
```

The example uses single-pass normalization; for an exact reproduction, measure
with `loudnorm=I=-18:TP=-2:LRA=11:print_format=json` first and supply the measured
values and offset to a second `loudnorm` pass with `linear=true`.

The emulator and extraction tools are used only during asset preparation; the
website has no runtime emulator dependency or connection to an audio CDN.
