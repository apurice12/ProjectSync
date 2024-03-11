import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/LoginRegisterPage/LoginRegisterPage';
import MainPage from './components/MainPage/MainPage';


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/mainpage" element={<MainPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
