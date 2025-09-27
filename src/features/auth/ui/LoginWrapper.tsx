import { memo } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../model/authSlice";

export const LoginWrapper = memo(() => {
  const dispatch = useDispatch();
  return (
    <div className="max-w-[400px] w-full mx-auto min-h-[70vh]">
      <div>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const payload = jwtDecode(credentialResponse.credential as string);
            dispatch(setUser(payload));
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
});
