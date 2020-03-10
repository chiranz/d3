import React, { useState } from "react";
import "./App.css";
import BarChart from "./components/BarChart";

function App() {
  const [data, setData] = useState([20, 12, 25, 35, 50, 75, 80]);

  return (
    <div className="App">
      <h1 style={{ color: "green" }}>D3 here</h1>
      <BarChart data={data} />

      <button onClick={() => setData(data => data.map(val => val + 3))}>
        Update data
      </button>
      <br />
      <button onClick={() => setData(data => data.filter(val => val < 140))}>
        Filter data
      </button>
      <br />
      <button
        onClick={() =>
          setData(data => {
            return [...data, Math.floor(Math.random() * 140)];
          })
        }
      >
        Add data
      </button>
    </div>
  );
}

export default App;
