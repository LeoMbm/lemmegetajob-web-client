import CredentialsForm from "@/components/auth/CredentialsForm";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center overflow-y-hidden bg-gray-100 p-4">
      <div className="flex-col">
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

        <div className="flex justify-center mt-8 space-x-2">
          <CredentialsForm />
        </div>
      </div>
    </div>
  );
}
