import { Route, Routes, HashRouter as BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";



const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Inicio/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
