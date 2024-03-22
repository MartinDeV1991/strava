
import './App.css';
import { Link, Route, Routes } from "react-router-dom";

import {
  ActivitiesPage,
  HomePage,
} from "./pages";

function App() {
  return (
    <div className="App">
      <div>
        <Link to="/activities">Go to Activities Page</Link>
        <br />
        <Link to="/">Go to HomePage Page</Link>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Routes>
    </div>
  );
}

export default App;
