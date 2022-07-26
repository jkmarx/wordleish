import React, { useEffect, useState } from "react";
import WordTable from "./WordTable";
import "./styles.css";

const App = () =>{
  let initGameSession = {
      boardState: ['', '', '', '', ''],
      evaluations: [null, null, null, null, null],
      rowIndex: 0,
      gameStatus: "IN_PROGRESS",
    };

  const stringWordSession = window.localStorage.getItem('wordleish');
  if (!stringWordSession) { // wordSession
    window.localStorage.setItem('wordleish', JSON.stringify(initGameSession));
  } else {
    initGameSession = JSON.parse(stringWordSession);
  }

  const [gameSession, setGameSession] = useState(initGameSession);
  const [solution, setSolution] = useState(solution);

  function updateSessionState(updatedSession) {
    window.localStorage.setItem('wordleish', JSON.stringify(updatedSession));
    console.log('updated session', updatedSession);
    setGameSession(updatedSession);
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/word")
      .then(res => res.json())
      .then(
        (result) => {
          setSolution(result.data);
        },
        (error) => {
          console.error(error);
        }
      )
  }, [])

  return (
    <div className="app-heading">
      <header>
        Wordleish
      </header>

      { gameSession && solution &&
        <WordTable
          game={gameSession}
          solution={solution}
          updateSessionState={ updateSessionState }
        /> }
    </div>
  )
}

export default App

