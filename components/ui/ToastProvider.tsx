"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#FFFFFF",
          color: "#1C1C1A",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRadius: "12px",
          padding: "16px",
          fontFamily: "var(--font-inter)",
        },
        success: {
          iconTheme: {
            primary: "#4A7C59",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#C94040",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}
