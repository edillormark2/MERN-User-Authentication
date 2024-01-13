import React from "react";
import { useNavigate } from "react-router-dom";
import { BiError } from "react-icons/bi";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back in the history
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-20">
      <div className="text-9xl dark:text-gray-200 mb-4">
        <BiError />
      </div>
      <div className="text-4xl dark:text-gray-200 mb-4 font-semibold">
        404 Error
      </div>
      <p className="text-md dark:text-gray-200">
        Oops! We can't find this page.
      </p>
      <button
        className="mt-8 px-4 py-2 text-white text-sm bg-blue-500 rounded-full hover:bg-blue-700"
        onClick={goBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
