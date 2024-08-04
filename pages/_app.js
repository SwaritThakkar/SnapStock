import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Auth from "../components/Auth";
import { AuthProvider, useAuth } from "../components/AuthProvider"; // Import AuthProvider
import theme from "../components/src/theme"; // Adjusted path to your theme

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && router.pathname !== "/auth") {
      router.push("/auth");
    }
  }, [currentUser, router]);

  if (!currentUser && router.pathname !== "/auth") {
    return <Auth />;
  }

  return <>{children}</>;
};

export default MyApp;
