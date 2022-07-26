import React, { useEffect, useState } from "react";
import WordRow from "./WordRow";

export default function WordTable(props) {
  const { game, solution, updateSessionState } = props;
  const [selectRow, setSelectRow] = useState("");
  const [rows, setRows] = useState(game.boardState);

  function handleSubmit(event) {
    if (selectRow.length < 5) {
      return;
    }
    const tempArr = [
      ...rows.slice(0, game.rowIndex),
      selectRow,
      ...rows.slice(game.rowIndex + 1, rows.length),
    ];
    setRows(tempArr);
    const solutionMap = {};
    for (let j = 0; j < solution.length; j += 1) {
      if (solutionMap.hasOwnProperty(solution[j])) {
        solutionMap[solution[j]] += 1;
      } else {
        solutionMap[solution[j]] = 1;
      }
    }
    const evaluation = []; // ["absent", "present", "absent", "absent", "correct"]
    let correctCount = 0;
    for (let i = 0; i < solution.length; i += 1) {
      if (selectRow[i] === solution[i]) {
        evaluation[i] = "correct";
        correctCount += 1;
      } else if (solutionMap.hasOwnProperty(selectRow[i])) {
        if (solutionMap[selectRow[i]]) {
          solutionMap[selectRow[i]] -= 1;
          evaluation[i] = "present";
        }
      } else {
        evaluation[i] = "absent";
      }
    }
    const updatedEvaluations = game.evaluations;
    updatedEvaluations[game.rowIndex] = evaluation;
    const updatedBoardState = game.boardState;
    updatedBoardState[game.rowIndex] = selectRow;

    const updatedSession = {
      rowIndex: game.rowIndex + 1,
      evaluations: updatedEvaluations,
      boardState: updatedBoardState,
    };
    if (game.rowIndex === 5 || correctCount === 5) {
      updatedSession.gameStatus = correctCount === 5 ? "WON" : "LOST";
    }
    updateSessionState(updatedSession);

    // Start on the next row
    if (game.rowIndex < 5) {
      const nextInputBox = document.querySelector(
        `input[name=box-input-0-${game.rowIndex + 1}]`
      );
      if (nextInputBox !== null) {
        nextInputBox.focus();
      }
    }

    event.preventDefault();
  }

  function generateGrid() {
    const rowDom = [];
    for (let i = 0; i < rows.length; i += 1) {
      rowDom.push(
        <WordRow
          word={rows[i]}
          evaluation={game.evaluations[i]}
          key={`${i}-${rows[i]}`}
          rowIndex={i}
          setSelectRow={setSelectRow}
          disabled={i !== game.rowIndex || game.gameStatus !== "IN_PROGRESS"}
        />
      );
    }
    return rowDom;
  }

  function handleKeyUp(event) {
    if (event.keyCode === 13) {
      handleSubmit(event);
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectRow]);

  return <form onSubmit={handleSubmit}>{rows.length && generateGrid()}</form>;
}
