import { useState } from "react";
import ReactDom from "react-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
