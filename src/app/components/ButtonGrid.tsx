"use client"
import React, { useState, useEffect } from 'react';

type ButtonState = {
  [key: string]: { color: 'red' | 'dark-gray' | 'gray-200'; text?: string };
};

const ButtonGrid = () => {
  const gridSize = 10;
  const [buttonState, setButtonState] = useState<ButtonState>({});
  const [gameOver, setGameOver] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(new Set());
  const [revealAllButtons, setRevealAllButtons] = useState(false);
  const [toResetGame, setToResetGame] = useState(false);

  useEffect(() => {
    const generateUniqueAddresses = () => {
      const newSelectedAddresses = new Set<string>();
      while (newSelectedAddresses.size < 25) {
        const randomRow = Math.floor(Math.random() * gridSize);
        const randomCol = Math.floor(Math.random() * gridSize);
        newSelectedAddresses.add(`${randomRow}-${randomCol}`);
      }
      setSelectedAddresses(newSelectedAddresses);
      setToResetGame(false);
    };

    generateUniqueAddresses();
  }, [toResetGame]);

  const getBombData = (row: number, col: number) => {
    const neighbors = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    let neighboringBombCount = neighbors.reduce((count, [dx, dy]) => {
      const neighborAddress = `${row + dx}-${col + dy}`;
      return count + (selectedAddresses.has(neighborAddress) ? 1 : 0);
    }, 0);

    return `${neighboringBombCount}`;
  };

  const handleGameOver = () => {
    setGameOver(true);
    setRevealAllButtons(true);
  };

  const handleButtonClick = (row: number, col: number) => {
    const currentAddress = `${row}-${col}`;

    if (selectedAddresses.has(currentAddress)) {
      setButtonState((prevState) => ({
        ...prevState,
        [currentAddress]: { color: 'red' },
      }));
      handleGameOver();
    } else {
      let text = getBombData(row, col);
      setButtonState((prevState) => ({
        ...prevState,
        [currentAddress]: { color: 'dark-gray', text: text },
      }));
    }
  };

  const handleResetGame = () => {
    setButtonState({});
    setGameOver(false);
    setRevealAllButtons(false);
    setToResetGame(true);
  };

  useEffect(() => {
    if (revealAllButtons) {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          handleButtonClick(row, col);
        }
      }
    }
  }, [revealAllButtons]);

  const buttons = [...Array(gridSize)].map((_, row) =>
    [...Array(gridSize)].map((_, col) => {
      const buttonId = `${row}-${col}`;
      const { color, text } = buttonState[buttonId] || { color: 'gray-200' };

      return (
        <button
          key={buttonId}
          onClick={() => handleButtonClick(row, col)}
          className={`w-12 h-12 m-1 rounded ${color === 'gray-200' ? 'bg-gray-200' : color === 'red' ? 'bg-red-500' : 'bg-gray-700'
            } text-white ${gameOver ? 'pointer-events-none' : ''}`}
          disabled={gameOver}
        >
          {text}
        </button>
      );
    }));

  return (
    <div>
      <div className="grid grid-cols-10 gap-1">
        {buttons}
      </div>

      {gameOver && (
        <button onClick={handleResetGame} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Reset Game</button>
      )}
    </div>
  );
};

export default ButtonGrid;
