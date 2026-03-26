import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Events from "./Components/More/Events";
import Login from "./Components/Login,Signin/Login";
//import Signup from "./Components/Login,Signin/Signup";
import EventRegistration from "./Components/Home/EventRegistration";
import Admin from "./Components/Home/Admin";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login/>}/>
          {/* <Route path="/signup" element={<Signup/>}/> */}
<Route path="/event-registration" element={<EventRegistration/>}/>
<Route path="/admin" element={<Admin/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
