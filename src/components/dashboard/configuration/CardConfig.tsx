'use client';
import React, { useState, useEffect } from 'react';
import { Progress, FileInput, Label } from 'flowbite-react';
import { cardData } from './data/CardData';
import { FormData, SubmittedCategories } from './interface/CardConfigInterface';

export default function CardConfig() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [formData, setFormData] = useState<FormData>({});
    const [submittedCategories, setSubmittedCategories] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const questionsPerPage = 6;
    
    useEffect(() => {
        const submitted = JSON.parse(localStorage.getItem('submittedCategories') || '{}');
        setSubmittedCategories(submitted);
      }, []);

  
    const openModal = (content: string) => {
        setModalContent(content);
        setProgress(0);
        setCurrentPage(0);
        setModalOpen(true);

        const savedFormData = JSON.parse(localStorage.getItem(`submittedData_${content}`) || '{}');
        setFormData(savedFormData);
      
        const existingSubmittedCategories = JSON.parse(localStorage.getItem('submittedCategories') || '[]');
        setIsSaved(existingSubmittedCategories.includes(content));
      };
    
    const closeModal = () => {
      setModalOpen(false);
    };
  
    const nextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
      setProgress(((currentPage + 1) / Math.ceil(cardData[modalContent].length / questionsPerPage)) * 100);
    };
  
    const prevPage = () => {
      setCurrentPage((prevPage) => prevPage - 1);
      setProgress(((currentPage - 1) / Math.ceil(cardData[modalContent].length / questionsPerPage)) * 100);
    };
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      const requiredFields = cardData[modalContent].filter((field) => field.required);
      const missingRequiredFields = requiredFields.filter((field) => !formData[`field_${field.label}`]);
    
      if (missingRequiredFields.length > 0) {
        console.log('The following fields are required and empty:', missingRequiredFields.map((field) => field.label));
        return;
      }
    
      localStorage.setItem(`submittedData_${modalContent}`, JSON.stringify(formData));
    
      const newSubmittedCategory = modalContent;
      let existingSubmittedCategories = JSON.parse(localStorage.getItem('submittedCategories') || '[]');
    
      if (!Array.isArray(existingSubmittedCategories)) {
        existingSubmittedCategories = [];
      }
    
      if (!existingSubmittedCategories.includes(newSubmittedCategory)) {
        existingSubmittedCategories.push(newSubmittedCategory);
        localStorage.setItem('submittedCategories', JSON.stringify(existingSubmittedCategories));
      }
    
      console.log('Form data:', formData);
    
      setIsSaved(true);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        closeModal();
      }, 3000);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.target;
  
      const newValue = type === 'checkbox' ? checked : value;
  
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
    <div className="flex flex-wrap -mx-4">
    {Object.entries(cardData).map(([label, fields]) => (
      <div key={label} className="w-full md:w-1/2 xl:w-1/3 p-4">
        <div
          className={`bg-gray-50 border border-gray-200 rounded-xl shadow p-6 cursor-pointer hover:bg-gray-950 relative transform transition-transform hover:scale-105 ${
            Array.isArray(submittedCategories) && submittedCategories.includes(label) ? 'bg-green-100' : ''
          }`}
          onClick={() => openModal(label)}
        >
          <div className="flex flex-row items-center">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-3xl text-gray-600">{label}</h3>
            </div>
            {Array.isArray(submittedCategories) && submittedCategories.includes(label) && (
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>
      </div>
    ))}

{modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-10">
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2 max-w-sm">
      {/* <button
        className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors duration-300 absolute top-0 right-0 m-2 md:m-4"
        onClick={closeModal}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button> */}

      <form onSubmit={handleSubmit}>
        <Progress
          size="lg"
          labelProgress
          progress={Math.round((currentPage / Math.ceil(cardData[modalContent].length / questionsPerPage)) * 100)}
        />
        <h3 className="text-gray-800 font-bold text-sm md:text-lg mb-2">{modalContent} Form</h3>
              {cardData[modalContent].slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage).map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block font-medium text-gray-700 mb-1">{field.required ? field.label + "*": field.label}</label>
                  {field.type === 'text' && (
  <input
    type="text"
    name={`field_${field.label}`}
    value={formData[`field_${field.label}`] || ''}
    onChange={handleInputChange}
    className="border text-gray-700 border-gray-300 p-2 rounded-md w-full"
    required={field.required}
  />
)}
{field.type === 'number' && (
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
{field.type === 'radio' && (
  <div className="flex space-x-4">
    {field.options?.map((option, optionIndex) => (
      <label key={optionIndex} className="flex items-center space-x-2">
        <input
          type="radio"
          name={`field_${field.label}`}
          value={option}
          checked={formData[`field_${field.label}`] === option}
          onChange={handleInputChange}
          className="text-blue-500"
        />
        <span className='text-gray-700'>{option}</span>
      </label>
    ))}
  </div>
)}
{field.type === 'select' && field.options && (
  <select
    name={`field_${field.label}`}
    value={formData[`field_${field.label}`] || ''}
    onChange={handleSelectChange}
    className="border border-gray-300 p-2 rounded-md w-full text-gray-700"
  >
    <option value="">Select an option</option>
    {field.options.map((option, optionIndex) => (
      <option key={optionIndex} value={option} className='text-gray-700'>
        {option}
      </option>
    ))}
  </select>
)}
{field.type === 'checkbox' && field.options && (
  <div>
    {field.options.map((option, optionIndex) => (
      <label key={optionIndex} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={`field_${field.label}_${optionIndex}`}
          checked={formData[`field_${field.label}_${optionIndex}`] === 'true'}
          onChange={handleInputChange}
          className="text-blue-500"
        />
        <span className='text-gray-700'>{option}</span>
      </label>
    ))}
  </div>
)}
{field.type === 'file' && (
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
                {currentPage < cardData[modalContent].length - 1 && (
                 <button
                 type="button"
                 className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${currentPage === Math.floor(cardData[modalContent].length / questionsPerPage) ? 'hidden' : ''}`}
                 onClick={nextPage}
                 disabled={currentPage === Math.floor(cardData[modalContent].length / questionsPerPage)}
             >
                 Next
             </button>
                )}
                {currentPage === Math.floor(cardData[modalContent].length / questionsPerPage) && (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                )}
                <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                onClick={closeModal}
                >
                Close
                </button>
              </div>
            </form>
         
            {isSaved && (
            <div className="flex items-center space-x-2 text-green-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Saved to Local Storage</span>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
