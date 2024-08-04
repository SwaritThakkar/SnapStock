import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove"; // Import RemoveIcon for the minus option
import { useAuth } from "../components/AuthProvider"; // Import useAuth to get current user

const Inventory = ({ removeFromInventory, onItemAdded, apiResults = [] }) => {
  const { currentUser } = useAuth(); // Get the current user
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return; // Exit if no user is logged in

    const inventoryRef = collection(db, "users", currentUser.uid, "inventory"); // Reference to the user's inventory
    const q = query(inventoryRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryItems = [];
      querySnapshot.forEach((doc) => {
        inventoryItems.push({ id: doc.id, ...doc.data() });
      });
      setItems(inventoryItems);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddItem = async () => {
    if (!itemName || itemQuantity < 1) {
      setError("Please enter a valid item name and quantity.");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "users", currentUser.uid, "inventory"),
        {
          objectName: itemName,
          quantity: itemQuantity,
          userId: currentUser.uid, // Add userId here
          timestamp: new Date(),
        }
      );

      console.log("Document written with ID: ", docRef.id);

      // Notify the parent component of the new item
      if (onItemAdded) {
        onItemAdded({
          id: docRef.id,
          objectName: itemName,
          quantity: itemQuantity,
          userId: currentUser.uid, // Include userId in the callback if needed
        });
      }

      setItemName("");
      setItemQuantity(1);
      setError("");
    } catch (error) {
      console.error("Error adding item to inventory:", error);
      setError("Error adding item to inventory.");
    }
  };

  const handleAddMore = async (id, currentQuantity) => {
    try {
      const itemDoc = doc(db, "users", currentUser.uid, "inventory", id);
      await updateDoc(itemDoc, {
        quantity: currentQuantity + 1,
      });
      console.log("Quantity updated for ID: ", id);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleRemoveOne = async (id, currentQuantity) => {
    if (currentQuantity > 1) {
      try {
        const itemDoc = doc(db, "users", currentUser.uid, "inventory", id);
        await updateDoc(itemDoc, {
          quantity: currentQuantity - 1,
        });
        console.log("Quantity decreased for ID: ", id);
      } catch (error) {
        console.error("Error updating item quantity:", error);
      }
    } else {
      // If quantity is 1, remove the item from inventory
      handleRemoveItem(id);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "inventory", id));
      console.log("Document deleted with ID: ", id);
      if (removeFromInventory) {
        removeFromInventory(id);
      }
    } catch (error) {
      console.error("Error removing item from inventory:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        zindex: +10,
        p: 4,
        width: "70%",
        borderRadius: 2,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        mt: 6,
        color: "#ffffff",
        transition: "all 0.3s ease",
        maxWidth: "90vw",
        margin: "0 auto",
        "&:hover": {
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.7), 0 15px 30px rgba(0, 0, 0, 0.5)",
          transform: "scale(1.02)",
        },
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.8)",
          transition: "color 0.3s ease",
          "&:hover": {
            color: "#ffeb3b",
          },
        }}
      >
        Inventory
      </Typography>
      {error && (
        <Typography
          color="error"
          sx={{
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#ff1744",
            },
          }}
        >
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          label="Item Name"
          variant="outlined"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          sx={{
            mr: 1,
            flexGrow: 1,
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
            "& .MuiInputLabel-root": {
              color: "#ffffff",
              "&.Mui-focused": {
                color: "#1e88e5",
              },
            },
          }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2c2c2c",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            },
          }}
        />
        <TextField
          type="number"
          label="Quantity"
          variant="outlined"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number(e.target.value))}
          min="1"
          sx={{
            mr: 1,
            width: "120px",
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
            "& .MuiInputLabel-root": {
              color: "#ffffff",
              "&.Mui-focused": {
                color: "#1e88e5",
              },
            },
          }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2c2c2c",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            },
          }}
        />
        <Button
          onClick={handleAddItem}
          variant="contained"
          color="success"
          sx={{
            fontWeight: "bold",
            transition: "background-color 0.3s, box-shadow 0.3s",
            "&:hover": {
              backgroundColor: "#45c48c",
              boxShadow: "0 0 20px rgba(69, 196, 140, 0.5)",
            },
          }}
        >
          Add Item
        </Button>
      </Box>
      {items.length === 0 ? (
        <Typography
          sx={{
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.8)",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#ffeb3b",
            },
          }}
        >
          No items in inventory
        </Typography>
      ) : (
        <List>
          {items.map((item) => {
            const apiResult = apiResults.find(
              (result) => result.id === item.id
            );
            return (
              <ListItem
                key={item.id}
                sx={{
                  bgcolor: "#2c2c2c",
                  mb: 1,
                  borderRadius: 1,
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                  "&:hover": {
                    bgcolor: "#3f51b5",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <ListItemText
                  primary={`${item.objectName} - Quantity: ${item.quantity}${
                    apiResult ? ` - API Result: ${apiResult.name}` : ""
                  }`}
                  sx={{
                    color: "#ffffff",
                    textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#ffeb3b",
                    },
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => handleRemoveOne(item.id, item.quantity)} // Call handleRemoveOne instead of handleAddMore
                    sx={{
                      color: "#ffffff",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "#ff1744",
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={() => handleAddMore(item.id, item.quantity)}
                    sx={{
                      color: "#ffffff",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "#45c48c",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{
                      color: "#ffffff",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "#ff1744",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Inventory;
