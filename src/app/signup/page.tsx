import { RegisterForm } from "@/components/auth/RegisterForm";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="flex flex-col items-center space-y-4 xl:w-1/3 md:w-4/5 mobile:w-3/4">
        <div className="flex items-center space-x-2">
          <img
            alt="Flowbite React Logo"
            className="h-12 sm:h-16"
            src="https://flowbite.com/docs/images/logo.svg"
          />
          <span className="text-2xl sm:text-3xl text-black font-semibold dark:text-white">RICO</span>
        </div>
        <div className="mt-8 space-y-4 w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}