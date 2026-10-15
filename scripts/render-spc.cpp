// Development-only renderer; never shipped to the browser.
// Build against Game Music Emu (https://github.com/libgme/game-music-emu).
// Usage: render-spc input.spc seconds > output.s16le
// Output: 32000 Hz, stereo, signed 16-bit little-endian PCM.
#include "gme/gme.h"
#include <algorithm>
#include <cstdio>
#include <cstdlib>

static void check(gme_err_t error) {
  if (error) {
    std::fprintf(stderr, "%s\n", error);
    std::exit(1);
  }
}

int main(int argc, char **argv) {
  if (argc != 3 || std::atoi(argv[2]) <= 0) {
    std::fprintf(stderr, "Usage: render-spc input.spc seconds\n");
    return 1;
  }
  constexpr int sampleRate = 32000;
  Music_Emu *emu = nullptr;
  check(gme_open_file(argv[1], &emu, sampleRate));
  check(gme_start_track(emu, 0));
  int remaining = std::atoi(argv[2]) * sampleRate * 2;
  short samples[2048];
  unsigned char bytes[4096];
  while (remaining > 0) {
    const int count = std::min(remaining, 2048);
    check(gme_play(emu, count, samples));
    for (int i = 0; i < count; ++i) {
      const unsigned short sample = static_cast<unsigned short>(samples[i]);
      bytes[i * 2] = sample & 0xff;
      bytes[i * 2 + 1] = sample >> 8;
    }
    if (std::fwrite(bytes, 2, count, stdout) != static_cast<size_t>(count)) {
      std::fprintf(stderr, "Could not write audio\n");
      gme_delete(emu);
      return 1;
    }
    remaining -= count;
  }
  gme_delete(emu);
  return 0;
}
