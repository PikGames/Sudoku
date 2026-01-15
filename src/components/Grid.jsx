import React from "react";
import classNames from "classnames";

function Grid({
  board,
  puzzle,
  selected,
  setSelected,
  handleInput,
  greenCount,
  selectedNumber,
  solution,
  handleCellClick,
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
                  const value = cell;

                  // Highlights the selected row, column and 3x3 box for better focus.
                  const isSelected = selected && rowIndex === selected[0] && cellIndex === selected[1];
                  const sameRow = selected && rowIndex === selected[0];
                  const sameCol = selected && cellIndex === selected[1];
                  const sameBox = selected &&
                    Math.floor(rowIndex / 3) === Math.floor(selected[0] / 3) &&
                    Math.floor(cellIndex / 3) === Math.floor(selected[1] / 3);

                  const isInSelectedArea = sameRow || sameCol || sameBox;

                  // Flags duplicate numbers in the same context and identifies logic errors.
                  const selectedValue = selected ? board[selected[0]][selected[1]] : null;
                  const isConflict = selected &&
                    selectedValue !== null &&
                    value === selectedValue &&
                    !isSelected &&
                    isInSelectedArea;

                  const isIncorrect = value !== null && value !== solution[rowIndex][cellIndex];
                  // Automatically highlights all instances of the number currently in focus.
                  const isSameValue = selected &&
                    selectedValue !== null &&
                    value === selectedValue &&
                    !isSelected;
                  return (
                    <td
                      key={cellIndex}
                      className={classNames("cell", {
                        "area-highlight": selected && isInSelectedArea && !isSelected,
                        "selected-cell": isSelected,
                        "same-value": isSameValue,
                        "blue-highlight": selectedNumber !== null && value === selectedNumber,
                        "conflict": isConflict,
                        "incorrect": isIncorrect && isSelected,
                        "green": cellIn < greenCount,
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
                          handleCellClick(rowIndex, cellIndex);
                        }}
                        onChange={(e) => {
                          handleInput(rowIndex, cellIndex, e.target.value);
                        }}
                        className={classNames({
                          "text-incorrect": isIncorrect && !isPrefilled,
                          "prefilled-conflict": isConflict && isPrefilled
                        })}
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
