import CredentialsForm from "@/components/auth/CredentialsForm";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center overflow-y-hidden bg-gray-100 p-4">
      <div className="flex-col">
        <div className="flex items-center justify-center space-x-4">
          <img
            alt="Flowbite React Logo"
            className="h-16 sm:h-20"
            src="https://flowbite.com/docs/images/logo.svg"
          />
          <span className="text-3xl text-black font-semibold dark:text-white">RICO</span>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          <CredentialsForm />
        </div>
      </div>
    </div>
  );
}