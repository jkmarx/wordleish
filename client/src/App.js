import React, { useEffect, useState } from "react";
import WordTable from "./WordTable";
import "./styles.css";

const App = () => {
  const [gameSession, setGameSession] = useState({});

  // Helper method to initially retrieve and sync browser window session with solution
  function syncWindowSession(todaysSolution) {
    let initGameSession = {
      boardState: ["", "", "", "", "", ""],
      evaluations: [null, null, null, null, null, null],
      rowIndex: 0,
      gameStatus: "IN_PROGRESS",
      solution: todaysSolution,
    };

    const stringWordSession = window.localStorage.getItem("wordleish");
    if (!stringWordSession) {
      window.localStorage.setItem("wordleish", JSON.stringify(initGameSession));
    } else {
      const parsedSession = JSON.parse(stringWordSession);
      if (parsedSession.solution === todaysSolution) {
        initGameSession = parsedSession;
      }
      window.localStorage.setItem("wordleish", JSON.stringify(initGameSession));
    }
    setGameSession(initGameSession);
  }

  // Helper method to update game state and update browser session.
  function updateSessionState(updatedSession) {
    const mergeSessions = { ...gameSession, ...updatedSession };
    window.localStorage.setItem("wordleish", JSON.stringify(mergeSessions));
    setGameSession(mergeSessions);
  }

  // View method to display end game message.
  function getGameResults() {
    if (gameSession.gameStatus === "WON") {
      return <div className="results">Congrats! You've won today.</div>;
    } else if (gameSession.gameStatus === "LOST") {
      return (
        <div className="results">{`Good try: The word is ${gameSession.solution}.`}</div>
      );
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/word")
      .then((res) => res.json())
      .then(
        (result) => {
          syncWindowSession(result.data);
        },
        (error) => {
          console.error(error);
        }
      );
  }, []);

  return (
    <div className="app-heading">
      <header>Wordleish</header>

      {gameSession && gameSession.solution && (
        <WordTable
          game={gameSession}
          solution={gameSession.solution}
          updateSessionState={updateSessionState}
        />
      )}

      {gameSession && gameSession.gameStatus && getGameResults()}
    </div>
  );
};

export default App;
