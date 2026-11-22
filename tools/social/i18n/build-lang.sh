#!/usr/bin/env bash
# Build one language of a localised Instagram batch.
#   tools/social/i18n/build-lang.sh <lang> [stills|reels|all] [batch-03]
# stills: voiceover lines (scene timing), carousels, stories, reel covers, contact sheet + grid, captions.md
# reels:  render the reels (x264 veryfast) and lay the voiceover over the music
set -euo pipefail
cd "$(dirname "$0")/../../.."
lang=$1; phase=${2:-all}; batch=${3:-batch-03}
export NODE_PATH=$(npm root -g)
if [[ $phase == stills || $phase == all ]]; then
  python3 tools/social/i18n/voice.py tts "$lang" "$batch"
  node tools/social/build.js "$batch" --lang="$lang" --only=posts,stories
  node tools/social/build.js "$batch" --lang="$lang" --only=reels --covers-only
  node tools/social/build.js "$batch" --lang="$lang" --only=preview
  node tools/social/i18n/captions.js "$lang" "$batch"
fi
if [[ $phase == reels || $phase == all ]]; then
  node tools/social/build.js "$batch" --lang="$lang" --only=reels
  python3 tools/social/i18n/voice.py mix "$lang" "$batch"
fi
