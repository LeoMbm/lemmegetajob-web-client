'use client';

import { useState, useEffect, use } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import ToastMessage from "../global/alert/Toast";
import { log } from "console";

export default function CredentialsForm() {
    const session = useSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    // console.log(session);
    
  
    useEffect(() => {
        if (session?.status === 'authenticated') {
          router.push('/dashboard');
        }

    }, [session]);


    const handleCloseToast = () => {
      setMessage(null);
      setStatus(null);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            email: email,
            password: password
        };
        setIsLoading(true);
        signIn('credentials', { ...data, redirect: false, callbackUrl})
        .then((response) => {
          if (response?.error === null) {
              setMessage("Login successful");
              setStatus('success');
            }
            else {
                setMessage(response.error);
                setStatus('error');
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }




    return (
      <form className="flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input onChange={(e) => handleEmailChange(e)}type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@rico.com" required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input onChange={(e) => handlePasswordChange(e)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="flex space-x-1 items-start">
          <div className="flex items-center h-5">
            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
          </div>
          <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
        </div>
        <button
            onClick={(e) => handleSubmit(e)}
            type="submit"
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
        >
            {isLoading ? 'Loading...' : 'Submit'}
        </button>
        <div className="mr-auto text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
          </div>
          <div className="mr-auto text-sm">
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Create an account</a>
          </div>



        {message && <ToastMessage message={message} status={status} onClose={handleCloseToast} />}
      </form>
    );
  }

