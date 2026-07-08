import { Toaster } from "react-hot-toast";

function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 3500,
        style: {
          minWidth: "300px",
          padding: "16px 18px",
          borderRadius: "14px",
          background: "#ffffff",
          color: "#172033",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 12px 35px rgba(15, 23, 42, 0.18)",
        },

        success: {
          style: {
            borderLeft: "5px solid #16a34a",
          },
          iconTheme: {
            primary: "#16a34a",
            secondary: "#ffffff",
          },
        },

        error: {
          duration: 4500,
          style: {
            borderLeft: "5px solid #dc2626",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },

        loading: {
          style: {
            borderLeft: "5px solid #0284c7",
          },
        },
      }}
    />
  );
}

export default AppToaster;