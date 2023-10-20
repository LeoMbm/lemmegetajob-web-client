import React, { useEffect, useState } from "react";

export const LogApplyItem = ({ log, index }) => {
  const [isNewLog, setIsNewLog] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsNewLog(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      key={index}
      className="flex items-center justify-between px-4 py-3 border-b border-gray-300 last:border-b-0 bg-white hover:bg-gray-100 transition-colors duration-300"
    >
      <span className="text-gray-800">{log}</span>
      {isNewLog && (
        <span className="px-2 py-1 text-xs rounded-md bg-blue-500 text-white transition-opacity duration-500 opacity-100 hover:opacity-75">
          New
        </span>
      )}
    </div>
  );
};
