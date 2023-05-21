/**
 * 模仿实现python的range方法
 * @param start 
 * @param stop 
 * @param step 
 * @returns 
 */
function range (start: number, stop?: number, step: number = 1) : Generator<number> {
  if (stop === undefined) {
    stop = start
    start = 0
  }
  return (function *() {
    let cur: number = start
    while (cur !== stop) {
      yield cur
      cur += step
    }
  })()
}

export default {
  range
}