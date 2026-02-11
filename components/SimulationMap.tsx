import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface SimulationMapProps {
  epicenter: { x: number; y: number };
  onEpicenterChange: (pos: { x: number; y: number }) => void;
  isShaking: boolean;
  magnitude: number;
}

const SimulationMap: React.FC<SimulationMapProps> = ({ epicenter, onEpicenterChange, isShaking, magnitude }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    svg.selectAll(".waves").remove();
    svg.selectAll(".epicenter").remove();

    // Map Grid Background (stylized)
    if (svg.select(".grid-group").empty()) {
        const gridGroup = svg.append("g").attr("class", "grid-group");
        // Vertical lines
        for (let i = 0; i < width; i += 40) {
            gridGroup.append("line")
                .attr("x1", i).attr("y1", 0)
                .attr("x2", i).attr("y2", height)
                .attr("stroke", "#1e293b")
                .attr("stroke-width", 1);
        }
        // Horizontal lines
        for (let i = 0; i < height; i += 40) {
            gridGroup.append("line")
                .attr("x1", 0).attr("y1", i)
                .attr("x2", width).attr("y2", i)
                .attr("stroke", "#1e293b")
                .attr("stroke-width", 1);
        }
    }

    // Seismic Waves Animation
    if (isShaking) {
        const waveCount = Math.floor(magnitude * 1.5);
        const waveColor = magnitude > 6 ? "#ef4444" : "#f59e0b"; // Red or Amber

        for (let i = 0; i < waveCount; i++) {
            svg.append("circle")
                .attr("class", "waves")
                .attr("cx", (epicenter.x / 100) * width)
                .attr("cy", (epicenter.y / 100) * height)
                .attr("r", 0)
                .attr("fill", "none")
                .attr("stroke", waveColor)
                .attr("stroke-width", 2)
                .attr("opacity", 0.8)
                .transition()
                .delay(i * 300)
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("r", Math.min(width, height) * (magnitude / 5)) // Radius depends on magnitude
                .attr("opacity", 0)
                .remove();
        }
    }

    // Epicenter Marker
    const cx = (epicenter.x / 100) * width;
    const cy = (epicenter.y / 100) * height;

    svg.append("circle")
        .attr("class", "epicenter")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 8)
        .attr("fill", isShaking ? "#ef4444" : "#3b82f6") // Red if shaking, Blue otherwise
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer");

    // Click to move epicenter
    svg.on("click", (event) => {
        if (isShaking) return; // Lock during simulation
        const [x, y] = d3.pointer(event);
        const relX = (x / width) * 100;
        const relY = (y / height) * 100;
        onEpicenterChange({ x: relX, y: relY });
    });

  }, [epicenter, isShaking, magnitude]);

  return (
    <div ref={containerRef} className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg relative overflow-hidden group">
      <div className="absolute top-2 left-2 text-xs text-slate-500 font-mono pointer-events-none">
        SECTOR MAP VIEW - CLICK TO SET EPICENTER
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default SimulationMap;