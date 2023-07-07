import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/setup";

const NavBar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/"); 
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <nav className="bg-transparent mb-0">
      <ul className="flex justify-center items-center space-x-10 py-4">
        <li className="mr-6">
          <Link
            to="/dashboard"
            className="text-black hover:text-gray-300 transition duration-300 font-bold text-xl ml-4"
          >
            PdfDraft
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className="text-black hover:text-gray-300 transition duration-300 "
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/upload"
            className="text-black hover:text-gray-300 transition duration-300 "
          >
            Upload PDF
          </Link>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="text-black hover:text-gray-300 transition duration-300 cursor-pointer"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
