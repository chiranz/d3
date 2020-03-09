import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { select, axisBottom, axisRight, scaleLinear, scaleBand, max } from "d3";

function App() {
  const [data, setData] = useState([20, 12, 25, 35, 50, 75, 80]);
  const svgRef = useRef();
  const randomColor = () =>
    `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, 300])
      .padding(0.5);
    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0]);
    const colorScale = scaleLinear()
      .domain([75, 110, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    const yAxis = axisRight(yScale);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (_, i) => xScale(i))
      .attr("y", -150)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, i) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join(enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(i) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 5)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 150 - yScale(value));
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
      <br />
      <button onClick={() => setData(data => data.filter(val => val < 38))}>
        Filter data
      </button>
      <br />
      <button
        onClick={() =>
          setData(data => {
            return [...data, Math.floor(Math.random() * 100)];
          })
        }
      >
        Add data
      </button>
    </div>
  );
}

export default App;
