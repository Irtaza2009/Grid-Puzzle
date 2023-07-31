import React, { useState, createContext, useContext } from 'react';

const JumpToContext = createContext();

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, resetBoard }) {
  const jumpTo = useJumpTo();
  function handleClick(i) {
    /* if (calculateWinner(squares) || squares[i]) {
      return;
    } */
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, randomPattern);
  let status;
  if (winner === true) {
    status = 'You have won the game!';
    timeout(5000);
    jumpTo(0);
    var randomPattern = generateRandomPattern();
  } else if (winner === 'Lost') {
    status = 'You have lost!';
  } else {
    status = 'Next Piece: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [randomPattern, setRandomPattern] = useState("oxo,xxx,oxo");
  
  

  function handlePlay(nextSquares) {
    if (!isValidMove(nextSquares)) {
      // Invalid move: Three same symbols in a line
      return;
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function isValidMove(squares) {
    const pattern = ['X', 'O']; // Pattern to match
    const maxIndex = 8;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    // Check if the board is empty
    if (squares.every((square) => !square)) {
      return true;
    }
  
    // Check if it's the final move
    if (currentMove === maxIndex) {
      return true;
    }
  
    // Check if three same symbols in a line
    for (const symbol of pattern) {
      for (const line of lines) {
        if (line.every((index) => squares[index] === symbol)) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button className="turnButton" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <JumpToContext.Provider value={jumpTo}>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="pattern-text">Pattern</div>
      <Pattern patternProp={randomPattern} />
      
      
    
    </div>
    </JumpToContext.Provider>
    
  );
}

function calculateWinner(squares, pattern) {
  // Check for the pattern match
  const hasPattern = (squares.join('') === pattern);

  if (hasPattern) {
    
    return true; // Return the pattern itself as the winner
  }
  

  else if (squares.every((square) => square === "X" || square === "O")) {
    return "Lost"; // Return "Full" if the board is full and no winner is found
  }

  return null;
}



function Pattern({patternProp}) {
  const pattern = patternProp;
  const rows = pattern.split(',');

  return (
    <div className="pattern-board">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.split('').map((symbol, colIndex) => (
            <Square
              key={colIndex}
              value={symbol}
              onSquareClick={() => {}}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function generateRandomPattern() {
  const patternLength = 9; // Length of the pattern string
  const maxCountX = 5; // Maximum 'X' occurrences
  const maxCountO = 4; // Maximum 'O' occurrences

  let pattern = '';
  let countX = 0;
  let countO = 0;

  for (let i = 0; i < patternLength; i++) {
    // Generate a random number between 0 and 1 (inclusive)
    const random = Math.random();

    if (countX < maxCountX && random < 0.5) {
      // Add 'X' to the pattern if the count is less than maxCountX
      pattern += 'X';
      countX++;
    } else if (countO < maxCountO && random >= 0.5) {
      // Add 'O' to the pattern if the count is less than maxCountO
      pattern += 'O';
      countO++;
    } else {
      // If the count of 'X' or 'O' reaches its maximum, add the opposite symbol
      pattern += countX < maxCountX ? 'O' : 'X';
    }

    // Add a comma after every three characters
    if ((i + 1) % 3 === 0 && i < patternLength - 1) {
      pattern += ',';
    }
  }

  return pattern;
}



function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

export function useJumpTo() {
  return useContext(JumpToContext);
}
