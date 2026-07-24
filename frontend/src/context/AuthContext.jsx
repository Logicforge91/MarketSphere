import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getStored } from "../utils/storage";

const AUTH_KEY = "marketsphere:auth-session";
const DEVICES_KEY = "marketsphere:auth-devices";

const AuthContext = createContext(null);

function createId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || Date.now()}`;
}

function currentDevice() {
  return {
    browser: navigator.userAgent.includes("Edg") ? "Microsoft Edge" : navigator.userAgent.includes("Chrome") ? "Google Chrome" : "Web browser",
    current: true,
    id: createId("device"),
    lastActive: new Date().toISOString(),
    location: "India",
    platform: navigator.platform || "Unknown device",
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStored(AUTH_KEY, null));
  const [devices, setDevices] = useState(() => getStored(DEVICES_KEY, []));
  const [challenge, setChallenge] = useState(null);

  const persistSession = useCallback((nextSession) => {
    setSession(nextSession);
    if (nextSession) window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextSession));
    else window.localStorage.removeItem(AUTH_KEY);
  }, []);

  const createSession = useCallback((user) => {
    const nextSession = {
      accessToken: createId("demo-token"),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      user,
    };
    const device = currentDevice();
    const nextDevices = [device, ...devices.map((item) => ({ ...item, current: false }))].slice(0, 5);
    setDevices(nextDevices);
    window.localStorage.setItem(DEVICES_KEY, JSON.stringify(nextDevices));
    persistSession(nextSession);
    return nextSession;
  }, [devices, persistSession]);

  const loginWithPassword = useCallback(({ identifier }) => {
    const isEmail = identifier.includes("@");
    return createSession({
      email: isEmail ? identifier : "customer@marketsphere.in",
      emailVerified: isEmail,
      id: createId("customer"),
      mobile: isEmail ? "+91 98765 43210" : identifier,
      mobileVerified: !isEmail,
      name: isEmail ? identifier.split("@")[0] : "MarketSphere Customer",
      twoFactorEnabled: false,
    });
  }, [createSession]);

  const register = useCallback((details) => {
    const pendingUser = {
      email: details.email,
      emailVerified: false,
      id: createId("customer"),
      mobile: details.mobile,
      mobileVerified: false,
      name: details.name,
      twoFactorEnabled: false,
    };
    setChallenge({ destination: details.email, purpose: "email-verification", user: pendingUser });
    return pendingUser;
  }, []);

  const requestOtp = useCallback((destination, purpose = "login") => {
    setChallenge({ destination, purpose });
    return true;
  }, []);

  const verifyChallenge = useCallback((code) => {
    if (!challenge || !/^\d{6}$/.test(code)) return false;
    if (challenge.purpose === "login") {
      loginWithPassword({ identifier: challenge.destination });
    } else if (challenge.user) {
      createSession({
        ...challenge.user,
        emailVerified: challenge.purpose === "email-verification" || challenge.user.emailVerified,
        mobileVerified: challenge.purpose === "mobile-verification" || challenge.user.mobileVerified,
      });
    }
    setChallenge(null);
    return true;
  }, [challenge, createSession, loginWithPassword]);

  const socialLogin = useCallback((provider) => createSession({
    email: `customer@${provider.toLowerCase()}.example`,
    emailVerified: true,
    id: createId("customer"),
    mobile: "",
    mobileVerified: false,
    name: `${provider} Customer`,
    twoFactorEnabled: false,
  }), [createSession]);

  const logout = useCallback(() => persistSession(null), [persistSession]);

  const revokeDevice = useCallback((id) => {
    const nextDevices = devices.filter((device) => device.id !== id);
    setDevices(nextDevices);
    window.localStorage.setItem(DEVICES_KEY, JSON.stringify(nextDevices));
  }, [devices]);

  const logoutOtherDevices = useCallback(() => {
    const nextDevices = devices.filter((device) => device.current);
    setDevices(nextDevices);
    window.localStorage.setItem(DEVICES_KEY, JSON.stringify(nextDevices));
  }, [devices]);

  const setTwoFactor = useCallback((enabled) => {
    if (!session) return;
    persistSession({ ...session, user: { ...session.user, twoFactorEnabled: enabled } });
  }, [persistSession, session]);

  const updateProfile = useCallback((updates) => {
    if (!session) return false;
    persistSession({ ...session, user: { ...session.user, ...updates, updatedAt: new Date().toISOString() } });
    return true;
  }, [persistSession, session]);

  const changePassword = useCallback(({ currentPassword, newPassword }) => {
    if (!session || !currentPassword || newPassword.length < 8) return false;
    persistSession({ ...session, user: { ...session.user, passwordChangedAt: new Date().toISOString() } });
    return true;
  }, [persistSession, session]);

  const deleteAccount = useCallback(() => {
    persistSession(null);
    setDevices([]);
    window.localStorage.removeItem(DEVICES_KEY);
    ["marketsphere:cart", "marketsphere:wishlist", "marketsphere:orders"].forEach((key) => window.localStorage.removeItem(key));
  }, [persistSession]);

  const value = useMemo(() => ({
    challenge,
    changePassword,
    deleteAccount,
    devices,
    isAuthenticated: Boolean(session && session.expiresAt > Date.now()),
    loginWithPassword,
    logout,
    logoutOtherDevices,
    register,
    requestOtp,
    revokeDevice,
    session,
    setTwoFactor,
    socialLogin,
    updateProfile,
    user: session?.user || null,
    verifyChallenge,
  }), [challenge, changePassword, deleteAccount, devices, loginWithPassword, logout, logoutOtherDevices, register, requestOtp, revokeDevice, session, setTwoFactor, socialLogin, updateProfile, verifyChallenge]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
