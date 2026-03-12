
import {  Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlacePage from "./pages/PlacePage";


function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<PlacePage />} />
      </Routes>

  );
}

export default App;

