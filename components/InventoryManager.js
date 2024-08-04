import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button, Typography, TextField, Box } from "@mui/material";

const CapturePhoto = ({ addToInventory }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    setCapturedImage(image);
  };

  const handleAddToInventory = async () => {
    if (!capturedImage) return;

    try {
      const response = await axios.post("/api/detect-ingredients", {
        image: capturedImage,
      });
      const detectedIngredients = response.data.ingredients;

      // Add detected ingredients to inventory
      detectedIngredients.forEach(async (ingredientName) => {
        console.log("Adding to inventory:", {
          objectName: ingredientName,
          quantity,
        });

        await addDoc(collection(db, "inventory"), {
          objectName: ingredientName,
          quantity,
          timestamp: new Date(),
        });
      });

      setCapturedImage(null);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to inventory:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#2c2c2c", // Slightly lighter background for the component
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        color: "#ffffff", // White text
        transition: "all 0.3s ease", // Smooth transition
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center align content
        justifyContent: "center", // Center align content
        maxWidth: "400px", // Maximum width for better responsiveness
        margin: "0 auto", // Center the component
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Capture Photo
      </Typography>
      <video
        ref={videoRef}
        width="320"
        height="240"
        autoPlay
        style={{
          borderRadius: "8px",
          border: "2px solid #3f51b5", // Adding border for video
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Shadow for video
          marginBottom: "16px", // Space between video and button
        }}
      ></video>
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        className="hidden"
      ></canvas>
      <Button
        onClick={handleCapture}
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mb: 2,
          fontWeight: "bold",
          fontSize: "16px",
          "&:hover": {
            backgroundColor: "#357aeb", // Darker blue on hover
          },
        }} // Margin-bottom
      >
        Capture Photo
      </Button>
      {capturedImage && (
        <Box sx={{ textAlign: "center" }}>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "16px",
              border: "2px solid #3f51b5", // Adding border to the image
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Shadow for image
            }}
          />
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
              width: "80%",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3f51b5", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "#1e88e5", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1e88e5", // Focus border color
                },
              },
            }} // Margin-bottom and width
            InputProps={{
              style: { color: "white", backgroundColor: "#2c2c2c" },
            }}
          />
          <Button
            onClick={handleAddToInventory}
            variant="contained"
            color="success"
            fullWidth
            sx={{
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#45c48c", // Darker green on hover
              },
            }}
          >
            Add to Inventory
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CapturePhoto;
