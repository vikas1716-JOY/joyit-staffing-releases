#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="$DIR/index.html"

# Try Chrome first
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ -f "$CHROME" ]; then
    "$CHROME" --app="file://$HTML" --window-size=1280,820 &
    exit 0
fi

# Try Edge
EDGE="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
if [ -f "$EDGE" ]; then
    "$EDGE" --app="file://$HTML" --window-size=1280,820 &
    exit 0
fi

# Fallback - open in Safari
open "$HTML"
