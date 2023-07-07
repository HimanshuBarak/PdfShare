import { useState } from "react";
import { loginFields } from "../../constants/formFields";
import { Link, useNavigate} from "react-router-dom";
import {  signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase/setup';


const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

function LoginPage() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  
  const authenticateUser = () => {
     let loginFields={
            email:loginState['email'],
             password:loginState['password']
     };
     signInWithEmailAndPassword(auth, loginFields.email, loginFields.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/dashboard")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Invalid Credentials !");
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
           Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            {"New User? "}{" "}
            <Link
              to={"/signup"}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              {"Sign Up"}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px">
            {fields.map((field) => (
              <div className="my-5">
                <label htmlFor={field.labelFor} className="sr-only">
                  {field.labelText}
                </label>
                <input
                  onChange={handleChange}
                  value={loginState[field.id]}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  required={field.isRequired}
                  className={
                    "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm" }
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onSubmit={handleSubmit}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
