import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ShakeLevel } from '../types';

interface SeismographProps {
  shakeLevel: ShakeLevel;
  magnitude: number;
}

const Seismograph: React.FC<SeismographProps> = ({ shakeLevel, magnitude }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[]>(new Array(100).fill(0));
  
  // Update data loop
  useEffect(() => {
    let animationFrameId: number;
    
    const update = () => {
      setData(prevData => {
        const newData = [...prevData];
        newData.shift(); // Remove oldest
        
        let noise = (Math.random() - 0.5) * 2; // Base noise
        let signal = 0;

        // Add signal based on shake level
        if (shakeLevel !== ShakeLevel.NONE) {
          const intensityMultiplier = magnitude * 2.5; 
          // Create a wave pattern with noise
          signal = (Math.sin(Date.now() / 50) * intensityMultiplier * Math.random()) + 
                   (Math.cos(Date.now() / 20) * (intensityMultiplier / 2) * Math.random());
        } else {
           noise = noise * 0.5; // Very quiet background noise
        }

        newData.push(signal + noise);
        return newData;
      });
      
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shakeLevel, magnitude]);

  // D3 Drawing
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous
    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    // Y scale needs to accommodate large spikes
    const yScale = d3.scaleLinear()
      .domain([-50, 50]) // Fixed domain to show relative intensity visually
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveBasis); // Smooth the line slightly

    // Draw grid
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(() => ""));

    // Draw the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", shakeLevel === ShakeLevel.EXTREME ? "#ef4444" : "#10b981") // Red for extreme, Green/Teal for normal
      .attr("stroke-width", 2)
      .attr("d", line);
      
    // Add "LIVE" indicator
    svg.append("circle")
        .attr("cx", width - 10)
        .attr("cy", 10)
        .attr("r", 4)
        .attr("fill", shakeLevel !== ShakeLevel.NONE ? "#ef4444" : "#10b981")
        .append("animate")
        .attr("attributeName", "opacity")
        .attr("values", "1;0.2;1")
        .attr("dur", "1s")
        .attr("repeatCount", "indefinite");

    svg.append("text")
        .attr("x", width - 20)
        .attr("y", 14)
        .attr("text-anchor", "end")
        .attr("fill", shakeLevel !== ShakeLevel.NONE ? "#ef4444" : "#10b981")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .text("LIVE SENSOR DATA");

  }, [data, shakeLevel]);

  return (
    <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative shadow-inner">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 bg-slate-900/80 p-1 px-2 text-xs font-mono text-slate-400 border-b border-r border-slate-800 rounded-br">
        STN: G-291
      </div>
    </div>
  );
};

export default Seismograph;