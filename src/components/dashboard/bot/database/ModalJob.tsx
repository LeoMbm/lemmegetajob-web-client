"use client";

import { Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function PopUpModal({
  isOpen,
  onClose,
  itemToEdit,
  setJobList,
}) {
  // console.log(itemToEdit);
  const [loading, setLoading] = useState(false);
  const handleDeleteClick = (itemId: number) => {
    setLoading(true);
    fetch(`/api/data/jobs/${itemId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        onClose();
        setJobList((prevJobList) =>
          prevJobList.filter((job) => job.id !== itemId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal show={isOpen} size="md" popup onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this job?
          </h3>
          {itemToEdit && (
            <>
              <div className="flex justify-center gap-4">
                <button
                  className="btn p-4 bg-blue-600 text-white rounded-lg"
                  onClick={onClose}
                >
                  Cancel
                </button>
                {loading ? (
                  <button
                    className="btn p-4 bg-red-400 text-white rounded-lg"
                    disabled
                  >
                    Deleting...
                    <Spinner className="ml-2" size="xs" />
                  </button>
                ) : (
                  <button
                    className="btn p-4 bg-red-600 text-white rounded-lg"
                    onClick={() => handleDeleteClick(itemToEdit.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
