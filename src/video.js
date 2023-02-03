/* 批量下载视频数据 */
const fs = require('fs'),
  config = require('./config'),
  method = require('./method');

// 初始化方法
const start = async () => {
  method.mkdirSaveFolder(config.savePath);
  // 读取json数据
  fs.readFile('./list.json', 'utf8', async(error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    let videoList = JSON.parse(data);
    // 开始下载
    console.log('开始下载')
    for (let i = 0; i < videoList.length; i++) {
      await downloadVideo(videoList[i]);
    }
    console.log('下载结束')
    process.exit(0)
  })
}

// 下载视频
const downloadVideo = async video => {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${config.savePath}/${video.id}-${video.title}.mp4`)) {
    let fileData = await method.getVideoData(video.video, 'binary');
    console.log('下载视频中：', video.title)
    let res = await method.savefileToPath(config.savePath, video.id + video.title, fileData);
    console.log(`${res}: ${video.title}`)
  } else {
    console.log(`视频文件已存在：${video.title}`)
  }
}

start();