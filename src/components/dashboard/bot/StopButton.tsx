"use client";
import React from "react";
import { DiodeStatus } from "./LaunchButton";

type StopButtonProps = {
  launcher: () => void;
  diodeStatus: DiodeStatus;
};
export const StopButton = ({ launcher, diodeStatus }) => {
  let customStyle =
    diodeStatus === "success"
      ? "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
      : "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2";
  let disabled = diodeStatus === "success" ? false : true;

  return (
    <button
      className={customStyle}
      onClick={() => launcher()}
      disabled={disabled}
    >
      Stop
    </button>
  );
};
