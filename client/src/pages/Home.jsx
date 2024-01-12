import React from "react";
import { useStateContext } from "../redux/ContextProvider";

export default function Home() {
  const { currentMode } = useStateContext();
  return (
    <div className="px-4 py-12 max-w-2xl mx-auto ">
      <h1 className="text-xl sm:text-3xl font-bold  mb-4 text-slate-800">
        Welcome to my Auth App!
      </h1>
      <div className="bg-gray-50 dark:bg-secondary-dark-bg drop-shadow-lg p-4 rounded-lg">
        <p className="mt-2 m-2 text-slate-700 text-sm sm:text-base">
          This is a full-stack web application built with the MERN (MongoDB,
          Express, React, Node.js) stack. It includes authentication features
          that allow users to sign up, log in, and log out, and provides access
          to protected routes only for authenticated users.
        </p>
        <p className="mt-4 text-slate-700 text-sm sm:text-base">
          The front-end of the application is built with React and uses React
          Router for client-side routing. The back-end is built with Node.js and
          Express, and uses MongoDB as the database. Authentication is
          implemented using JSON Web Tokens (JWT).
        </p>
        <p className="mt-4 text-slate-700 text-sm sm:text-base">
          This application is intended as a starting point for building
          full-stack web applications with authentication using the MERN stack.
          Feel free to use it as a template for your own projects!
        </p>
      </div>
    </div>
  );
}
