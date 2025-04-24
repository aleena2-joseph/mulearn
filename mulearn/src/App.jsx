import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "../src/Components/Login,Signin/Login";
import SignUp from "./Components/Login,Signin/Signup";
import ForgotPassword from "./Components/Login,Signin/ForgotPassword";
import UserDashboard from "./Components/Dashboard/UserDashboard";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
