import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="App-container">
        <Routes>
          {/*<Route path="/" element={<Navbar />} />*/}
        </Routes>
      </div>
    </div>
  );
}

export default App;
