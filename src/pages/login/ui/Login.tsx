import { memo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginWrapper } from "@/features/auth";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login = memo(() => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginWrapper />
    </GoogleOAuthProvider>
  );
});
