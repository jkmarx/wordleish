import React, { useEffect, useState } from 'react';
import WordTable from './WordTable';
import './styles.css';

const App = () =>{
  const [gameSession, setGameSession] = useState({});

  function updateWindowSession (todaysSolution) {
    let initGameSession = {
      boardState: ['', '', '', '', '', ''],
      evaluations: [null, null, null, null, null, null],
      rowIndex: 0,
      gameStatus: 'IN_PROGRESS',
      solution: todaysSolution
    };

    const stringWordSession = window.localStorage.getItem('wordleish');
    if (!stringWordSession) {
      window.localStorage.setItem('wordleish', JSON.stringify(initGameSession));
    } else {
      const parsedSession = JSON.parse(stringWordSession);
      if (parsedSession.solution === todaysSolution) {
        initGameSession = parsedSession;
      }
      window.localStorage.setItem('wordleish', JSON.stringify(initGameSession));
    }
    setGameSession(initGameSession);
  }

  function updateSessionState(updatedSession) {
    const mergeSessions = { ...gameSession, ...updatedSession };
    window.localStorage.setItem('wordleish', JSON.stringify(mergeSessions));
    setGameSession(mergeSessions);
  }

  function getGameResults() {
    if (gameSession.gameStatus === "WON") {
      return (
        <div>
          <h2>
            Congrats! You've won today.
          </h2>
        </div>
      )
    } else if (gameSession.gameStatus === "LOST") {
      return (
        <div>
          <h2>
            Good effort! Try again tomorrow.
          </h2>
        </div>
      )
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/word")
      .then(res => res.json())
      .then(
        (result) => {
          updateWindowSession(result.data);
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

      { gameSession && gameSession.solution &&
        <WordTable
          game={gameSession}
          solution={gameSession.solution}
          updateSessionState={ updateSessionState }
        /> }

      { gameSession && gameSession.gameStatus && getGameResults()}
    </div>
  )
}

export default App

