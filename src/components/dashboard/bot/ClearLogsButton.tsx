"use client";
import React from "react";

type ClearLogsButtonProps = {
  handler: () => void;
  disabled: boolean;
};
export const ClearLogsButton = ({
  handler,
  disabled,
}: ClearLogsButtonProps) => {
  const customStyle = disabled
    ? "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
    : "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2";
  return (
    <button
      className={customStyle}
      onClick={() => handler()}
      disabled={disabled}
    >
      Clear Logs
    </button>
  );
};
