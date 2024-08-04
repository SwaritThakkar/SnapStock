import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button, Typography, TextField, Box } from "@mui/material";
import { auth } from "../firebase"; // Import auth to access user ID

const subscriptionKey = "79892cfe82f0486a9e571b26140613a1";

const CapturePhoto = ({ onItemAdded }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [itemDescription, setItemDescription] = useState("");
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

    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedImage(blob);
        }
      }, "image/png");
    } else {
      console.error("Canvas or video reference is null");
    }
  };

  const handleAddToInventory = async () => {
    if (!capturedImage || !itemDescription) return;

    try {
      // Get the current user's ID
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      // Create a new item with the detected description and user ID
      const newItem = {
        objectName: itemDescription, // Use the detected description
        quantity,
        userId, // Add user ID here
        timestamp: new Date(),
      };

      // Add the new item to Firestore
      await addDoc(collection(db, "users", userId, "inventory"), newItem);

      // Notify the parent component about the new item
      onItemAdded(newItem); // Pass the new item to the parent component

      setCapturedImage(null);
      setQuantity(1);
      setItemDescription("");
      console.log("Item added to inventory successfully:", newItem.objectName);
    } catch (error) {
      console.error("Error adding to inventory:", error);
    }
  };


  const handleAnalyzeImage = async () => {
    if (!capturedImage) return;

    try {
      const response = await fetch(
        "https://image-intellect-ai.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Categories,Description,Color",
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "Content-Type": "application/octet-stream",
          },
          body: capturedImage,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText);
        throw new Error("Failed to detect items");
      }

      const result = await response.json();

      if (result.description && result.description.captions.length > 0) {
        const detectedDescription = result.description.captions[0].text; // Get the first caption
        setItemDescription(detectedDescription); // Set the description to the detected item
      } else {
        console.warn("No items detected in the image.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  useEffect(() => {
    if (capturedImage) {
      handleAnalyzeImage(); // Analyze the image once it's captured
    }
  }, [capturedImage]);

  return (
    <Box
      sx={{
        bgcolor: "#2c2c2c",
        p: 4,
        borderRadius: 2,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        color: "#ffffff",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
        "&:hover": {
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.7), 0 15px 30px rgba(0, 0, 0, 0.5)",
          transform: "scale(1.02)",
        },
      }}
    >
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{ textShadow: "1px 1px 5px rgba(0, 0, 0, 0.8)" }}
      >
        AI Item Manager
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#1e1e1e",
            p: 2,
            borderRadius: 5,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            flexGrow: 1,
            marginRight: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow:
                "0 0 20px rgba(255, 255, 255, 0.7), 0 10px 20px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <video
            ref={videoRef}
            width="320"
            height="240"
            autoPlay
            style={{
              borderRadius: "8px",
              border: "2px solid #3f51b5",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              marginBottom: "16px",
              transition: "transform 0.3s ease",
            }}
          ></video>
          <Button
            onClick={handleCapture}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background-color 0.3s, box-shadow 0.3s",
              "&:hover": {
                backgroundColor: "#357aeb",
                boxShadow: "0 0 20px rgba(53, 122, 235, 0.5)",
              },
            }}
          >
            SNAP NOW!
          </Button>
        </Box>

        {capturedImage && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#1e1e1e",
              p: 2,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              flexGrow: 1,
              marginLeft: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow:
                  "0 0 20px rgba(255, 255, 255, 0.7), 0 10px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "2px solid #3f51b5",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
            />
            <TextField
              label="Description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                width: "80%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#3f51b5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1e88e5",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1e88e5",
                  },
                },
              }}
              InputProps={{
                style: { color: "white", backgroundColor: "#2c2c2c" },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Button
                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                variant="outlined"
                color="primary"
                sx={{ mr: 1 }}
              >
                -
              </Button>
              <Typography variant="body1" sx={{ color: "white" }}>
                Quantity: {quantity}
              </Typography>
              <Button
                onClick={() => setQuantity(quantity + 1)}
                variant="outlined"
                color="primary"
                sx={{ ml: 1 }}
              >
                +
              </Button>
            </Box>
            <Button
              onClick={handleAddToInventory}
              variant="contained"
              color="success"
              fullWidth
              sx={{
                fontWeight: "bold",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#45c48c",
                  boxShadow: "0 0 20px rgba(69, 196, 140, 0.5)",
                },
              }}
            >
              Add to Inventory
            </Button>
          </Box>
        )}
      </Box>
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: "none" }} // Hide the canvas element
      ></canvas>
    </Box>
  );
};

export default CapturePhoto;
