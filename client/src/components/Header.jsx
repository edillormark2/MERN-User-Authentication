import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">Auth App</h1>
        </Link>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <Link to="/profile">
            {currentUser
              ? <div className="flex items-center">
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <p className="ml-2">
                    {currentUser.username}
                  </p>
                </div>
              : <li>Sign In</li>}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
