import React from "react";
import classNames from "classnames";

function Grid({
  board,
  puzzle,
  selected,
  setSelected,
  handleInput,
  greenCount,
}) {
  return (
    <div className="container">
      <table className="table">
        <tbody>
          {board.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isPrefilled = puzzle[rowIndex][cellIndex] !== null;
                  const cellIn = rowIndex * 9 + cellIndex;
                  return (
                    <td
                      key={cellIndex}
                      className={classNames("cell", {
                        "same-row": selected && rowIndex === selected[0],
                        "same-col": selected && cellIndex === selected[1],
                        "same-box":
                          selected &&
                          Math.floor(rowIndex / 3) ===
                            Math.floor(selected[0] / 3) &&
                          Math.floor(cellIndex / 3) ===
                            Math.floor(selected[1] / 3),
                        green: cellIn < greenCount,
                      })}
                    >
                      <input
                        type="text"
                        maxLength={1}
                        value={cell === null ? "" : cell}
                        readOnly={isPrefilled}
                        onFocus={() => {
                          setSelected([rowIndex, cellIndex]);
                        }}
                        onClick={() => {
                          setSelected([rowIndex, cellIndex]);
                        }}
                        onChange={(e) => {
                          handleInput(rowIndex, cellIndex, e.target.value);
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;
