// import { useRef } from "react";
// import { useEffect } from "react";
// import { useState } from "react";



// const Wordle = () => {
//   const [word, setWord] = useState("");
//   const fetched = useRef(false);
//   useEffect(() => {
//     if (fetched.current) return;
//     fetched.current = true;
//     const fetchData = async () => {
//       try {
//         const response = await fetch(api_url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch words");
//         }
//         const data = await response.json();
//         setWord(data[Math.floor(Math.random() * data.length)]);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, []);
//   return <div className="testing text-2xl text-red-700">{word}</div>;
// };

// export default Wordle;

import { useEffect, useState, useRef, useCallback } from "react";

const api_url = "/api/api/fe/wordle-words";

const ROWS = 5;
const COLS = 5;

// Create empty grid
const createEmptyGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(""));

// Create empty colors
const createEmptyColors = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill("bg-gray-700"));

const Wordle = () => {
  // ✅ Fallback word so UI never blank
  const [secretWord, setSecretWord] = useState("APPLE");

  const [grid, setGrid] = useState(() => createEmptyGrid());
  const [colors, setColors] = useState(() => createEmptyColors());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const fetched = useRef(false);

  // ✅ Fetch word (with safety)
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchWord = async () => {
      try {
        const res = await fetch(api_url);

        if (!res.ok) {
          console.warn("API failed → Using fallback word");
          return;
        }

        const data = await res.json();
        console.log("API DATA:", data);

        if (!Array.isArray(data)) {
          console.warn("API not array → Using fallback word");
          return;
        }

        const words = data.filter((w) => w.length === 5);

        if (!words.length) {
          console.warn("No 5 letter words → Using fallback");
          return;
        }

        const randomWord =
          words[Math.floor(Math.random() * words.length)].toUpperCase();

        setSecretWord(randomWord);
      } catch (err) {
        console.warn("Fetch error → Using fallback word", err);
      }
    };

    fetchWord();
  }, []);

  // ✅ Evaluate guess (Stable)
  const evaluateGuess = useCallback(
    (guess, rowIndex) => {
      if (!secretWord) return;

      const secretArr = secretWord.split("");
      const guessArr = guess.split("");
      const rowColors = Array(COLS).fill("bg-gray-400");

      // Green
      for (let i = 0; i < COLS; i++) {
        if (guessArr[i] === secretArr[i]) {
          rowColors[i] = "bg-green-500";
          secretArr[i] = null;
          guessArr[i] = null;
        }
      }

      // Yellow
      for (let i = 0; i < COLS; i++) {
        if (guessArr[i] && secretArr.includes(guessArr[i])) {
          rowColors[i] = "bg-yellow-500";
          secretArr[secretArr.indexOf(guessArr[i])] = null;
        }
      }

      setColors((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[rowIndex] = rowColors;
        return copy;
      });

      if (guess === secretWord) {
        alert("🎉 You Win!");
        setGameOver(true);
      } else if (rowIndex === ROWS - 1) {
        alert(`❌ Game Over! Word was ${secretWord}`);
        setGameOver(true);
      }
    },
    [secretWord]
  );

  // ✅ Keyboard handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!secretWord || gameOver || currentRow >= ROWS) return;

      // Backspace
      if (e.key === "Backspace" && currentCol > 0) {
        setGrid((prev) => {
          const copy = prev.map((r) => [...r]);
          copy[currentRow][currentCol - 1] = "";
          return copy;
        });
        setCurrentCol((c) => c - 1);
        return;
      }

      // Enter
      if (e.key === "Enter") {
        if (currentCol === COLS) {
          const guess = grid[currentRow].join("");
          evaluateGuess(guess, currentRow);
          setCurrentRow((r) => r + 1);
          setCurrentCol(0);
        }
        return;
      }

      // Letters
      if (/^[a-zA-Z]$/.test(e.key) && currentCol < COLS) {
        setGrid((prev) => {
          const copy = prev.map((r) => [...r]);
          copy[currentRow][currentCol] = e.key.toUpperCase();
          return copy;
        });
        setCurrentCol((c) => c + 1);
      }
    },
    [secretWord, gameOver, currentRow, currentCol, grid, evaluateGuess]
  );

  // ✅ Keyboard event attach
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-2 items-center mt-10">
      <h1 className="text-3xl font-bold text-white mb-4">WORDLE</h1>

      {grid.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((cell, j) => (
            <div
              key={j}
              className={`w-14 h-14 border-2 flex items-center justify-center text-xl font-bold text-white transition-all duration-200 ${colors[i][j]}`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Wordle;



