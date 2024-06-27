import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminPanel from './components/Adminpanel';
import Kottacotton from "./components/Kottacotton";
import Pochampalli from "./components/Pochampalli";
import Silkcotton from "./components/Silkcotton";
import Softsilk from "./components/Softsilk";


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/kotta" element={<Kottacotton />} />
          <Route path="/pochampalli" element={<Pochampalli />} />
          <Route path="/silkcotton" element={<Silkcotton />} />
          <Route path="/softsilk" element={<Softsilk />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
