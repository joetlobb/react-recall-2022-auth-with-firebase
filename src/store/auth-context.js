import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token, expiresIn) => {},
  logout: () => {},
});

const calculateRemainingTime = (expiresTime) => {
  const curTime = new Date().getTime();
  const expirationTime = new Date(expiresTime);
  const remainingDuration = expirationTime - curTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationData = localStorage.getItem("expirationTime");

  const remainingDuration = calculateRemainingTime(storedExpirationData);

  if (remainingDuration < 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return { token: storedToken, duration: remainingDuration };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  //   const tokenData = null;
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // return true if token is a string, false if token is null

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    setToken(null);

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiresIn) => {
    setToken(token);
    localStorage.setItem("token", token);
    const expirationTime = new Date(new Date().getTime() + +expiresIn * 1000);
    localStorage.setItem("expirationTime", expirationTime.toISOString());

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
