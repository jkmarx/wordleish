import React, { useEffect, useState } from "react";

export default function WordRow(props) {
  const { word, evaluation, rowCount, setSelectRow, disabled } = props;
  const minMaxLen = 1;
  let initChars = { 0: "", 1: "", 2: "", 3: "", 4: "" };
  if (word) {
    for (let i = 0; i < word.length; i += 1) {
      initChars[i] = word[i];
    }
  }
  const [inChars, setInChars] = useState(initChars);

  // View method to handle updating row values
  function handleChange(event, key) {
    const letterGuess = event.target.value;
    const updatedRow = {
      ...inChars,
      [key]: letterGuess ? letterGuess.toLowerCase() : "",
    };
    setInChars(updatedRow);
    const wordGuess = Object.values(updatedRow).join("");
    setSelectRow(wordGuess);

    // Update DOM input focus
    let nextInputBox = null;
    if (key < 4 && letterGuess) {
      // Go to next input box
      nextInputBox = document.querySelector(
        `input[name=box-input-${key + 1}-${rowCount}]`
      );
    } else if (
      // Go back an input box with delete and backspaces
      wordGuess.length > 0 &&
      (event.keyCode === 8 || event.keyCode === 46)
    ) {
      nextInputBox = document.querySelector(
        `input[name=box-input-${wordGuess.length - 1}-${rowCount}]`
      );
    } else {
      // Stay put by default. Ex: Backspace on first box.
      nextInputBox = document.querySelector(
        `input[name=box-input-${wordGuess.length}-${rowCount}]`
      );
    }
    if (nextInputBox !== null) {
      nextInputBox.focus();
    }

    event.preventDefault();
  }

  // View method to generate row input boxes
  function getCharBoxes() {
    const boxList = [];
    for (let i = 0; i < 5; i += 1) {
      const evaluationClass = evaluation ? evaluation[i] : "";
      boxList.push(
        <input
          type="text"
          name={`box-input-${i}-${rowCount}`}
          className={`${evaluationClass} box-input`}
          key={`${inChars[i]}-${i}`}
          value={inChars[i]}
          onChange={() => handleChange(event, i)}
          maxLength={minMaxLen}
          minLength={minMaxLen}
          disabled={disabled}
        />
      );
    }
    return boxList;
  }

  // Helper view method to handle delete and backspace keys
  function handleKeyUp(event) {
    if (event.keyCode === 8 || event.keyCode === 46) {
      handleChange(event);
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [inChars]);

  return <div className="game-row">{getCharBoxes()}</div>;
}
