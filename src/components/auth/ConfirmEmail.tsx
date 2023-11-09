"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import ToastMessage from "../global/alert/Toast";
import { Spinner } from "flowbite-react";

export const ConfirmEmail = () => {
  //   const session = useSession();
  const searchParams = useSearchParams();
  const params = searchParams.get("token");
  const [token, setToken] = useState(params);
  const [verified, setVerified] = useState<Boolean>();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const verifyEmail = async () => {
    const response = await fetch(`api/auth/confirm?token=${token}`, {
      method: "GET",
    });
    const data = await response.json();

    if (response.status == 200) {
      setVerified(true);
      setLoading(false);
      setMessage(data.message);
      setStatus("success");
    } else if (response.status == 400) {
      setVerified(false);
      setLoading(false);
      setStatus("error");
      setMessage(data.message);
    }
  };

  useEffect(() => {
    if (token && token.length > 0) verifyEmail();
  }, [token]);

  return (
    <div className="flex-col">
      {loading ? (
        <div className="flex items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <div className="text-black text-center">
            {verified ? "Account confirmed, you can login now" : message}
          </div>
          <ToastMessage
            status={status}
            message={message}
            onClose={() => false}
          />
        </>
      )}
    </div>
  );
};
