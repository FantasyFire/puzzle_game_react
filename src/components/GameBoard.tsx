import React, { useState, useImperativeHandle, forwardRef } from "react"
import GameBoardGrid from "./GameBoardGrid"
import type { IGridData } from "../controller/GridGame"
import ImageSplitter from '../utils/image-splitter'
import ArrayUtils from '../utils/array'
import { GridGame } from '../controller/GridGame'

interface IGameBoardProps {
  width: number,
  height: number,
  row: number,
  col: number
}

export interface IGameBoardExpose {
  reset(img: HTMLImageElement): void
}

export default forwardRef((props: IGameBoardProps, ref) => {
  const game = new GridGame<string>()
  const [gridData, setGridData] = useState<IGridData<string>[]>([])

  const gridWidth = props.width / props.col
  const gridHeight = props.height / props.row

  const grids = Array.from(ArrayUtils.range(props.row)).map(i => {
    return Array.from(ArrayUtils.range(props.col)).map(j => {
      return gridData[props.col * i + j] && 
        <GameBoardGrid
          key={props.col * i + j}
          width={gridWidth}
          height={gridHeight}
          url={gridData[props.col * i + j].data}
          onClick={() => move(j, i)}
          />
    })
  })

  function move (x: number, y: number) {
    const nextIndex = game.move(x + y * props.col)
    if (nextIndex > -1) {
      if (game.checkGameOver()) {
        gameOver()
      }
    }
  }

  function gameOver () {
    alert('成功复原！')
    console.log('点了确定')
  }

  useImperativeHandle<any, IGameBoardExpose>(ref, () => ({
    reset (img: HTMLImageElement) {
      console.log('GameBoard reset')
      // 根据row、col，切割img
      const imgData = ImageSplitter.split(img, props.row, props.col)
      // 去掉第一格图片
      imgData[0] = ''
      game.reset(props.row, props.col, imgData)
      setGridData(game.gridData)
    }
  }))

  console.log('GameBoard grids', grids, gridData.length, props.width, props.height)
  return (
    <>
      {gridData.length &&
        <div
          className="game-board"
          style={{width: `${props.width}px`, height: `${props.height}px`}}>
          {grids}
        </div>
      }
    </>
    )
})