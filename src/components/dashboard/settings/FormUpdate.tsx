"use client";
import ToastMessage from "@/components/global/alert/Toast";
import { useUserData } from "@/lib/useUserData";
import { User } from "@/types/user";
import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";

const FormField = ({ label, id, ...rest }) => (
  <div className="relative z-0 w-full mb-6 group">
    <input
      id={id}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      {...rest}
    />
    <label
      htmlFor={id}
      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);
const FormTextArea = ({ label, id, ...rest }) => (
  <div className="relative z-0 w-full mb-6 group">
    <textarea
      id={id}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      {...rest}
    />
    <label
      htmlFor={id}
      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);
export const FormUpdate = () => {
  const { userData, error, isLoading } = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    current_position: "",
    current_company: "",
    current_location: "",
    description: "",
  });

  const handleCloseToast = () => {
    setMessage(null);
    setStatus(null);
  };

  useEffect(() => {
    if (!isLoading && userData) {
      const user: User = userData.user;
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        current_position: user.current_position,
        current_company: user.current_company,
        current_location: user.current_location,
        password: "",
        description: user.description,
      });
    }
  }, [isLoading, userData]);

  if (isLoading) {
    return (
      <div className="p-4 w-full flex justify-center items-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return <div className="text-black">Error: {error.message}</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    fetch("/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setMessage("Profile updated successfully");
        setStatus("success");
      }
      setIsSubmitting(false);
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <FormField
          label="Email address"
          id="floating_email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled
        />
        <FormField
          label="Password"
          id="floating_password"
          type="password"
          name="password"
          value={formData.password}
          disabled
        />
        <div className="grid md:grid-cols-2 md:gap-6">
          <FormField
            label="First name"
            id="floating_first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
          <FormField
            label="Last name"
            id="floating_last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <FormField
            label="Phone number (123-456-7890)"
            id="floating_phone"
            type="tel"
            name="phone"
            pattern="[0-9]{10}"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <FormField
            label="Position (Ex. Developer)"
            id="floating_position"
            type="text"
            name="current_position"
            value={formData.current_position}
            onChange={handleInputChange}
          />
          <FormField
            label="Company (Ex. Google)"
            id="floating_company"
            type="text"
            name="current_company"
            value={formData.current_company}
            onChange={handleInputChange}
          />
          <FormField
            label="Location (Ex. Brussels)"
            id="floating_location"
            type="text"
            name="current_location"
            value={formData.current_location}
            onChange={handleInputChange}
          />
          <FormTextArea
            label="Description"
            id="floating_description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        {isSubmitting ? (
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Spinner size="xs" />
          </button>
        ) : (
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        )}
      </form>
      {message && (
        <ToastMessage
          message={message}
          status={status}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};
