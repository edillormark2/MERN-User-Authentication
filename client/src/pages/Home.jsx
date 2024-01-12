import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="dark:text-gray-200 text-xl sm:text-3xl font-bold mb-4 text-slate-800">
        {currentUser
          ? `Hi ${currentUser.username}, Welcome!`
          : "Welcome to Auth App Web Project!"}
      </h1>
      <div className="bg-gray-50 dark:bg-secondary-dark-bg drop-shadow-lg p-4 rounded-lg">
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Explore a seamless web experience crafted with passion and expertise.
          This full-stack web application, built with the MERN (MongoDB,
          Express, React, Node.js) stack, offers user-friendly features for easy
          navigation.
        </p>
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Sign up, log in, and enjoy the personalized journey through protected
          routes. The front-end, powered by React and React Router, ensures a
          smooth and responsive interface, while the back-end, driven by Node.js
          and Express, guarantees secure data handling with MongoDB.
        </p>
        <p className="dark:text-gray-200 mt-2 m-2 text-slate-700 text-sm sm:text-base">
          Whether you're a developer seeking inspiration or a user looking for a
          seamless experience, this project is designed for you. Take a tour,
          experience the simplicity, and feel free to use it as a template for
          your own full-stack web applications!
        </p>
      </div>
    </div>
  );
}
