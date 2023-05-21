/**
 * 分割传入的img元素成row行col列，返回url数组
 * @param img 
 * @param row 
 * @param col 
 * @returns 
 */
function split (img: HTMLImageElement, row: number = 1, col: number = 1) : string[] {
  const splitCanvas: HTMLCanvasElement = document.createElement('canvas')
  const splitCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D> splitCanvas.getContext('2d')
  const splitWidth: number = img.width / col
  const splitHeight: number = img.height / row
  splitCanvas.width = splitWidth
  splitCanvas.height = splitHeight
  const urls: string[] = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      splitCtx.drawImage(img, -j * splitWidth, -i * splitHeight)
      urls.push(splitCanvas.toDataURL('image/png', 1))
    }
  }
  return urls
}

export default {
  split
}