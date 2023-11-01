"use client";
import React, { useState, useEffect } from "react";
import { Progress, FileInput, Label } from "flowbite-react";
import { cardData } from "./data/CardData";
import { FormData, SubmittedCategories } from "./interface/CardConfigInterface";

export default function CardConfig({ type }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [submittedCategories, setSubmittedCategories] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const questionsPerPage = 6;

  useEffect(() => {
    const submitted = JSON.parse(
      localStorage.getItem("submittedCategories") || "{}"
    );
    setSubmittedCategories(submitted);
  }, []);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setProgress(
      ((currentPage + 1) /
        Math.ceil(cardData[type].length / questionsPerPage)) *
        100
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    setProgress(
      ((currentPage - 1) /
        Math.ceil(cardData[type].length / questionsPerPage)) *
        100
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = cardData[type].filter((field) => field.required);
    const missingRequiredFields = requiredFields.filter(
      (field) => !formData[`field_${field.label}`]
    );

    if (missingRequiredFields.length > 0) {
      console.log(
        "The following fields are required and empty:",
        missingRequiredFields.map((field) => field.label)
      );
      return;
    }

    localStorage.setItem(`submittedData_${type}`, JSON.stringify(formData));

    const newSubmittedCategory = type;
    let existingSubmittedCategories = JSON.parse(
      localStorage.getItem("submittedCategories") || "[]"
    );

    if (!Array.isArray(existingSubmittedCategories)) {
      existingSubmittedCategories = [];
    }

    if (!existingSubmittedCategories.includes(newSubmittedCategory)) {
      existingSubmittedCategories.push(newSubmittedCategory);
      localStorage.setItem(
        "submittedCategories",
        JSON.stringify(existingSubmittedCategories)
      );
    }

    setIsSaved(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div key={type} className="w-full flex items-center justify-center p-4">
      <div className="w-full md:w-2/3 lg:w-1/2 max-w-3xl p-4">
        <Progress
          size="lg"
          labelProgress
          progress={Math.round(
            (currentPage /
              Math.ceil(cardData[type].length / questionsPerPage)) *
              100
          )}
        />
        <h3 className="text-gray-800 font-bold text-sm md:text-lg mb-2">
          {type} Form
        </h3>
        {cardData[type]
          .slice(
            currentPage * questionsPerPage,
            (currentPage + 1) * questionsPerPage
          )
          .map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">
                {field.required ? field.label + "*" : field.label}
              </label>
              {field.type === "text" && (
                <input
                  type="text"
                  name={`field_${field.label}`}
                  value={formData[`field_${field.label}`] || ""}
                  onChange={handleInputChange}
                  className="border text-gray-700 border-gray-300 p-2 rounded-md w-full"
                  required={field.required}
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  name={`field_${field.label}`}
                  min={0}
                  value={formData[`field_${field.label}`] || 0}
                  onChange={handleInputChange}
                  className="border text-gray-700 border-gray-300 p-2 rounded-md w-full"
                  required={field.required}
                />
              )}
              {field.type === "radio" && (
                <div className="flex space-x-4">
                  {field.options?.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`field_${field.label}`}
                        value={option}
                        checked={formData[`field_${field.label}`] === option}
                        onChange={handleInputChange}
                        className="text-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === "select" && field.options && (
                <select
                  name={`field_${field.label}`}
                  value={formData[`field_${field.label}`] || ""}
                  onChange={handleSelectChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-gray-700"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, optionIndex) => (
                    <option
                      key={optionIndex}
                      value={option}
                      className="text-gray-700"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "checkbox" && field.options && (
                <div>
                  {field.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        name={`field_${field.label}_${optionIndex}`}
                        checked={
                          formData[`field_${field.label}_${optionIndex}`] ===
                          "true"
                        }
                        onChange={handleInputChange}
                        className="text-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === "file" && (
                <div className="max-w-md" id="fileUpload">
                  <FileInput
                    helperText="Only .pdf files are allowed, 2mb max"
                    id="file"
                  />
                </div>
              )}
            </div>
          ))}
        <div className="flex justify-between my-2">
          {currentPage > 0 && (
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              Previous
            </button>
          )}
          {currentPage < cardData[type].length - 1 && (
            <button
              type="button"
              className={`bg-blue-500 hover-bg-blue-600 text-white px-4 py-2 rounded-md ${
                currentPage ===
                Math.floor(cardData[type].length / questionsPerPage)
                  ? "hidden"
                  : ""
              }`}
              onClick={nextPage}
              disabled={
                currentPage ===
                Math.floor(cardData[type].length / questionsPerPage)
              }
            >
              Next
            </button>
          )}
          {currentPage ===
            Math.floor(cardData[type].length / questionsPerPage) && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </button>
          )}
        </div>
        {isSaved && (
          <div className="flex items-center space-x-2 text-green-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>Saved to Local Storage</span>
          </div>
        )}
      </div>
    </div>
  );
}
