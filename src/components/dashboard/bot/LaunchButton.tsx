"use client";
import React from "react";

export type DiodeStatus = "waiting" | "success" | "failure";

type LaunchButtonProps = {
  launcher: () => void;
  diodeStatus: DiodeStatus;
};
export const LaunchButton = ({ launcher, diodeStatus }: LaunchButtonProps) => {
  let diodeColor: string;

  switch (diodeStatus) {
    case "waiting":
      diodeColor = "yellow";
      break;
    case "success":
      diodeColor = "green";
      break;
    case "failure":
      diodeColor = "red";
      break;
    default:
      diodeColor = "gray";
      break;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
      onClick={() => launcher()}
    >
      Launch
      <svg
        className={`w-2 h-2 rounded-full ${diodeColor} ml-1`}
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" r="4" fill={diodeColor} />
      </svg>
    </button>
  );
};
