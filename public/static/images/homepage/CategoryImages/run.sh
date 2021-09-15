#!/bin/bash

for i in *.png; do
    #-magick t.jpg -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace sRGB t-magick.jpg
    magick $i -colors 255 ./build/$i
    printf "$i\n"
done