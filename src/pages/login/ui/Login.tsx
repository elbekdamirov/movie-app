import { memo, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginWrapper } from "@/features/auth";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login = memo(() => {
  const [scriptStatus, setScriptStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  if (!clientId) return <LoginWrapper scriptStatus="unavailable" />;

  return (
    <GoogleOAuthProvider
      clientId={clientId}
      onScriptLoadSuccess={() => setScriptStatus("ready")}
      onScriptLoadError={() => setScriptStatus("unavailable")}
    >
      <LoginWrapper scriptStatus={scriptStatus} />
    </GoogleOAuthProvider>
  );
});
