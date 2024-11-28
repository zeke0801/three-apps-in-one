import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Snake.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 0.05; // 5% speed increase per point

function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState('');
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('snakeHighScores');
    return saved ? JSON.parse(saved) : [];
  });
  const [showNameInput, setShowNameInput] = useState(true);
  const [isDarkened, setIsDarkened] = useState(false);
  const [darkenDuration, setDarkenDuration] = useState(1);

  useEffect(() => {
    localStorage.setItem('snakeHighScores', JSON.stringify(highScores));
  }, [highScores]);

  const saveScore = () => {
    if (!playerName.trim()) return;
    
    const newScore = {
      name: playerName,
      score: score,
      mode: gameMode,
      date: new Date().toLocaleDateString()
    };

    const newHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setHighScores(newHighScores);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim() || !gameMode) return;
    setShowNameInput(false);
    setIsStarted(false);
  };

  const generateFood = useCallback(() => {
    let newFood;
    const isOnSnake = (pos) => {
      return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    };

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (isOnSnake(newFood));

    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (!isStarted || gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y = gameMode === 'open' ? 
          (head.y - 1 + GRID_SIZE) % GRID_SIZE : 
          head.y - 1;
        break;
      case 'DOWN':
        head.y = gameMode === 'open' ? 
          (head.y + 1) % GRID_SIZE :
          head.y + 1;
        break;
      case 'LEFT':
        head.x = gameMode === 'open' ? 
          (head.x - 1 + GRID_SIZE) % GRID_SIZE :
          head.x - 1;
        break;
      case 'RIGHT':
        head.x = gameMode === 'open' ? 
          (head.x + 1) % GRID_SIZE :
          head.x + 1;
        break;
      default:
        break;
    }

    // Check for collisions
    if (
      (gameMode === 'contained' && (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      )) ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [head];
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      generateFood();
      newSnake.push(...snake);
    } else {
      newSnake.push(...snake.slice(0, -1));
    }
    setSnake(newSnake);
  }, [direction, food, snake, score, gameOver, isStarted, generateFood, gameMode]);

  const getCurrentSpeed = useCallback(() => {
    const speedMultiplier = 1 - (score * SPEED_INCREASE);
    // Don't let it get too fast (minimum 50ms)
    return Math.max(50, INITIAL_SPEED * speedMultiplier);
  }, [score]);

  const handleDarkenChallenge = useCallback(() => {
    if (score > 0 && score % 10 === 0) {
      const challengeDuration = Math.floor(score / 10);
      setDarkenDuration(challengeDuration);
      setIsDarkened(true);
      setTimeout(() => {
        setIsDarkened(false);
      }, challengeDuration * 1000);
    }
  }, [score]);

  useEffect(() => {
    if (isStarted && !gameOver) {
      handleDarkenChallenge();
    }
  }, [score, isStarted, gameOver, handleDarkenChallenge]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !isStarted && !gameOver && !showNameInput) {
        setIsStarted(true);
      }
      
      if (!isStarted) return;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'arrowdown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'arrowleft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'arrowright':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, isStarted, gameOver, showNameInput]);

  useEffect(() => {
    if (!isStarted) return;

    const gameInterval = setInterval(moveSnake, getCurrentSpeed());
    return () => clearInterval(gameInterval);
  }, [moveSnake, isStarted, getCurrentSpeed]);

  const resetGame = () => {
    if (score > 0) {
      saveScore();
    }
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsStarted(false);
    setShowNameInput(true);
    setPlayerName('');
    setGameMode('');
  };

  return (
    <div className="snake-container">
      <Link to="/" className="back-button">↩</Link>
      
      <div className="game-content">
        {showNameInput ? (
          <form onSubmit={handleNameSubmit} className="name-input-form">
            <h2>Select Game Mode</h2>
            <div className="game-modes">
              <div 
                className={`mode-option ${gameMode === 'open' ? 'selected' : ''}`}
                onClick={() => setGameMode('open')}
              >
                <h3>🌐 Open World</h3>
                <p>I mean, "Open World"
                </p>
              </div>
              <div 
                className={`mode-option ${gameMode === 'contained' ? 'selected' : ''}`}
                onClick={() => setGameMode('contained')}
              >
                <h3>📦 Contained</h3>
                <p>Walls are deadly, literally.</p>
              </div>
            </div>
            <div className="name-input-container">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength="15"
                required
              />
              <button type="submit" disabled={!gameMode}>Start</button>
            </div>
          </form>
        ) : (
          <div className="game-container">
            <div className="scoreboard">
              <h2>High Scores</h2>
              <div className="scores-list">
                {[
                  ...(playerName && !showNameInput ? [{name: playerName, score: score, current: true, mode: gameMode}] : []),
                  ...highScores
                ]
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 10)
                  .map((entry, index) => (
                  <div key={index} className={`score-entry ${entry.current ? 'current-player' : ''}`}>
                    <span className="game-mode">{entry.mode === 'open' ? '🌐' : '📦'}</span>
                    <span className="player-name">{entry.name}</span>
                    <span className="player-score">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="game-divider"></div>
            <div className="game-board-snake">
              {!isStarted && !gameOver && (
                <div className="start-message-overlay">
                  <h2>Press Space Bar to Start!</h2>
                </div>
              )}
              {gameOver && (
                <div className="game-over-overlay">
                  <h2>GAME OVER</h2>
                  <button onClick={resetGame}>Play Again</button>
                </div>
              )}
              {isDarkened && (
                <div className="darken-overlay" style={{ animationDuration: `${darkenDuration}s` }}></div>
              )}
              <div className="grid">
                {Array.from({ length: GRID_SIZE }, (_, y) => (
                  <div key={y} className="row">
                    {Array.from({ length: GRID_SIZE }, (_, x) => {
                      const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                      const isFood = food.x === x && food.y === y;
                      return (
                        <div
                          key={x}
                          className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Snake;
