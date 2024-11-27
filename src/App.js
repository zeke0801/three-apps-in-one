import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calculator from './components/Calculator';
import Snake from './components/Snake';
import TicTacToe from './components/TicTacToe';
import './App.css';
import calcIcon from './tab-icon/calc.png';
import snakeIcon from './tab-icon/snake.png';
import tictactoeIcon from './tab-icon/tictactoe.png';

function App() {
  const setFavicon = (iconPath, pageTitle = 'ReactJs Mini Apps') => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = iconPath;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = iconPath;
      document.head.appendChild(newFavicon);
    }
    document.title = pageTitle;
  };

  return (
    <Router>
      <div className="App">
        <div className="background">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div>
                {setFavicon(calcIcon, 'Home')}
                <LandingPage />
              </div>
            } />
            <Route path="/calculator" element={
              <div>
                {setFavicon(calcIcon, 'Calculator')}
                <Calculator />
              </div>
            } />
            <Route path="/snake" element={
              <div>
                {setFavicon(snakeIcon, 'Snake Game')}
                <Snake />
              </div>
            } />
            <Route path="/tictactoe" element={
              <div>
                {setFavicon(tictactoeIcon, 'Tic Tac Toe')}
                <TicTacToe />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function LandingPage() {
  return (
    <div className="landing-container">
      <h1>React JS <br/> mini apps collection</h1>
      <div className="button-container">
        <Link to="/calculator" className="app-button">Calculator</Link>
        <Link to="/snake" className="app-button">Snake Game<br />Desktop Recommended</Link>
        <Link to="/tictactoe" className="app-button">Tic Tac Toe</Link>
      </div>
      <footer className="footer">
        made by zeke 2024
      </footer>
    </div>
  );
}

export default App;
