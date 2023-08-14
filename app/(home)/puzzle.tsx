"use client";

import clsx from "@/node_modules/clsx";
import { useState, useEffect, useRef } from "react";
import example from "@/public/example.json";
import React from "react";

type Cell = {
  value: number | null;
  writable: boolean;
  error: boolean;
};
type Box = Cell[][];
type Sudoku = Box[];

export const Puzzle = () => {
  const [load, setLoad] = useState(false);
  const [sudokuObj, setSudokuObj] = useState<Sudoku>([]);
  const [focusCoord, setFocusCoord] = useState<
    [number | null, number | null, number | null]
  >([null, null, null]);

  const inputRefs = useRef<{
    [key: string]: React.RefObject<HTMLInputElement>;
  }>({});

  const handleFocus = (refKey: string) => {
    inputRefs.current[refKey]?.current?.focus();
  };

  // 초기 세팅
  useEffect(() => {
    if (!load) {
      for (let i = 0; i < 9 && sudokuObj.length <= 9; i++) {
        setLoad(true);
        const childBoardData = Object.create(example[i]);
        setSudokuObj((prevItem) => [...prevItem, childBoardData]);
      }

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            const refKey = `${i}_${j}_${k}`;
            inputRefs.current[refKey] = React.createRef();
          }
        }
      }
    }
  }, []);

  const checkDuplicatesInBox = () => {
    const updatedSudokuObj: Sudoku = [];

    sudokuObj.map((box) => {
      const valueSet = new Set();
      const updateBox = box;

      for (const row of updateBox) {
        for (const cell of row) {
          if (cell.value !== null && valueSet.has(cell.value)) {
            // 중복 값인 경우 error 치환
            for (const box of updateBox) {
              for (const row of box) {
                if (row.value === cell.value) {
                  row.error = true;
                }
              }
            }
          } else {
            // 그렇지 않은 경우 valueSet값에 대입
            cell.error = false;
            valueSet.add(cell.value);
          }
        }
      }
      updatedSudokuObj.push(updateBox);
    });
    return updatedSudokuObj;
  };

  const checkDuplicatesInRow = (BoxKey: number, RowKey: number) => {
    const updatedSudokuObj: Sudoku = [];

    // row check
    for (let i = 0; i < sudokuObj.length; i += 3) {
      const valueSet = new Set();
      const group = sudokuObj.slice(i, i + 3);

      // Sudock안에서 동일 선상의 box인지 check
      if (i / 3 === Math.floor(BoxKey / 3)) {
        // boxRow[RowKey] == box 안에서 동일 선상의 row
        group.map((boxRow) => {
          for (const cell of boxRow[RowKey]) {
            if (cell.value !== null && valueSet.has(cell.value)) {
              // 중복 값인 경우 error 치환
              for (const box of group) {
                for (const row of box[RowKey]) {
                  if (row.value === cell.value) {
                    row.error = true;
                  }
                }
              }
            } else {
              // 그렇지 않은 경우 valueSet값에 대입
              cell.error = false;
              valueSet.add(cell.value);
            }
          }
        });
      }
      updatedSudokuObj.push(...group);
    }
    return updatedSudokuObj;
  };

  const checkDuplicatesInCol = (BoxKey: number, ColKey: number) => {
    let updatedSudokuObj: Sudoku = [];

    // col check
    for (let i = 0; i < sudokuObj.length / 3; i += 1) {
      const valueSet = new Set();
      const group = [sudokuObj[i], sudokuObj[i + 3], sudokuObj[i + 6]];

      // // Sudock안에서 동일 선상의 box인지 check
      if (i === Math.floor(BoxKey % 3)) {
        group.map((boxCol) => {
          // boxCol > cell[ColKey] == box 안에서 동일 선상의 col
          boxCol.map((cell) => {
            if (cell[ColKey].value) {
              if (
                cell[ColKey].value !== null &&
                valueSet.has(cell[ColKey].value)
              ) {
                // 중복 값인 경우 error 치환
                for (const box of group) {
                  box.map((col) => {
                    if (col[ColKey].value) {
                      if (col[ColKey].value === cell[ColKey].value) {
                        col[ColKey].error = true;
                      }
                    }
                  });
                }
              } else {
                // 그렇지 않은 경우 valueSet값에 대입
                cell[ColKey].error = false;
                valueSet.add(cell[ColKey].value);
              }
            }
          });
        });
      }
      updatedSudokuObj.push(...group);
    }

    updatedSudokuObj = [
      updatedSudokuObj[0], // sudoku box position
      updatedSudokuObj[3], // [0] [3] [6]
      updatedSudokuObj[6], // [1] [4] [7]
      updatedSudokuObj[1], // [2] [5] [8]
      updatedSudokuObj[4],
      updatedSudokuObj[7],
      updatedSudokuObj[2],
      updatedSudokuObj[5],
      updatedSudokuObj[8],
    ];

    return updatedSudokuObj;
  };

  const handleCheckAndSetErrors = (
    BoxKey: number,
    row: number,
    col: number
  ) => {
    // box error check
    let updatedSudokuObj = checkDuplicatesInBox();
    setSudokuObj(updatedSudokuObj);

    // row error check
    updatedSudokuObj = checkDuplicatesInRow(BoxKey, row);
    setSudokuObj(updatedSudokuObj);

    // col error check
    updatedSudokuObj = checkDuplicatesInCol(BoxKey, col);

    setSudokuObj(updatedSudokuObj);
  };

  function Sudoku() {
    return (
      <div className={clsx("grid", "grid-cols-3")}>
        {sudokuObj.map((item, index) => (
          <Box key={index} BoxObj={item} BoxKey={index} />
        ))}
      </div>
    );
  }

  function Box({ BoxObj, BoxKey }: { BoxObj: Box; BoxKey: number }) {
    const renderCell = (row: number, col: number) => {
      return (
        <input
          key={`${row}-${col}`}
          ref={inputRefs.current[`${BoxObj}_${row}_${col}`]}
          className={clsx(
            "border",
            "border-[0.5px]",
            "border-slate-300",
            "p-1",
            "w-[50px]",
            "h-[50px]",
            "flex",
            "cursor-pointer",
            "text-center",
            "font-semibold",

            BoxObj[row][col].writable && "text-blue-600",
            // focus effect
            (focusCoord[0] === BoxKey ||
              (focusCoord[1] === row &&
                Math.floor(BoxKey / 3) ===
                  Math.floor((focusCoord[0] || 0) / 3)) ||
              (focusCoord[2] === col &&
                BoxKey % 3 === (focusCoord[0] || 0) % 3)) &&
              "bg-blue-100",
            focusCoord[0] === BoxKey &&
              focusCoord[1] === row &&
              focusCoord[2] === col &&
              "!bg-blue-300",

            // error effect
            BoxObj[row][col].error && "!border-[#ff5f5f]"
          )}
          value={BoxObj[row][col].value || ""}
          disabled={!BoxObj[row][col].writable}
          onKeyDown={(e) => {
            if (
              [
                "Delete",
                "Backspace",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ].includes(e.key)
            ) {
              const updateItems = [...sudokuObj];
              updateItems[BoxKey][row][col].value = [
                "Delete",
                "Backspace",
              ].includes(e.key)
                ? null
                : Number(e.key);
              setSudokuObj(updateItems);
              handleCheckAndSetErrors(BoxKey, row, col);
            }
          }}
          onClick={() => {
            setFocusCoord([BoxKey, row, col]);
            handleFocus(`${BoxKey}_${row}_${col}`);
          }}
          readOnly
        />
      );
    };

    return (
      <div
        className={clsx(
          "grid",
          "grid-cols-3",
          "border",
          "border-[1px]",
          "border-stone-600"
        )}
      >
        {BoxObj.map((row: Cell[], rowIndex: number) => (
          <div key={rowIndex}>
            {row.map((_, colIndex) => renderCell(colIndex, rowIndex))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Sudoku />
    </div>
  );
};
