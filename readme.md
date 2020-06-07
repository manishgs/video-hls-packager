# Dependencies
- Shaka packager https://google.github.io/shaka-packager

```
curl -O https://github.com/google/shaka-packager/releases/download/v2.4.2/packager-linux

sudo install -m 755 ./packager-linux /usr/local/bin/packager
```

- ffmpeg https://www.ffmpeg.org/

```
sudo snap install ffmpeg
```



# Media Encoding
Shaka Packager does not do transcoding internally. 
We use ffmpeg here, which is a common tool used for transcoding.

- 360p

```
ffmpeg -i original.mp4 -c:a copy \
  -vf "scale=-2:360" \
  -c:v libx264 -profile:v baseline -level:v 3.0 \
  -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 \
  -minrate 600k -maxrate 600k -bufsize 600k -b:v 600k \
  -y h264_baseline_360p_600.mp4
```



# Video Player 
- videojs https://videojs.com/
- Shaka Player https://shaka-player-demo.appspot.com/



# References
- https://google.github.io/shaka-packager/html/tutorials/encoding.html
- https://google.github.io/shaka-packager/html/index.html
