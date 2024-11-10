import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start';
import UserHome from './UserHome';
import Register from './Register'

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Start />}  />
          <Route path="/userhome" element={<UserHome />}  />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
};

export default App;
