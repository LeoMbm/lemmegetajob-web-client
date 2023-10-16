"use client";

import React from "react";
import ToastMessage from "../global/alert/Toast";
import { Spinner } from "flowbite-react";

export const RegisterForm = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    repeat_password: "",
    first_name: "",
    last_name: "",
    phone: "",
    position: "",
  });
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputError, setInputError] = React.useState({
    email: "",
    password: "",
    repeat_password: "",
    phone: "",
  });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    // Validation et gestion des erreurs
    if (name === "email") {
      if (!value.match(/^\S+@\S+\.\S+$/)) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email address",
        }));
      } else {
        setInputError((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    } else if (name === "password") {
      if (value.length < 8) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 8 characters long",
        }));
      } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          password:
            "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character",
        }));
      } else {
        setInputError((prevErrors) => ({
          ...prevErrors,
          password: "",
        }));
      }
    } else if (name === "repeat_password") {
      if (value !== user.password) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          repeat_password: "Passwords do not match",
        }));
      } else {
        setInputError((prevErrors) => ({
          ...prevErrors,
          repeat_password: "",
        }));
      }
    } else if (name === "phone") {
      if (!value.match(/^(\+|\d)[0-9]+$/)) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          phone: "Invalid phone number",
        }));
      } else {
        setInputError((prevErrors) => ({
          ...prevErrors,
          phone: "",
        }));
      }
    }
  };

  const isFormValid = () => {
    const hasErrors = Object.values(inputError).some((error) => error !== "");
    const isAnyFieldEmpty = Object.values(user).some((value) => value === "");

    return hasErrors || isAnyFieldEmpty;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        setMessage(data.error);
        setStatus("error");
        setIsLoading(false);
      } else {
        setMessage("Email confirmation sent !");
        setStatus("success");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="email"
            id="email"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
              inputError.email ? "border-red-500" : ""
            }`}
            placeholder=" "
            onChange={handleChange}
            required
          />
          {inputError.email && (
            <p className="text-red-500 text-xs mt-1">{inputError.email}</p>
          )}
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
              inputError.password ? "border-red-500" : ""
            }`}
            placeholder=" "
            required
          />
          {inputError.password && (
            <p className="text-red-500 text-xs mt-1">{inputError.password}</p>
          )}
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="repeat_password"
            id="repeat_password"
            onChange={handleChange}
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
              inputError.repeat_password ? "border-red-500" : ""
            }`}
            placeholder=" "
            required
          />
          {inputError.repeat_password && (
            <p className="text-red-500 text-xs mt-1">
              {inputError.repeat_password}
            </p>
          )}
          <label
            htmlFor="repeat_password"
            className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm password
          </label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              onChange={handleChange}
              name="first_name"
              id="first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              onChange={handleChange}
              name="last_name"
              id="last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="tel"
              onChange={handleChange}
              name="phone"
              id="phone"
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                inputError.phone ? "border-red-500" : ""
              }`}
              placeholder=" "
              required
            />
            {inputError.phone && (
              <p className="text-red-500 text-xs mt-1">{inputError.phone}</p>
            )}
            <label
              htmlFor="phone"
              className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              onChange={handleChange}
              name="position"
              id="position"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="position"
              className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Position (Ex. Software Developer)
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || isFormValid()}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            isFormValid() ? "gray-button" : ""
          }`}
        >
          {isLoading ? <Spinner size="xs" /> : "Submit"}
        </button>
      </form>
      <div className="flex items-center justify-center mt-6">
        <a
          href="/signin"
          className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Already have an account? Login
        </a>
      </div>

      {message && (
        <ToastMessage message={message} status={status} onClose={() => false} />
      )}
    </div>
  );
};
