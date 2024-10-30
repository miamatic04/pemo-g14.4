import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start';
import Home from './Home';
import Register from './Register'

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Start />}  />
          <Route path="/home" element={<Home />}  />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
};

export default App;
