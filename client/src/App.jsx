import { Route, Routes, HashRouter as BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
