var express =  require("express");
var expressWebSocket = require("express-ws");
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("G:/app/ffmpeg-20200108-5bd0010-win64-static/ffmpeg-20200108-5bd0010-win64-static/bin/ffmpeg");
var webSocketStream = require("websocket-stream/stream");

const config = require('./config')

const host = config.host
const port = config.port

function localServer() {
    let app = express();
    app.use(express.static(__dirname));
    expressWebSocket(app, null, {
        perMessageDeflate: true
    });
    app.all('*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
      // res.header('Access-Control-Allow-Headers', 'Content-Type');
      // res.header('Access-Control-Allow-Methods', '*');
      // res.header('Content-Type', 'application/json;charset=utf-8');
      next();
    });
    app.get('/', (req, res) => {
      res.end('ok')
    })
    app.get('/live/get/:id', handleGetRequest)
    app.ws("/live/ws/:id/", handleWsRequest)
    app.listen(port, host);
    console.log("express listened")
    // handleRtmp(0)
}
// 处理get请求，返回flv直播流
function handleGetRequest (req, res) {
  console.log('get请求 -> ', req.params)
  const index = +(req.params && req.params.id) || 0
  var url = `rtsp://${config.account}:${config.password}@${config.ipLists[index]}/Streaming/Channels/101?transportmode=unicast`
  try {
    ffmpeg(url)
        .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")  // 这里可以添加一些 RTSP 优化的参数
        .on("start", function () {
            console.log(url, "Stream started.");
        })
        .on("codecData", function () {
            console.log(url, "Stream codecData.")
         // 摄像机在线处理
        })
        .on("error", function (err) {
            console.log(url, "An error occured: ", err);
        })
        .on("end", function () {
            console.log(url, "Stream end!");
         // 摄像机断线的处理
        })
        .outputFormat("flv").videoCodec("copy").noAudio().pipe(res);
  } catch (error) {
      console.log(error);
  }
}
// 处理ws请求，返回flv直播流
function handleWsRequest(ws, req) {
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });
    console.log("ws请求 -> ", req.params);
    const index = +(req.params && req.params.id) || 0
    const url = `rtsp://${config.account}:${config.password}@${config.ipLists[index]}/Streaming/Channels/101?transportmode=unicast`
    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")  // 这里可以添加一些 RTSP 优化的参数
            .on("start", function () {
                console.log(url, "Stream started.");
            })
            .on("codecData", function () {
                console.log(url, "Stream codecData.")
             // 摄像机在线处理
            })
            .on("error", function (err) {
                console.log(url, "An error occured: ", err.message);
            })
            .on("end", function () {
                console.log(url, "Stream end!");
             // 摄像机断线的处理
            })
            .outputFormat("flv").videoCodec("copy").noAudio().pipe(stream);
    } catch (error) {
        console.log(error);
    }
}
function handleRtmp (index) {
  console.log('handleRtmp ', index)
  var inputUrl = `rtsp://${config.account}:${config.password}@${config.ipLists[index]}/Streaming/Channels/102?transportmode=unicast`
  var outputUrl = `rtmp://${host}:1013/rtmp/${index}`
  // var outputUrl = `rtmp://192.168.30.53:1935/rtmp/0`
  console.log('inputUrl', inputUrl)
  console.log('outputUrl', outputUrl)
  try {
    ffmpeg(inputUrl)
      // .addInputOption("-rtsp_transport", "tcp")
      .outputOptions([
        "-vcodec",
        "copy",
        "-r",
        "25",
        "-an"
      ])
      .inputFPS(50)
      .noAudio()
      .aspect("4:3")
      .format("flv")
      .output(outputUrl)
      .on("start", function () {
        console.log('start ---> rtmp');
      })
      .on("codecData", function () {
        console.log('codecData ---> rtmp')
        // 摄像机在线处理
      })
      .on("error", function (err) {
        console.log('error ---> rtmp', err);
      })
      // .on("end", function () {
      //   console.log('end ---> rtmp');
      //   // 摄像机断线的处理
      // })
      // .run()
      console.log('okkkk')
  } catch (error) {
      console.log(error);
  }
}
localServer();
handleRtmp(0)
const cp = require('child_process')
// 自动打开默认浏览器
cp.exec(`start http://${host}:${port}/web/get.html`)
