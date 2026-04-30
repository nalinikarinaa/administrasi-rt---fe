// import { useState } from 'react'
import './App.css'
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Rumah from "./pages/rumah"
import Penghuni from "./pages/penghuni"
import Pembayaran from "./pages/pembayaran"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rumah" element={<Rumah />} />
        <Route path="/penghuni" element={<Penghuni />} /> 
        <Route path="/pembayaran" element={<Pembayaran />} /> 
      </Routes>
    </>
  );
}

export default App
