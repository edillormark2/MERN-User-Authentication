import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import { useStateContext } from "./redux/ContextProvider";

const customToastStyle = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored"
};

const App = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="dark:bg-secondary-dark-bg  ">
        <BrowserRouter>
          <ToastContainer {...customToastStyle} />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Footer />
      </div>
    </div>
  );
};

export default App;
