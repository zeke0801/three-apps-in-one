import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './TicTacToe.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [gameMode, setGameMode] = useState('ai');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('tictactoeScores');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tictactoeScores', JSON.stringify(scores));
  }, [scores]);

  const calculateWinner = (squares) => {
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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getEmptySquares = (squares) => {
    return squares.reduce((empty, square, index) => {
      if (!square) empty.push(index);
      return empty;
    }, []);
  };

  const minimax = (squares, depth, isMaximizing, alpha, beta) => {
    const winner = calculateWinner(squares);
    
    // Terminal states
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (getEmptySquares(squares).length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const evaluation = minimax(squares, depth + 1, false, alpha, beta);
          squares[i] = null;
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const evaluation = minimax(squares, depth + 1, true, alpha, beta);
          squares[i] = null;
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const findBestMove = (squares) => {
    let bestMove = -1;
    let bestValue = -Infinity;
    
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const moveValue = minimax(squares, 0, false, -Infinity, Infinity);
        squares[i] = null;
        
        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  };

  const makeAIMove = useCallback(() => {
    if (gameMode === 'ai' && !xIsNext && !calculateWinner(board)) {
      const boardCopy = [...board];
      const move = findBestMove(boardCopy);
      if (move !== -1) {
        boardCopy[move] = 'O';
        setBoard(boardCopy);
        setXIsNext(true);
      }
    }
  }, [board, xIsNext, gameMode, findBestMove]);

  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext) {
      // Add a small delay to make AI moves feel more natural
      const timeoutId = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [xIsNext, gameMode, makeAIMove]);

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (calculateWinner(boardCopy) || boardCopy[i] || (!xIsNext && gameMode === 'ai')) return;
    
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const handleGameSetup = (e) => {
    e.preventDefault();
    if (!gameMode || !player1Name || (gameMode === 'turns' && !player2Name)) return;
    setShowSetup(false);
  };

  const getRandomRobotName = () => {
    const prefixes = ['ROBO', 'CYBER', 'MECHA', 'TECH', 'BOT', 'AI', 'QUANTUM', 'BINARY', 'DIGITAL', 'NEURAL'];
    const suffixes = ['TRON', 'MIND', 'CORE', 'UNIT', 'MATRIX', 'NET', 'BYTE', 'CIRCUIT', 'FLEX', 'WAVE'];
    const numbers = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix}-${suffix}-${numbers}`;
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    const gameOver = winner || getEmptySquares(board).length === 0;
    
    if (gameOver && !gameEnded) {
      setGameEnded(true);
      const newScore = {
        date: new Date().toLocaleDateString(),
        mode: gameMode,
        player1: player1Name,
        player2: gameMode === 'ai' ? getRandomRobotName() : player2Name,
        winner: winner === 'X' ? player1Name : (winner === 'O' ? (gameMode === 'ai' ? getRandomRobotName() : player2Name) : 'Draw')
      };
      
      const updatedScores = [newScore, ...scores.slice(0, 9)];
      setScores(updatedScores);
      localStorage.setItem('tictactoeScores', JSON.stringify(updatedScores));
    }
  }, [board, gameMode, player1Name, player2Name, scores, gameEnded]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameEnded(false);
  };

  const renderSquare = (i) => {
    return (
      <button 
        className="square" 
        onClick={() => handleClick(i)} 
        disabled={board[i] !== null}
        value={board[i]}
      >
        {board[i]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? player1Name : (gameMode === 'ai' ? 'AI' : player2Name)}`;
  } else if (isDraw) {
    status = 'Game Draw!';
  } else {
    status = `Next player: ${xIsNext ? player1Name : (gameMode === 'ai' ? 'AI' : player2Name)}`;
  }

  return (
    <div className="tictactoe-container">
      <Link to="/" className="back-button">↩</Link>
      {showSetup ? (
        <form onSubmit={handleGameSetup} className="game-setup-form">
          <h2>Choose your Setup</h2>
          <div className="game-modes">
            <div 
              className={`mode-option ${gameMode === 'ai' ? 'selected' : ''}`}
              onClick={() => setGameMode('ai')}
            >
              <h3>🤖 VS AI</h3>
              <p>Play against computer</p>
            </div>
            <div 
              className={`mode-option ${gameMode === 'turns' ? 'selected' : ''}`}
              onClick={() => setGameMode('turns')}
            >
              <h3>👥 Two Players</h3>
              <p>Play with a friend</p>
            </div>
          </div>
          <div className="player-inputs">
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder="Player 1 Name"
              maxLength="15"
              required
            />
            {gameMode === 'turns' && (
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Player 2 Name"
                maxLength="15"
                required
              />
            )}
          </div>
          <button type="submit" disabled={!gameMode || !player1Name || (gameMode === 'turns' && !player2Name)}>
            Start Game
          </button>
        </form>
      ) : (
        <div className="game-container">
          <div className="scoreboard">
            <h2>Game History</h2>
            <div className="scores-list">
              {scores
                .slice()
                .reverse()
                .slice(0, 10)
                .map((score, index) => (
                  <div key={index} className="score-entry">
                    <span className="game-mode">{score.mode === 'ai' ? '🤖' : '👥'}</span>
                    <span className="player-name">{score.winner}</span>
                    <span className="vs-text">won</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="game-divider"></div>
          <div className="game">
            <div className="game-info">
              <h2>{status}</h2>
            </div>
            <div className="game-board">
              <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
              </div>
              <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
              </div>
              <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
              </div>
            </div>
            {(winner || isDraw) && (
              <button className="reset-button" onClick={resetGame}>
                Play Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
