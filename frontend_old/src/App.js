import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movies from "./pages/Movies"; // we’ll build this next

const App = () => {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#f0f0f0" }}>
        <Link to="/register" style={{ margin: "0 10px" }}>Register</Link>
        <Link to="/login" style={{ margin: "0 10px" }}>Login</Link>
        <Link to="/movies" style={{ margin: "0 10px" }}>Movies</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  );
};

export default App;
