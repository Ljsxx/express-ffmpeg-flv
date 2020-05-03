# 浏览器显示海康摄像头实时预览画面纯前端解决方案
> 将海康设备的 rtsp 协议视频流通过 ffmpeg 转码为 flv 实时视频流，并将实时视频流通过 express 服务生成 http 长链接或 ws 返回。
> 最后通过b站开源的 flv.js 插件在浏览器上显示直播画面。

## 安装 ffmpeg
  - <a href="http://www.ffmpeg.org/download.html" target="_blank">下载ffmpeg</a>
  - 安装 **fluent-ffmpeg** 插件
    > npm i fluent-ffmpeg
  - 指定 ffmpeg 的安装地址
    > ffmpeg.setFfmpegPath("G:/app/ffmpeg-20200108-5bd0010-win64-static/ffmpeg-20200108-5bd0010-win64-static/bin/ffmpeg");
    
    
## 修改配置
  修改 config.js 文件，配置海康设备的ip和账号密码
  ```javascript
// 海康摄像头账号
var account = 'admin'
// 海康摄像头密码
var password = 'admin'
// 海康摄像头ip
// 可配置多个ip，在浏览器上同时显示多个视频
var ipLists = [
  '192.168.1.201',
  '192.168.1.202',
  '192.168.1.203',
  // '192.168.1.204'
]
  
  ```
  
  ## 跑起来
  ```
  npm i
  npm run server
  ```
 