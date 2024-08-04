// pages/auth.js
import React, { useEffect, useRef } from "react";
import Auth from "../components/Auth"; // Ensure the path is correct

const AuthPage = () => {
  const canvasRef = useRef(null);
  const nodes = [];
  const numNodes = 100; // Increased number of nodes
  const attractionRadius = 100; // Radius within which nodes are attracted to the mouse
  const repulsionRadius = 200; // Radius within which nodes are repelled

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize nodes with random positions
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 3, // Smaller radius for nodes
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGraph();
      requestAnimationFrame(animate);
    };

    const drawGraph = () => {
      // Draw lines between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Draw line if nodes are close enough
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = "rgba(30, 136, 229, 0.5)"; // Line color
            ctx.lineWidth = 1; // Line width
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      // Draw each node
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#1e88e5"; // Node color
        ctx.fill();
        ctx.closePath();
      });
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      nodes.forEach((node) => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If within attraction radius, move towards the mouse
        if (distance < attractionRadius) {
          const force = (attractionRadius - distance) / attractionRadius; // Attraction force
          node.x += (dx / distance) * force; // Move towards mouse
          node.y += (dy / distance) * force;
        }
        // If within repulsion radius, move away from the mouse
        else if (distance < repulsionRadius) {
          const force = (repulsionRadius - distance) / repulsionRadius; // Repulsion force
          node.x += (dx / distance) * force; // Move away from mouse
          node.y += (dy / distance) * force;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Auth />
      </div>
    </div>
  );
};

export default AuthPage;
