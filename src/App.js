import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { select, line, curveCardinal } from "d3";

function App() {
  const [data, setData] = useState([20, 12, 25, 35, 50, 75, 80]);
  const svgRef = useRef();
  const randomColor = () =>
    `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
  useEffect(() => {
    const svg = select(svgRef.current);
    const myLine = line()
      .x((_, index) => index * 50)
      .y(value => 150 - value)
      .curve(curveCardinal);
    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
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
