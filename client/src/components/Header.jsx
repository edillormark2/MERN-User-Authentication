import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiSun, FiMoon } from "react-icons/fi";
import { useStateContext } from "../redux/ContextProvider";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [menuClicked, setMenuClicked] = useState(""); // State for active menu
  const { setMode, currentMode } = useStateContext();

  const handleMenuClick = (menu) => {
    setMenuClicked(menu);
  };

  const toggleTheme = () => {
    setMode({ target: { value: currentMode === "Light" ? "Dark" : "Light" } });
  };

  return (
    <div
      className={`bg-white drop-shadow-xl ${
        currentMode === "Dark" ? "dark:bg-secondary-dark-bg dark:text-gray-200" : ""
      }`}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <h1 className="font-bold text-sm sm:text-sm xl:text-lg hidden md:block">
          Auth App
        </h1>

        <ul className="flex gap-4 items-center ml-auto">
          {currentUser && (
            <>
              <Link to="/" onClick={() => handleMenuClick("home")}>
                <li
                  className={`dark:hover:text-black ${menuClicked === "home"
                    ? "bg-gray-300 dark:text-gray-800"
                    : "hover:bg-gray-200"} p-2 sm:p-3 rounded-full text-sm sm:text-base`}
                >
                  Home
                </li>
              </Link>
              <Link to="/about" onClick={() => handleMenuClick("about")}>
                <li
                  className={`dark:hover:text-black ${menuClicked === "about"
                    ? "bg-gray-300 dark:text-gray-800"
                    : "hover:bg-gray-200"} p-2 sm:p-3 rounded-full text-sm sm:text-base`}
                >
                  About
                </li>
              </Link>
            </>
          )}

          <Link to="/profile">
            {currentUser ? (
              <div
                className={`flex items-center dark:hover:text-black ${menuClicked === "profile"
                  ? "bg-gray-300 dark:text-gray-800"
                  : "hover:bg-gray-200"} p-1 sm:p-2 rounded-full text-sm sm:text-base`}
                onClick={() => handleMenuClick("profile")}
              >
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="ml-2 hidden md:block">{currentUser.username}</p>
              </div>
            ) : (
              <li
                className={`dark:hover:text-black ${menuClicked === "signin"
                  ? "bg-gray-300 dark:text-gray-800"
                  : "hover:bg-gray-200"} p-2 sm:p-3 rounded-full text-sm sm:text-base`}
                onClick={() => handleMenuClick("signin")}
              >
                Sign In
              </li>
            )}
          </Link>
          <div
            className={`flex items-center cursor-pointer bg-gray-200 p-2 rounded-xl dark:text-black`}
            onClick={toggleTheme}
          >
            {currentMode === "Dark" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
