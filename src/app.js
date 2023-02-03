/* 批量爬取数据 */
const fs = require('fs'),
  method = require('./method');

let ids = [2345,2346,2347,2348,2349,2350]
let listData = [];

// 初始化方法
const start = async () => {
  for (let i = 0; i < ids.length; i++) {
    let data = await method.getList(ids[i]);
    listData = listData.concat(data);
  }
  let newListData = listData.map(async (item) => {
    let detailData = await method.getDetail(item.id);
    let videoUrl = detailData.match(/https?:\/\/1297919.s80i.faiusr.com\/.+\.mp4/g);
    item.video = videoUrl && videoUrl[0] || "";
    item.content = detailData;
    return item;
  })
  Promise.all(newListData).then((arr) => {
    //将数组转换成字符串
    const result = JSON.stringify(arr);
    fs.writeFile("list.json", result, "utf-8", (error) => {
      //监听错误，如正常输出，则打印null
      if (error == null) {
        console.log("数据爬取成功!请打开json文件，先Ctrl+A，再Ctrl+K,最后Ctrl+F格式化后查看json文件(仅限Visual Studio Code编辑器)");
      }
    });
  })
}

module.exports = {
  start
}