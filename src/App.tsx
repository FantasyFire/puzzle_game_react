import React, { useState, useRef, Component } from "react"
import logo from './logo.svg';
import './App.css';
import GameBoard from './components/GameBoard';
import type { IGameBoardExpose } from './components/GameBoard'

let gameBoardRefs: null | React.MutableRefObject<IGameBoardExpose | null>
export default function App() {
  gameBoardRefs = useRef<IGameBoardExpose | null>(null)

  function init() {
    const defaultImg = document.createElement('img')
    // defaultImg.src = 'default_puzzle.png'
    defaultImg.src = 'logo192.png'
    defaultImg.onload = () => {
      console.log('setGameReady')
      if (gameBoardRefs && gameBoardRefs.current && gameBoardRefs.current.reset) {
        gameBoardRefs.current.reset(defaultImg)
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={init}>点击加载图片</button>
        <GameBoard
          ref={gameBoardRefs}
          width={288}
          height={288}
          row={2}
          col={2} />
      </header>
    </div>
  )
}
