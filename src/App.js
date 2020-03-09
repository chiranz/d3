import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  axisRight,
  scaleLinear,
  max
} from "d3";

function App() {
  const [data, setData] = useState([20, 12, 25, 35, 50, 75, 80]);
  const svgRef = useRef();
  const randomColor = () =>
    `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]);
    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([150, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index + 1);
    const yAxis = axisRight(yScale);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);
    const myLine = line()
      .x((_, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", randomColor());
  }, [data]);
  return (
    <div className="App">
      <h1 style={{ color: randomColor }}>D3 here</h1>
      <svg ref={svgRef}>
        <g className="x-axis"></g>
        <g className="y-axis"></g>
      </svg>

      <br />
      <br />
      <br />
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
