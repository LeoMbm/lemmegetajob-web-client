'use client';

import { Toast } from 'flowbite-react';
import { HiCheck, HiX, HiExclamation } from 'react-icons/hi';

export default function ToastFeedback({status}) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4">
        {status === 'success' && (
      <Toast className="slide-up toast-success fadeOut" duration={300}>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          Bot successfully deployed.
        </div>
        <Toast.Toggle />
      </Toast>
            )}
        {status === 'failure' && (

      <Toast className="slide-up toast-failure fadeOut" duration={300}>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <HiExclamation className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          Error deploying bot.
        </div>
        <Toast.Toggle />
      </Toast>
            )}
    </div>
  )
}