
import './App.css';
import { Link, Route, Routes } from "react-router-dom";

import {
  ActivitiesPage,
  HomePage,
  OverviewPage
} from "./pages";

function App() {
  return (
    <div className="App">
      <div>
        <Link to="/">Go to HomePage Page</Link>
        <br />
        <Link to="/activities">Go to Activities Page</Link>
        <br />
        <Link to="/overview">Go to Overview Page</Link>

      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/overview" element={<OverviewPage />} />
      </Routes>
    </div>
  );
}

export default App;
