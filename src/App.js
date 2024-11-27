import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Calculator from './components/Calculator';
import Snake from './components/Snake';
import TicTacToe from './components/TicTacToe';
import './App.css';

function App() {
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/snake" element={<Snake />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function LandingPage() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const navigate = useNavigate();

  const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };

  const handleSnakeClick = (e) => {
    if (isMobileDevice()) {
      e.preventDefault();
      setShowMobileWarning(true);
    }
  };

  return (
    <div className="landing-container">
      <h1>mini games collection</h1>
      <div className="button-container">
        <Link to="/calculator" className="app-button">Calculator</Link>
        <Link to="/snake" className="app-button" onClick={handleSnakeClick}>
          Snake Game <br/>(Desktop Only)
        </Link>
        <Link to="/tictactoe" className="app-button">Tic Tac Toe</Link>
      </div>
      {showMobileWarning && (
        <div className="modal-overlay" onClick={() => setShowMobileWarning(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Desktop Only Game</h2>
            <p>Sorry, the Snake game is only available on desktop devices.</p>
            <button className="modal-button" onClick={() => setShowMobileWarning(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
      <footer className="footer">
        made by zeke 2024
      </footer>
    </div>
  );
}

export default App;
