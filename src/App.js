import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/Adminpanel';
import Kottacotton from "./components/Kottacotton";
import Pochampalli from "./components/Pochampalli";
import Silkcotton from "./components/Silkcotton";
import Softsilk from "./components/Softsilk";
import Sideheader from "./components/Sideheader";
import Login from './components/Login';
import ProtectedRoute from './components/Protectedroute';
import Users from './components/Users';
import Data from './components/Data';
import Inventory from './components/Inventory';
import Orders from './components/Orders';

function App() {
  return (
    <Router>
      <div>
        <Sideheader />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cotton" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/kotta" element={
            <ProtectedRoute>
              <Kottacotton />
            </ProtectedRoute>
          } />
          <Route path="/pochampalli" element={
            <ProtectedRoute>
              <Pochampalli />
            </ProtectedRoute>
          } />
          <Route path="/silkcotton" element={
            <ProtectedRoute>
              <Silkcotton />
            </ProtectedRoute>
          } />
          <Route path="/softsilk" element={
            <ProtectedRoute>
              <Softsilk />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/data" element={
            <ProtectedRoute>
              <Data />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
