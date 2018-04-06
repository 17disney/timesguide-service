function getRandomList(num, max) {
  let list = []
  let i = 0
  while (i < num) {
    let num = getRandomNum(0, max)
    if (!list.includes(num)) {
      list.push(num)
      i++
    }
  }
  return list
}

function getRandomNum(min, max) {
  return min + Math.round(Math.random() * (max - min))
}

module.exports = {
  getRandomList
}
