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
  winOrigin,
  status,
}) {
  return (
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

                // WIN ANIMATION: Ripple logic
                const isWinRipple = status === 'Solved' && winOrigin;
                const distance = isWinRipple ? Math.sqrt(
                  Math.pow(rowIndex - winOrigin[0], 2) +
                  Math.pow(cellIndex - winOrigin[1], 2)
                ) : 0;

                return (
                  <td
                    key={cellIndex}
                    style={isWinRipple ? {
                      animationDelay: `${distance * 80}ms`
                    } : {}}
                    className={classNames("cell", {
                      "area-highlight": selected && isInSelectedArea && !isSelected,
                      "selected-cell": isSelected,
                      "same-value": isSameValue,
                      "blue-highlight": selectedNumber !== null && value === selectedNumber,
                      "conflict": isConflict,
                      "incorrect": isIncorrect && isSelected,
                      "green": cellIn < greenCount,
                      "win-ripple": isWinRipple,
                    })}
                  >
                    <input
                      type="text"
                      maxLength={1}
                      inputMode="none"
                      pattern="[1-9]*"
                      value={cell === null ? "" : cell}
                      readOnly={isPrefilled}
                      onFocus={() => {
                        setSelected([rowIndex, cellIndex]);
                      }}
                      onClick={() => {
                        handleCellClick(rowIndex, cellIndex);
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^[1-9]$/.test(val)) {
                          handleInput(rowIndex, cellIndex, val);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow backspace, delete, tab, escape, enter
                        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                          (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                          (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
                          (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                          // Allow: home, end, left, right
                          (e.keyCode >= 35 && e.keyCode <= 39)) {
                          return;
                        }
                        // Ensure that it is a number and stop the keypress if not
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                          e.preventDefault();
                        }
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
  );
}

export default Grid;
