import { useState } from "react";
import { signupFields } from "../../constants/formFields";
import { Link, useNavigate  } from "react-router-dom";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase/setup';

const fields = signupFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));



function SignupPage() {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState(fieldsState);
  console.log(signupState)
  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(signupState);
    if(signupState.password !== signupState.confirmPassword){
      alert(`Password and Confirm Password should be same`)
      
    }else{
      createAccount();
    }
    
  };

  // Signup API Integration 
  const createAccount = async() => {
    
    await createUserWithEmailAndPassword(auth, signupState.email, signupState.password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/dashboard")
       
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
  };

  return (
    <div className="min-h-full h-screen flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
      <div className="">
          <div className="flex justify-center">
            <img
              alt=""
              className="mt-0 h-14 w-14"
              src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
           Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            {"Already a User? "}{" "}
            <Link
              to={"/"}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              {"Sign In"}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="">
            {fields.map((field) => (
              <div className="my-5">
                <label htmlFor={field.labelFor} className="sr-only">
                  {field.labelText}
                </label>
                <input
                  onChange={handleChange}
                  value={signupState[field.id]}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  required={field.isRequired}
                  className={
                    "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  }
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onSubmit={handleSubmit}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
export default SignupPage;
