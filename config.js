// node域名
var host = 'localhost'
// node端口
var port = 1011
// 海康摄像头账号
var account = 'admin'
// 海康摄像头密码
var password = 'admin'
// 海康摄像头ip
var ipLists = [
  '192.168.1.201',
  '192.168.1.202',
  '192.168.1.203',
  // '192.168.1.204'
]
// node环境下才需要导出
if (typeof window === 'undefined') {
  module.exports = {
    host,
    port,
    account,
    password,
    ipLists
  }
}
