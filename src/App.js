import { useState } from 'react';

// Square component represents an individual cell in the game grid.
// value: Holds the current value ('X', 'O', or null) to display in the square.
// onSquareClick: Function to call when the square is clicked, passing the square's index.
function Square({ value, onSquareClick }) {
  // Renders a button for the square with an onClick handler and displays the value.
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component represents the game board and handles gameplay logic.
// xIsNext: Boolean value indicating whether 'X' is the next to play.
// squares: Array representing the current state of the game board.
// onPlay: Function to execute when a play is made, updating the game state.
function Board({ xIsNext, squares, onPlay }) {
  // handleClick is called when a square is clicked.
  // i: Index of the clicked square in the squares array.
  function handleClick(i) {
    // Prevents play if the game is won or the square is already filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Clones the squares array for immutability.
    const nextSquares = squares.slice();
    // Sets the value of the clicked square to 'X' or 'O' based on xIsNext.
    nextSquares[i] = xIsNext ? 'X' : 'O';
    // Calls the onPlay function with the new squares array to update state.
    onPlay(nextSquares);
  }

  // Determines if there's a winner and updates the status message accordingly.
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Renders the game board interface with the status message and 3x3 grid of squares.
  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, row) => (
        <div className="board-row" key={row}>
          {Array(3).fill(null).map((_, col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

// Game component is the top-level component that renders the Board and other game controls.
export default function Game() {
  // history: Array of squares arrays representing the game state at each move.
  // setHistory: Function to update the history.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // currentMove: Index of the current move in the history.
  // setCurrentMove: Function to update the currentMove.
  const [currentMove, setCurrentMove] = useState(0);
  // xIsNext: Boolean calculated from currentMove to determine who plays next.
  const xIsNext = currentMove % 2 === 0;
  // currentSquares: Array representing the current state of the game board.
  const currentSquares = history[currentMove];

  // handlePlay is called when a new play is made.
  // nextSquares: The new state of the game board after the play.
  function handlePlay(nextSquares) {
    // Updates the history to include the new state of the board.
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    // Sets the current move to the latest move.
    setCurrentMove(nextHistory.length - 1);
  }

  // jumpTo is called to revert to a previous state in the game's history.
  // nextMove: The move index to revert to.
  function jumpTo(nextMove) {
    // Sets the current move to nextMove, effectively reverting the game state.
    setCurrentMove(nextMove);
  }

  // Maps over the history of moves to create a list of buttons for navigation.
  const moves = history.map((squares, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

// Renders the main game component structure
return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// calculateWinner function: Determines the winner of the game.
// squares: Array representing the current state of the game board.
function calculateWinner(squares) {
  // Lines that can be filled to win the game
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
  // Iterate over the possible winning lines to see if any are filled
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Check if the squares at the winning line indices are filled and the same
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Return the winner ('X' or 'O')
      return squares[a];
    }
  }
  // If no winner, return null
  return null;
}
