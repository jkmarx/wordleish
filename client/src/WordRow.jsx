import React, { useEffect, useState } from "react";

export default function WordRow(props) {
  const { word, evaluation, rowIndex, setSelectRow, disabled } = props;
  const minMaxLen = 1;
  let initChars = { 0: "", 1: "", 2: "", 3: "", 4: "" };
  if (word) {
    for (let i = 0; i < word.length; i += 1) {
      initChars[i] = word[i];
    }
  }
  const [inChars, setInChars] = useState(initChars);

  function handleChange(event, key) {
    const letterGuess = event.target.value;
    const updatedRow = {
      ...inChars,
      [key]: letterGuess ? letterGuess.toLowerCase() : "",
    };
    setInChars(updatedRow);
    const wordGuess = Object.values(updatedRow).join("");
    setSelectRow(wordGuess);

    // It should not be last input field
    if (key < 4 && letterGuess) {
      // Get the next input field using it's name
      const nextInputBox = document.querySelector(
        `input[name=box-input-${key + 1}-${rowIndex}]`
      );
      if (nextInputBox !== null) {
        nextInputBox.focus();
      }
    } else if (event.keyCode === 8 || event.keyCode === 46) {
      // Handles delete and backspacing
      let nextInputBox = null;
      if (wordGuess.length > 0) {
        nextInputBox = document.querySelector(
          `input[name=box-input-${wordGuess.length - 1}-${rowIndex}]`
        );
      }
      if (nextInputBox !== null) {
        nextInputBox.focus();
      }
    }

    event.preventDefault();
  }

  function getCharBoxes() {
    const boxList = [];
    for (let i = 0; i < 5; i += 1) {
      const evaluationClass = evaluation ? evaluation[i] : "";
      boxList.push(
        <input
          type="text"
          name={`box-input-${i}-${rowIndex}`}
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
