import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';
import './util/Alert.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from "./components/Footer.jsx";

import Home from './routes/Home.jsx'
import Projects from "./routes/Projects.jsx";
import Proyecto from "./routes/Proyecto.jsx";
import LogIn from "./routes/LogIn.jsx";
import Perfil from "./routes/Profile.jsx";
import Terminos from "./routes/Terminos.jsx";
import Miembros from "./routes/Miembros.jsx"

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="App-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/proyecto/:id_proyecto" element={<Proyecto />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/miembros" element={<Miembros />} />

          <Route path="/perfil" element={<Perfil />} />
          
          
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
