import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminPanel from './components/Adminpanel';
import Kottacotton from "./components/Kottacotton";
import Pochampalli from "./components/Pochampalli";
import Silkcotton from "./components/Silkcotton";
import Softsilk from "./components/Softsilk";
import Sideheader from "./components/Sideheader";
import Users from './components/Users';
import Data from './components/Data';
import Inventory from './components/Inventory';
import Orders from './components/Orders';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Sideheader />
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/kotta" element={<Kottacotton />} />
          <Route path="/pochampalli" element={<Pochampalli />} />
          <Route path="/silkcotton" element={<Silkcotton />} />
          <Route path="/softsilk" element={<Softsilk />} />
          <Route path='/users' element={<Users />} />
          <Route path='/data' element={<Data />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/orders' element={<Orders/>}/>
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
