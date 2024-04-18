
import './App.css';
import { Link, Route, Routes } from "react-router-dom";

import {
  ActivitiesPage,
  HomePage,
  OverviewPage
} from "./pages";

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '10px',
};

const hoverStyle = {
  backgroundColor: '#0056b3',
};

function App() {
  return (
    <div className="App">
      <br />
      <div style={containerStyle}>
        <Link to="/" style={buttonStyle} onMouseEnter={handleHover} onMouseLeave={handleHover}>Go to Home Page</Link>
        <Link to="/activities" style={buttonStyle} onMouseEnter={handleHover} onMouseLeave={handleHover}>Go to Activities Page</Link>
        <Link to="/overview" style={buttonStyle} onMouseEnter={handleHover} onMouseLeave={handleHover} >Go to Overview Page</Link>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/overview" element={<OverviewPage />} />
      </Routes>
    </div>
  );
}
function handleHover(event) {
  event.target.style.backgroundColor = event.type === 'mouseenter' ? hoverStyle.backgroundColor : buttonStyle.backgroundColor;
}

export default App;
