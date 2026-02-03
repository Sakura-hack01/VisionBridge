#!/bin/bash
# Script to create placeholder icons using ImageMagick
# Install ImageMagick: sudo apt-get install imagemagick

# Create 16x16 icon
convert -size 16x16 xc:transparent -fill "#667eea" -draw "circle 8,8 8,3" icon16.png

# Create 48x48 icon
convert -size 48x48 xc:transparent -fill "#667eea" -draw "circle 24,24 24,10" -fill white -draw "circle 24,24 24,18" -fill "#667eea" -draw "circle 24,24 24,14" icon48.png

# Create 128x128 icon
convert -size 128x128 xc:transparent -fill "#667eea" -draw "circle 64,64 64,20" -fill white -draw "circle 64,64 64,50" -fill "#667eea" -draw "circle 64,64 64,38" icon128.png

echo "Icons created successfully!"
