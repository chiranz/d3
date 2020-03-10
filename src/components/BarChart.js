import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import { useResizeObserver } from "../hooks";

function BarChart() {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([20, 12, 25, 35, 50, 75, 80]);

  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);
    if (!dimensions) return;
    const xScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions.width])
      .padding(0.5); // Change
    const yScale = scaleLinear()
      .domain([0, 150]) // TODO:
      .range([dimensions.height, 0]); // Change
    const colorScale = scaleLinear()
      .domain([75, 110, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    const yAxis = axisRight(yScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (_, i) => xScale(i))
      .attr("y", -dimensions.height)
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
      .duration(500)
      .attr("fill", colorScale)
      .attr("height", value => dimensions.height - yScale(value));
  }, [data, dimensions]);
  return (
    <>
      <div ref={wrapperRef} className="chart-wrapper">
        <svg ref={svgRef}>
          <g className="x-axis"></g>
          <g className="y-axis"></g>
        </svg>
      </div>
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
    </>
  );
}

export default BarChart;
