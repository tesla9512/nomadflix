import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Detail from "./Routes/Detail";
import Home from "./Routes/Home";
import Search from "./Routes/Search";

function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="movies/:id" element={<Home />} />
          </Route>
          <Route path="movies/detail/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
