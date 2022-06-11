import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expiresIn) => {
  const curTime = new Date().getTime();
  const expiresTime = new Date(curTime + expiresIn * 1000);
  return expiresTime - curTime;
};

export const AuthContextProvider = (props) => {
  const initialState = localStorage.getItem("token");
  const [token, setToken] = useState(initialState);

  const userIsLoggedIn = !!token; // return true if token is a string, false if token is null

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const loginHandler = (token, expiresIn) => {
    localStorage.setItem("token", token);
    setToken(token);

    const remainingTime = calculateRemainingTime(expiresIn);
    setTimeout(logoutHandler, remainingTime);
  };

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
