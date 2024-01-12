import React from "react";
import { useStateContext } from "../redux/ContextProvider";

export default function Home() {
  const { currentMode } = useStateContext();
  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="dark:text-gray-200 text-xl sm:text-3xl font-bold mb-4 text-slate-800">
        About
      </h1>
      <div className="bg-gray-50 dark:bg-secondary-dark-bg drop-shadow-lg p-4 rounded-lg">
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Welcome to my personal web project! This application is a result of my
          passion for creating user-friendly web experiences.
        </p>
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Using the MERN (MongoDB, Express, React, Node.js) stack, I've crafted
          a simple yet powerful platform. It allows easy sign-up, log-in, and
          log-out, emphasizing a smooth and responsive user interface. With
          React on the front-end and efficient client-side routing, navigation
          is a breeze.
        </p>
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Behind the scenes, Node.js, Express, and MongoDB work together to
          ensure secure data handling. User authentication is implemented with
          JSON Web Tokens (JWT) for an extra layer of protection. This project
          is a reflection of my dedication to making web development accessible.
          Feel free to explore and use it as inspiration for your own projects!
        </p>
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          In the development of this project, I leveraged powerful tools like
          Visual Studio Code for efficient coding and GitHub for version control
          and collaboration. Firebase served as the backend for user
          authentication, while MongoDB Atlas provided a cloud-based database
          solution. For hosting, the application is deployed on Render, ensuring
          a reliable and scalable environment.
        </p>
      </div>
    </div>
  );
}
