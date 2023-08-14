"use client";

import clsx from "@/node_modules/clsx";
import { useState, useEffect } from "react";
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

  // 초기 세팅
  useEffect(() => {
    if (!load) {
      for (let i = 0; i < 9 && sudokuObj.length <= 9; i++) {
        setLoad(true);
        const childBoardData = Object.create(example[i]);
        setSudokuObj((prevItem) => [...prevItem, childBoardData]);
      }
    }
  }, []);

  function Sudoku() {
    return (
      <div className={clsx("grid", "grid-cols-3")}>
        {sudokuObj.map((item, index) => (
          <Box key={index} BoxObj={item} BoxKey={index} />
        ))}
      </div>
    );
  }

  function Box({ BoxObj }: { BoxObj: Box; BoxKey: number }) {
    const renderCell = (row: number, col: number) => {
      return (
        <input
          key={`${row}-${col}`}
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
            "font-semibold"
          )}
          value={BoxObj[row][col].value || ""}
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
