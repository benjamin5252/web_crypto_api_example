import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";



import HomePage from "./pages/HomePage";
import Header from "./components/header/menu";

const App = () => {
  return (
    <>
      
      <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header></Header>
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
    
  );
};

export default App;