"use client";

import React, { useEffect, useRef } from "react";

// --- Types ---
interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null; // Fixed x position during drag
  fy?: number | null; // Fixed y position during drag
}

interface Link {
  source: string;
  target: string;
}

// --- Physics Constants ---
const DAMPING = 0.85;
const REPULSION = 5000;
const SPRING_LEN = 150;
const STIFFNESS = 0.05;
const NODE_RADIUS = 12;

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
const nodes = useRef<Node[]>([
{ id: "Photovoltaic Arrays", x: 100, y: 100, vx: 0, vy: 0 },
  { id: "Wind Turbines", x: 100, y: 300, vx: 0, vy: 0 },
  { id: "Natural Gas Peaker Plants", x: 100, y: 500, vx: 0, vy: 0 },

  // Energy Storage & Conversion
  { id: "Lithium-Ion Battery BESS", x: 400, y: 200, vx: 0, vy: 0 },
  { id: "Green Hydrogen Electrolyzer", x: 400, y: 400, vx: 0, vy: 0 },

  // Distribution & Infrastructure
  { id: "High-Voltage Direct Current (HVDC) Lines", x: 700, y: 300, vx: 0, vy: 0 },
  { id: "Smart Grid Controller", x: 700, y: 100, vx: 0, vy: 0 },

  // Regulatory & Environmental Factors
  { id: "Carbon Credit Markets", x: 900, y: 200, vx: 0, vy: 0 },
  { id: "Intermittent Supply Volatility", x: 400, y: 50, vx: 0, vy: 0 }
  ]);

  const links = useRef<Link[]>([
{ source: "Photovoltaic Arrays", target: "Lithium-Ion Battery BESS" },
  { source: "Wind Turbines", target: "Green Hydrogen Electrolyzer" },

  // Infrastructure Connections
  { source: "Lithium-Ion Battery BESS", target: "Smart Grid Controller" },
  { source: "Green Hydrogen Electrolyzer", target: "High-Voltage Direct Current (HVDC) Lines" },
  { source: "Natural Gas Peaker Plants", target: "Smart Grid Controller" },

  // Impact & Regulation
  { source: "Intermittent Supply Volatility", target: "Lithium-Ion Battery BESS" },
  { source: "Photovoltaic Arrays", target: "Carbon Credit Markets" },
  { source: "Smart Grid Controller", target: "High-Voltage Direct Current (HVDC) Lines" },
  { source: "Natural Gas Peaker Plants", target: "Carbon Credit Markets" }
  ]);

  const draggedNode = useRef<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle High DPI displays
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;

    const updatePhysics = () => {
      const nodeList = nodes.current;
      const linkList = links.current;

      // 1. Repulsion (n^2)
      for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
          const nodeA = nodeList[i];
          const nodeB = nodeList[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy + 1; // Avoid divide by zero
          const dist = Math.sqrt(distSq);
          
          const force = REPULSION / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }


      
      // 2. Link Attraction (Springs)
      linkList.forEach((link) => {
        const source = nodeList.find((n) => n.id === link.source);
        const target = nodeList.find((n) => n.id === link.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const strength = (dist - SPRING_LEN) * STIFFNESS;

        const fx = (dx / dist) * strength;
        const fy = (dy / dist) * strength;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      });

      // 3. Update Positions
      nodeList.forEach((n) => {
        if (n.fx != null && n.fy != null) {
          // Dragging state
          n.x = n.fx;
          n.y = n.fy;
          n.vx = 0;
          n.vy = 0;
        } else {
          // Normal physics
          n.vx *= DAMPING;
          n.vy *= DAMPING;
          n.x += n.vx;
          n.y += n.vy;
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Draw Edges
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      links.current.forEach((l) => {
        const s = nodes.current.find((n) => n.id === l.source);
        const t = nodes.current.find((n) => n.id === l.target);
        if (!s || !t) return;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });

      // Draw Nodes
      nodes.current.forEach((n) => {
        const isDragging = draggedNode.current?.id === n.id;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = isDragging ? "#60a5fa" : "#2563eb";
        ctx.fill();
        
        // Node Text
        ctx.fillStyle = "#f8fafc";
        ctx.font = "12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(n.id, n.x, n.y - (NODE_RADIUS + 5));
      });
    };

    const loop = () => {
      updatePhysics();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- Input Logic ---
  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);
    // Find node under cursor
    const hit = nodes.current.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS * 2;
    });

    if (hit) {
      draggedNode.current = hit;
      hit.fx = x;
      hit.fy = y;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode.current) return;
    const { x, y } = getMousePos(e);
    draggedNode.current.fx = x;
    draggedNode.current.fy = y;
  };

  const handleMouseUp = () => {
    if (draggedNode.current) {
      draggedNode.current.fx = null;
      draggedNode.current.fy = null;
      draggedNode.current = null;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 p-8">
      <div className="mb-4 text-white text-center">
        <h2 className="text-xl font-bold">Knowledge Graph</h2>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full max-w-4xl max-h-[600px] bg-slate-950 rounded-2xl border border-slate-700 cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
}



export default () => {
    return (
        <div className='flex w-full h-screen bg-gray-100 items-center justify-center'>
            <div className='flex w-[900px] h-[600px] bg-white p-4 rounded-md items-center justify-center'>        
                <KnowledgeGraph />
            </div>
        </div>
    );
}