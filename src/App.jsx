// import { useState } from 'react'
import './App.css'
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Rumah from "./pages/rumah"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rumah" element={<Rumah />} />
      </Routes>
    </>
  );
}

export default App
