const fs = require('fs');
const path = require('path')
const download = require('download');
const url = require('url')
const querystring = require('querystring')
const argv = process.argv.slice(2)
const dataSrc = argv[0]
const reverse = argv[1]
let runner = 0
let count = 0
let failArr = []
if (dataSrc) {
    let files = require(dataSrc)
    if(reverse){
        files = files.reverse()
    }
    // let i = 0
    const len = files.length
    function dl(i) {
        count = i
        runner++
        if(i >= len) {
            console.log('下载完成!')
            if(failArr.length > 0){
                fs.writeFile('./data/fail.json',JSON.stringify(failArr),function (err) {
                    if(err) throw err
                    console.log('失败文件已经保存到 ' + path.join(__dirname,'./data/fail.json'))
                })
            }
            return false
        }
        var v = files[i]
        // 解析路径
        var imgSrc = `https://api.mapbox.com/styles/v1/mumu12343/cjbye1ptx44f82slcfuvt8xk2/tiles/256/${v.i}/${v.x}/${v.y}?access_token=pk.eyJ1IjoibXVtdTEyMzQzIiwiYSI6ImNqYnllMHNyeDMzZmczM3Iwc3dtZmQzbzQifQ.ODES4bDIuqe-bjL8dx0XWg`
        // 保存路径
        let savePath = path.resolve(__dirname, '../img/')
        checkPath(savePath)
        checkPath(savePath + `/${v.i}`)
        checkPath(savePath + `/${v.i}` + `/${v.x}/`)
        var imgUrl = `../img/${v.i}/${v.x}/${v.y}.png`
        download(imgSrc).on('error', function(err) {
            console.log(err)
            failArr.push({i:v.i,x:v.x,y:v.y})
        }).pipe(fs.createWriteStream(imgUrl)).on('finish', () => {
            console.log('图片下载成功：%s', imgUrl);
            if(runner < 200){
                dl(++count);
            }
            runner--
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
    // 开始下载
    for (let i = 0; i < 200; i++) {
        dl(i)
    }
    // (function next(i, len, callback) {
    //     if (i < len) {
    //         dl(files[i], function (value) {
    //             arr[i] = value;
    //             next(i + 1, len, callback);
    //         });
    //     } else {
    //         callback();
    //     }
    // }(0, len, function (index) {
    //     console.log(`第${index}张完成`)
    // }));
}else{
    console.log('请传递目录参数!')
}
