import { RegisterForm } from "@/components/auth/RegisterForm";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="flex flex-col items-center space-y-4 xl:w-1/3 md:w-4/5 mobile:w-3/4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Image
            alt="Rico Logo"
            height={150}
            width={150}
            src="https://ricosaas.eu/static/screenshots/logo.png"
          />
          <span className="text-3xl text-black font-semibold dark:text-white">
            RICO
          </span>
        </div>

        <div className="mt-8 space-y-4 w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
