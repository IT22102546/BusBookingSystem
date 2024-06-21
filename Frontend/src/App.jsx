import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Search from "./pages/Search";
import DashBoard from "./pages/DashBoard";
import PrivateRoute from "./components/PrivateRoute";
import DashBus from "./components/DashBus";
import AddBus from "./pages/AddBus";

function App() {
  const location = useLocation();
  const hideHeaderPaths = ["/signin", "/signup"];

  return (
    <div>
      {!hideHeaderPaths.includes(location.pathname.toLowerCase()) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }/>

        
        <Route path="/dashbus" element={
          <PrivateRoute>
            <DashBus/>
          </PrivateRoute>
        }/>

        <Route path="/addbus" element={
          <PrivateRoute>
            <AddBus/>
          </PrivateRoute>
        }/>

      </Routes>
      
    </div>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
