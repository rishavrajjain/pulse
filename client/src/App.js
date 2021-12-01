import React from "react"
import "style.css"
import "tailwindcss/dist/base.css";
import { BrowserRouter as Router,Route,Switch } from "react-router-dom";
import Login from "pages/Login";
import Signup from "pages/Signup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "routing/PrivateRoute";
import Dashboard from "pages/Dashboard";
import Home from "pages/Home";
import Navbar from "components/layout/Navbar";

function App() {
  return (
    
    <Router>
      <ToastContainer />
      
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
        
      
      </Switch>
      </Router>
  )
}

export default App