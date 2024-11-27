import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  return (
    <div className="landing-container">
      <h1>mini games collection</h1>
      <div className="button-container">
        <Link to="/calculator" className="app-button">Calculator</Link>
        <Link to="/snake" className="app-button">Snake Game</Link>
        <Link to="/tictactoe" className="app-button">Tic Tac Toe</Link>
      </div>
      <footer className="footer">
        made by zeke 2024
      </footer>
    </div>
  );
}

export default App;
