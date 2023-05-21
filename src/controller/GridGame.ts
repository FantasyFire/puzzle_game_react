import ArrayUtils from '../utils/array'

export interface IGridData<T> {
  index: number,
  data?: T
}
export class GridGame<T> {
  row: number
  col: number
  gridData: IGridData<T>[]
  // 记录已操作步数
  steps: number

  constructor () {
    this.row = 0
    this.col = 0
    this.gridData = []
    this.steps = 0
  }

  /**
   * 重置游戏，重新生成格子数据，将第一块拼图拿走，并打乱顺序
   * @param row 行数
   * @param col 列数
   * @param exData 绑定每个格子的额外数据一维数组，要求数组长度等于row * col
   */
  reset (row: number, col: number, exData?: T[]) {
    const len = row * col
    if (exData && len !== exData.length) throw new Error('exData的长度不等于row*col')
    // 初始化gridData
    this.gridData = Array.from(ArrayUtils.range(len)).map(index => ({index, data: exData && exData[index]}))
    this.row = row
    this.col = col
    // 将第一个格子置空
    this.gridData[0].index = -1
    // 打乱顺序
    this.shuffle(this.gridData.length * 2)
    this.steps = 0
  }

  /**
   * 将targetIndex的格子移动到空格
   * @param targetIndex 目标格子的一维数组下标
   * @return 返回传入的targetIndex时表示操作成功，返回-1时表示操作失败
   */
  move (targetIndex: number) : number {
    const y: number = Math.floor(targetIndex / this.col)
    const x: number = targetIndex % this.col
    // 判断格子是否在范围内
    if (!this.isPosValid(x, y)) {
      return -1
    }
    // 判断空格是否在附近，或者targetIndex就是空格子
    const blankIndex = this.gridData.findIndex(data => data.index === -1)
    if (blankIndex === targetIndex || !this.getNeighbours(x, y).includes(blankIndex)) {
      return -1
    }
    // 交换目标格子和空格
    const tempData = this.gridData[blankIndex].data
    this.gridData[blankIndex].index = this.gridData[targetIndex].index
    this.gridData[blankIndex].data = this.gridData[targetIndex].data
    this.gridData[targetIndex].index = -1
    this.gridData[targetIndex].data = tempData
    this.steps += 1
    return targetIndex
  }

  /**
   * 检测是否游戏结束（恢复正确顺序）
   * @return 是否游戏结束
   */
  checkGameOver () : boolean {
    return this.gridData.every((data, index) => data.index === -1 || data.index === index)
  }

  /**
   * 打乱格子顺序
   * @param {number} [steps=10] 打乱的步数 
   */
  private shuffle (steps = 10) {
    let prevIndex = 0
    let curIndex = 0
    while (steps--) {
      const nextIndexes: number[] = this.getNeighbours(curIndex)
        .filter(i => i !== prevIndex) // 移动回上一个位置是没意义的，所以过滤掉
      prevIndex = curIndex
      curIndex = nextIndexes[Math.floor(Math.random() * nextIndexes.length)]
      this.move(curIndex)
    }
  }

  /**
   * 判断位置是否合法
   * @param x x轴坐标
   * @param y y轴坐标
   * @return 坐标是否合法
   */
  isPosValid (x: number, y: number) : boolean {
    return Math.min(x, y) >= 0 && x < this.col && y < this.row
  }

  // 四个方向
  private readonly DIRECTIONS = [
    {x: -1, y:  0},
    {x:  0, y: -1},
    {x:  1, y:  0},
    {x:  0, y:  1}
  ]
  /**
   * 获取附近格子的index列表
   * @param x x轴坐标
   * @param y y轴坐标
   * @return 一维数组坐标数组
   */
  private getNeighbours (x: number, y?: number) : number[] {
    if (y === undefined) {
      y = Math.floor(x / this.col)
      x = x % this.col
    }
    return this.DIRECTIONS
      .map(dir => ({x: x + dir.x, y: (y || 0) + dir.y})) // 得到当前(x,y)周围4个位置
      .filter(pos => this.isPosValid(pos.x, pos.y)) // 过滤掉不合法的位置
      .map(pos => pos.x + pos.y * this.col) // 映射为一维数组的index返回
  }
}
