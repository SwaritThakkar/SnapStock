// components/Auth.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        p: 4,
        borderRadius: 2,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        mt: 6,
        color: "#ffffff",
        transition: "all 0.3s ease",
        maxWidth: "600px",
        margin: "0 auto",
        "&:hover": {
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.7), 0 15px 30px rgba(0, 0, 0, 0.5)",
          transform: "scale(1.02)",
        },
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.8)",
          transition: "color 0.3s ease",
          "&:hover": {
            color: "#ffeb3b",
          },
        }}
      >
        {tab === 0 ? "Sign In" : "Sign Up"}
      </Typography>

      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "#2c2c2c",
          mb: 2,
          borderRadius: 1,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary">
          <Tab label="Sign In" sx={{ color: "#ffffff" }} />
          <Tab label="Sign Up" sx={{ color: "#ffffff" }} />
        </Tabs>
      </Paper>

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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
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
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
          }}
          InputProps={{
            style: {
              backgroundColor: "#2c2c2c",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              },
            },
          }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
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
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
          }}
          InputProps={{
            style: {
              backgroundColor: "#2c2c2c",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              },
            },
          }}
        />

        {tab === 1 && (
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
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
              "& .MuiInputBase-input": {
                color: "#ffffff",
              },
            }}
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                },
              },
            }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={tab === 0 ? handleSignIn : handleSignUp}
          sx={{
            bgcolor: "#3f51b5",
            "&:hover": {
              bgcolor: "#1e88e5",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {tab === 0 ? "Sign In" : "Sign Up"}
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;
