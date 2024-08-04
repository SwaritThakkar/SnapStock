// components/Navbar.js
import React from "react";
import { useAuth } from "../components/AuthProvider";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "black", // Match background color with CapturePhoto
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", // Softer shadow for less boxy effect
        transition: "all 0.3s ease",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // Add subtle bottom border for depth
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px", // Add padding for spacing
        }}
      >
        <Typography
          variant="h2"
          p="5px"
          sx={{
            flexGrow: 1,
            color: "#ffffff", // White text color
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)", // Less intense text shadow
            letterSpacing: "1px", // Add slight letter spacing
            fontWeight: "bold", // Make the title bold
          }}
        >
          SnapStock
        </Typography>
        {currentUser && (
          <>
            <Typography
              sx={{
                marginRight: 2,
                variant : 'h3',
                color: "#ffffff", // White text color
              }}
            >
              {currentUser.email}
            </Typography>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                bgcolor: "#3f51b5", // Corrected background color for the button
                border: "none", // Remove border for a cleaner look
                color: "#ffffff", // White text color
                borderRadius: "20px", // Rounded corners for a softer appearance
                padding: "8px 16px", // Add padding for better button size
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  bgcolor: "#1e88e5", // Change to a lighter blue on hover
                  boxShadow: "0 0 10px rgba(63, 81, 181, 0.7)", // Glow effect on hover
                },
                "&:active": {
                  boxShadow: "0 0 20px rgba(63, 81, 181, 1)", // Stronger glow when active
                },
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
