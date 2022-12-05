import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import RankingPage from "./pages/ranking";
import AddSongPage from "./pages/addsong";
import PageNotFound from "./pages/404";
import Footer from "./components/footer";
import './App.css';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="/ranking" element={ <RankingPage/> }/>
          <Route path="/addsong" element={ <AddSongPage/> }/>
          <Route path="*" element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
