import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { select } from "d3";

function App() {
  const [data, setData] = useState([20, 12, 25, 35, 50]);
  const svgRef = useRef();
  const randomColor = () =>
    `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
  useEffect(() => {
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join(
        enter => enter.append("circle"),
        update => update.attr("class", "updated")
      )
      .attr("r", value => value)
      .attr("cx", value => value * 2)
      .attr("cy", value => value * 2)
      .attr("stroke", randomColor());
  }, [data]);
  return (
    <div className="App">
      <h1 style={{ color: randomColor }}>D3 here</h1>
      <svg ref={svgRef}></svg>
      <button onClick={() => setData(data => data.map(val => val + 3))}>
        Update data
      </button>
      <button onClick={() => setData(data => data.filter(val => val < 38))}>
        Filter data
      </button>
    </div>
  );
}

export default App;
