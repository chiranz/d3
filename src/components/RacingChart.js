import React, { useState, useRef, useEffect } from "react";
import { randomColorGenerator, getTextColor } from "../utils";
import { useInterval, useResizeObserver } from "../hooks";
import { select, scaleBand, scaleLinear, max } from "d3";

export default function RacingChart() {
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [data, setData] = useState([
    {
      name: "alpha",
      color: randomColorGenerator(),
      value: 15
    },
    {
      name: "beta",
      color: randomColorGenerator(),
      value: 20
    },
    {
      name: "gamma",
      color: randomColorGenerator(),
      value: 10
    },
    {
      name: "pie",
      color: randomColorGenerator(),
      value: 25
    },
    {
      name: "echo",
      color: randomColorGenerator(),
      value: 30
    },
    {
      name: "mini",
      color: randomColorGenerator(),
      value: 35
    }
  ]);
  const dimensions = useResizeObserver(wrapperRef);
  const getRandomIndex = data => Math.floor(Math.random() * data.length + 1);
  useInterval(() => {
    if (start) {
      const randomIndex = getRandomIndex(data);
      setData(
        data.map((d, index) =>
          index === randomIndex ? { ...d, value: d.value + 10 } : d
        )
      );
      setIteration(i => i + 1);
    }
  }, 500);
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    //   sorting the data
    data.sort((a, b) => b.value - a.value);
    const yScale = scaleBand()
      .paddingInner(0.25)
      .domain(data.map((_, i) => i))
      .range([0, dimensions.height]);
    const xScale = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .range([0, dimensions.width]);
    // Draw the bars here
    svg
      .selectAll(".bar")
      .data(data, d => d.name)
      .join(enter => enter.append("rect").attr("y", (_, i) => yScale(i)))
      .attr("fill", d => d.color)
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .transition()
      .delay(350)
      .attr("width", d => xScale(d.value))
      .attr("y", (_, i) => yScale(i));
    //   Draw the labels
    svg
      .selectAll(".label")
      .data(data, d => d.name)
      .join(enter =>
        enter
          .append("text")
          .attr("y", (_, i) => yScale(i) + yScale.bandwidth() / 2 + 5)
      )
      .text(d => ` .... ${d.name}(${d.value} meters)`)
      .attr("class", "label")
      .attr("x", 10)
      .attr("justify-content", "centre")
      .attr("fill", d => getTextColor(d.color))
      .transition()
      .attr("y", (_, i) => yScale(i) + yScale.bandwidth() / 2 + 5);
  }, [data, dimensions]);
  return (
    <div>
      <h1>Racing bar chart</h1>
      <div ref={wrapperRef} className="chart-wrapper">
        <svg ref={svgRef} height="300"></svg>
      </div>
      <button
        className="call-to-action"
        onClick={() => setStart(start => !start)}
      >
        {start ? "Stop the race" : "Start the race"}
      </button>
      <p>Iteration: {iteration}</p>
    </div>
  );
}
