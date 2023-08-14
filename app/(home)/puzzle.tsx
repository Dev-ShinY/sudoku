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

  function Sudoku() {
    return (
      <div className={clsx("grid", "grid-cols-3")}>
        {sudokuObj.map((item, index) => (
          <Box key={index} BoxObj={item} BoxKey={index} />
        ))}
      </div>
    );
  }

  function Box({ BoxKey, BoxObj }: { BoxObj: Box; BoxKey: number }) {
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
              "!bg-blue-300"
          )}
          value={BoxObj[row][col].value || ""}
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
