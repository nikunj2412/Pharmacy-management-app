import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/User";
import Medicines from "./pages/Medicines";
import Sales from "./pages/Sales";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
