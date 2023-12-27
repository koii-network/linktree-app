// Login.js
import React, { useState } from "react";
import magic from "./magic";

const Login = () => {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    try {
      await magic.auth.loginWithMagicLink({ email });
      // Handle successful login
      console.log("Logged in");
    } catch (error) {
      // Handle errors
      console.error("Failed to log in", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
