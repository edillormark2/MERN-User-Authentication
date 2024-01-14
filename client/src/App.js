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
import AuthRedirect from "./components/AuthRedirect";
import NotFound from "./components/NotFound";
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
    <div className={`App ${currentMode === "Dark" ? "dark" : ""}`}>
      <BrowserRouter>
        <ToastContainer {...customToastStyle} />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-100 dark:bg-main-dark-bg">
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route
                path="/sign-up"
                element={<AuthRedirect element={<SignUp />} />}
              />
              <Route
                path="/sign-in"
                element={<AuthRedirect element={<SignIn />} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
