import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      try {
        const data = JSON.parse(storedAuthData);
        setUser({ username: data.username, email: data.email, _id: data._id });
        setToken(data.token);
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("authData");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    const userData = { 
      username: data.username, 
      email: data.email, 
      _id: data._id || data.user?._id 
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem("authData", JSON.stringify({ ...data, ...userData }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authData");
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
