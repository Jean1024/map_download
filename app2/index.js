const fs = require('fs');
const path = require('path')
const download = require('download');
const argv = process.argv.slice(2)
const dataSrc = argv[0]
const async = require("async")

if (dataSrc) {
    let files = require(dataSrc)
    function dl(v,callback) {
        // 解析路径
        var imgSrc = `http://blue-pi.node.tianqi.cn/tile_img/temp/${v.i}/${v.x}/${v.y}`
        // 保存路径
        let savePath = path.resolve(__dirname, '../img/')
        checkPath(savePath)
        checkPath(savePath + `/${v.i}`)
        checkPath(savePath + `/${v.i}` + `/${v.x}/`)
        var imgUrl = `../img/${v.i}/${v.x}/${v.y}.png`
        console.log('图片正在下载：%s', imgUrl);
        download(imgSrc).on('error', function(err) {
            console.log(err)
        }).pipe(fs.createWriteStream(imgUrl)).on('finish', () => {
            console.log('图片下载成功：%s', imgUrl);
            callback(null,imgUrl)
        });
    }
    // 检查文件夹是否存在
    function fsExistsSync(path) {
        try {
            fs.accessSync(path, fs.F_OK);
        } catch (e) {
            return false;
        }
        return true;
    }
    function checkPath(path) {
        let flag = fsExistsSync(path)
        flag || (fs.mkdirSync(path))
    }
    async.mapLimit(files, 5, function (url, callback) {
        dl(url,callback);
      }, function (err, result) {
        console.log('final:');
        console.log(result.length + '/' + files.length +'张已经下载成功！');
      });
}else{
    console.log('请传递目录参数!')
}
