const config = require('./config'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  axios = require('axios');

module.exports = {
  // 新建保存视频的文件夹
  mkdirSaveFolder (savePath) {
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath)
      console.log(`文件夹已生成：${savePath}`)
    } else {
      console.log(`文件夹已存在：${savePath}`)
    }
    // 生成保存截图的文件夹
    if (!fs.existsSync('./screenshot')) {
      fs.mkdirSync('./screenshot')
    }
  },

  // 获取列表数据
  async getList (id) {
    const headers = {
      Referer: "https://servicewechat.com/wxab50dabfba309a1c/7/page-frame.html",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuSWQiOiJvd3Z4YTVCX0tOcURrZmNwMGwya0VLNzNvSmhFIiwid3hhcHBBaWQiOjEyOTc5MTksImZyb20iOjAsImV4cCI6MTY3NTQ0MTQ1Mywid3hhcHBJZCI6MTAzLCJpYXQiOjE2NzU0MDU0NTN9.mxfTYwMKQdrYrejQBZW11RCEYh7eoltnAuDW5SZh7Xc"
    }
    const result = await axios({
      method: 'POST',
      url: `${config.originPath}/wxAppConnectionV3.jsp?aid=22808825&wxappId=103&wxappAid=1297919&isOem=false&from=0&isModel=undefined&wxappAppId=wxab50dabfba309a1c&cmd=initLabelModuleAgain&style=9&moduleId=${id}&isOptimization=true&city=&openId=owvxa5B_KNqDkfcp0l2kEK73oJhE`,
      headers
    })
    const data = result.data.moduleInfo.content.selectedList
    const list = []
    // 数据字段过滤
    data.forEach(item => {
      if (item.id) {
        list.push({
          id: item.id,
          title: item.title,
          summary: item.summary,
          pic: item.picList.length > 0 ? item.picList[0] : "",
        })
      }
    })
    return list
  },

  // 获取详情数据
  async getDetail (id) {
    const headers = {
      Referer: "https://servicewechat.com/wxab50dabfba309a1c/7/page-frame.html",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuSWQiOiJvd3Z4YTVCX0tOcURrZmNwMGwya0VLNzNvSmhFIiwid3hhcHBBaWQiOjEyOTc5MTksImZyb20iOjAsImV4cCI6MTY3NTQ0MTQ1Mywid3hhcHBJZCI6MTAzLCJpYXQiOjE2NzU0MDU0NTN9.mxfTYwMKQdrYrejQBZW11RCEYh7eoltnAuDW5SZh7Xc"
    }
    const result = await axios({
      method: 'POST',
      url: `${config.originPath}/wxappConnectionNews.jsp?aid=22808825&wxappId=103&wxappAid=1297919&isOem=false&from=0&isModel=undefined&wxappAppId=wxab50dabfba309a1c&id=${id}&cmd=getNewsInfoUCk&columnItemId=undefined&openId=owvxa5B_KNqDkfcp0l2kEK73oJhE`,
      headers
    })
    let content = result.data.result.content;
    return content;
  },

  // 获取视频数据
  getVideoData (url, encoding) {
    return new Promise((resolve, reject) => {
      let req = null;
      if (url.indexOf('https') == -1) {
        req = http.get(url, function (res) {
          let result = ''
          encoding && res.setEncoding(encoding)
          res.on('data', function (d) {
            result += d
          })
          res.on('end', function () {
            resolve(result)
          })
          res.on('error', function (e) {
            reject(e)
          })
        })
      } else {
        req = https.get(url, function (res) {
          let result = ''
          encoding && res.setEncoding(encoding)
          res.on('data', function (d) {
            result += d
          })
          res.on('end', function () {
            resolve(result)
          })
          res.on('error', function (e) {
            reject(e)
          })
        })
      }
      req.end();
    })
  },

  // 下载视频到本地
  savefileToPath (fileFolder, fileName, fileData) {
    let fileFullName = `${fileFolder}/${fileName}.mp4`
    return new Promise((resolve, reject) => {
      fs.writeFile(fileFullName, fileData, 'binary', function (err) {
        if (err) {
          console.log('savefileToPath error:', err)
        }
        resolve('已下载')
      })
    })
  }

}