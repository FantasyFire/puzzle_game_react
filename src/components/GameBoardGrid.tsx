import React from "react"

interface IGameBoardGridProps {
  width: number,
  height: number,
  url?: string,
  onClick?(): void
}

const GameBoardGrid: React.FC<IGameBoardGridProps> = (props: IGameBoardGridProps) => {
  return <div
          style={{display: "inline-block", width: `${props.width}px`, height: `${props.height}px`}}>
          {props.url &&
            <img
              src={props.url}
              width={props.width}
              height={props.height}
              alt="puzzle"/>
          }
        </div>
}

export default GameBoardGrid