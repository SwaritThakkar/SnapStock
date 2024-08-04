// pages/index.js
import React, { useEffect, useState, useRef } from "react";
import CapturePhoto from "../components/CapturePhoto";
import Inventory from "../components/Inventory";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { Container, Box } from "@mui/material";
import { useAuth } from "../components/AuthProvider";

const Home = () => {
  const { currentUser } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const canvasRef = useRef(null);
  const nodes = [];
  const numNodes = 100;
  const attractionRadius = 100;
  const repulsionRadius = 200;
  const [isMouseOver, setIsMouseOver] = useState(false); // State to track mouse activity

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
        radius: Math.random() * 5 + 3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGraph();
      requestAnimationFrame(animate);
    };

    const drawGraph = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = "rgba(30, 136, 229, 0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#1e88e5";
        ctx.fill();
        ctx.closePath();
      });
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setIsMouseOver(true); // Set mouse over state to true on mouse move

      nodes.forEach((node) => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < attractionRadius) {
          const force = (attractionRadius - distance) / attractionRadius;
          node.x += (dx / distance) * force;
          node.y += (dy / distance) * force;
        } else if (distance < repulsionRadius) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          node.x += (dx / distance) * force;
          node.y += (dy / distance) * force;
        }
      });
    };

    const handleMouseLeave = () => {
      setIsMouseOver(false); // Set mouse over state to false when mouse leaves the canvas
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave); // Add mouseleave event

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const inventoryRef = collection(db, "users", currentUser.uid, "inventory");
    const q = query(inventoryRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setInventory(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addToInventory = async (objectName, quantity) => {
    if (!currentUser) return;
    try {
      const inventoryRef = collection(
        db,
        "users",
        currentUser.uid,
        "inventory"
      );
      await addDoc(inventoryRef, { objectName, quantity });
    } catch (error) {
      console.error("Error adding item to inventory:", error);
    }
  };

  const handleItemAdded = (newItem) => {
    setInventory((prevItems) => [...prevItems, newItem]);
  };

  useEffect(() => {
    const fetchApiResults = async () => {
      const results = [
        { id: "1", name: "Result A" },
        { id: "2", name: "Result B" },
      ];
      setApiResults(results);
    };
    fetchApiResults();
  }, []);

  return (
    <>
      <Navbar />
      <Container
        maxWidth="lg"
        style={{
          minHeight: "100vh",
          backgroundColor: "#121212",
          color: "#bbdefb",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 10,
            left: -150,
            zIndex: 0,
            opacity: isMouseOver ? 1 : 0, // Change opacity based on mouse activity
            transition: "opacity 0.3s ease", // Smooth transition for opacity
          }}
        />
        <Box sx={{ width: "100%", mb: 4, zIndex: 0 }}>
          <CapturePhoto
            addToInventory={addToInventory}
            onItemAdded={handleItemAdded}
          />
          
          {currentUser && (
            <Inventory items={inventory} apiResults={apiResults} />
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
