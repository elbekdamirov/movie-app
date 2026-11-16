import { memo, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineBookmark } from "react-icons/hi2";
import type { AppDispatch, RootState } from "@/app/store";
import { setUser, type UserProfile } from "../model/authSlice";

type LoginStatus = "loading" | "ready" | "unavailable";

export const LoginWrapper = memo(({ scriptStatus }: { scriptStatus: LoginStatus }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [failed, setFailed] = useState(false);

  const handleSuccess = ({ credential }: CredentialResponse) => {
    setFailed(false);
    try {
      if (!credential) throw new Error("Missing Google credential");
      const { name, email, picture, exp } = jwtDecode<UserProfile & JwtPayload>(credential);
      dispatch(setUser({ name, email, picture, expiresAt: exp }));
      navigate("/my-list", { replace: true });
    } catch {
      setFailed(true);
    }
  };

  return (
    <section className="container login-page">
      <div className="login-card">
        <div className="login-icon"><HiOutlineBookmark aria-hidden="true" /></div>
        <h1>{t(user ? "auth.account" : "auth.title")}</h1>
        <p className="muted mt-3">
          {user
            ? user.email || user.name
            : t("auth.localDescription")}
        </p>

        <div className="login-controls">
          {user ? (
            <Link to="/my-list" className="action action-primary">{t("auth.viewMyList")}</Link>
          ) : scriptStatus === "loading" ? (
            <p className="muted text-sm" role="status">{t("auth.loading")}</p>
          ) : scriptStatus === "unavailable" ? (
            <p className="muted text-sm" role="alert">{t("auth.unavailable")}</p>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setFailed(true)}
              text="continue_with"
              size="large"
              shape="pill"
              logo_alignment="left"
              locale={i18n.resolvedLanguage}
              width={240}
            />
          )}
        </div>
        {failed && <p className="mt-4 text-sm" role="alert">{t("auth.failed")}</p>}
        {!user && <Link className="section-link mt-6" to="/">{t("auth.continueBrowsing")}</Link>}
      </div>
    </section>
  );
});
