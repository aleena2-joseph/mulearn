// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./Components/Home/Home";
// import Events from "./Components/More/Events";
// import Login from "./Components/Login,Signin/Login";
// //import Signup from "./Components/Login,Signin/Signup";
// import EventRegistration from "./Components/Home/EventRegistration";
// import Admin from "./Components/Home/Admin";

// const App = () => {
//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/login" element={<Login/>}/>
//           {/* <Route path="/signup" element={<Signup/>}/> */}
// <Route path="/event-registration" element={<EventRegistration/>}/>
// <Route path="/admin" element={<Admin/>}/>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// };

// export default App;
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home/Home";
import Events from "./Components/More/Events";
import Login from "./Components/Login,Signin/Login";
import EventRegistration from "./Components/Home/EventRegistration";
import Admin from "./Components/Home/Admin";
import { Navigate } from "react-router-dom";

function AppRoutes() {
  const navigate = useNavigate();

useEffect(() => {
  const handleKeyDown = (e) => {
    if (
      e.ctrlKey &&
      e.shiftKey &&
      e.key.toLowerCase() === "a"
    ) {
      sessionStorage.setItem("adminAccess", "true");
      navigate("/login");
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
    <Route
  path="/login"
  element={
    sessionStorage.getItem("adminAccess")
      ? <Login />
      : <Navigate to="/" replace />
  }
/>
      <Route path="/event-registration" element={<EventRegistration />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;