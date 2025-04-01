// src/App.js
import React from 'react';
import {BrowserRouter as Router,Route,useNavigate, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // AuthContext import
import Login from './login';
import MainPage from './MainPage';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/goMainPage' element={<MainPage />} />
          <Route path='/goLogin' element={<Login />} />

        </Routes>
      </Router>
      </AuthProvider>
  );
}


export default App;
