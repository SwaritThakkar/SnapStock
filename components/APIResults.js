// src/components/APIResults.js

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useAuth } from "../components/AuthProvider"; // Import useAuth to get current user

const APIResults = () => {
  const { currentUser } = useAuth(); // Get the current user
  const [apiResults, setApiResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return; // Exit if no user is logged in

    const apiResultsRef = collection(
      db,
      "users",
      currentUser.uid,
      "apiResults"
    ); // Reference to the user's API results
    const q = query(apiResultsRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setApiResults(results);
      },
      (error) => {
        console.error("Error fetching API results:", error);
        setError("Failed to fetch API results.");
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        p: 4,
        borderRadius: 2,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        mt: 6,
        color: "#ffffff",
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      <Typography variant="h3" align="center" gutterBottom>
        API Results
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {apiResults.map((result) => (
          <ListItem key={result.id}>
            <ListItemText
              primary={result.name} // Adjust based on your API data structure
              secondary={`Quantity: ${result.quantity}`} // Adjust as needed
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default APIResults;
