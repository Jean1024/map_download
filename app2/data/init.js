const argv = process.argv.slice(2)
const levelStart = argv[0];
const level = argv[1];
const arr = []
const fs = require('fs')
const OUT_SRC = argv[2]
for (let i = levelStart; i <= level; i++) {
  xRange = Math.pow(2,i) - 1
  yRange = Math.pow(2,i) - 1
  for (let x = 0; x <= xRange ; x++) {
    for (let y = 0; y <= yRange; y++) {
      arr.push({
        i,
        x,
        y
      })
    }
  }
}
fs.writeFileSync(OUT_SRC,JSON.stringify(arr))
