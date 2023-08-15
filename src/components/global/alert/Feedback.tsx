'use client';

import { Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import type { CustomFlowbiteTheme } from 'flowbite-react';


const customTheme: CustomFlowbiteTheme['alert'] = {
  closeButton: {
    color: {
      blue: 'text-white hover:text-blue-100 bg-blue-300'
    }
    },

    color: {
      blue: "text-white bg-blue-500 border-cyan-500 dark:bg-cyan-200 dark:text-cyan-800",
    }
  };
  

export default function FeedbackAlert() {
    const [visible, setVisible] = useState(false);
    const [localStorageChecked, setLocalStorageChecked] = useState(false);

    useEffect(() => {
        if (!localStorageChecked) {
          const alertSeen = localStorage.getItem('alertSeen');
          if (!alertSeen) {
            setVisible(true);
          }
          setLocalStorageChecked(false);
        }
      }, [localStorageChecked]);
    
      const dismissAlert = () => {
        localStorage.setItem('alertSeen', 'true');
        setVisible(false);
      };
    
  return visible ? (
    <Alert
      theme={customTheme}
      color="blue"
      icon={HiInformationCircle}
      onDismiss={dismissAlert}
    >
      <span>
        <p>
          <span className="font-medium">Info alert! </span>
          Please feel free to leave a feedback this is still in beta.
        </p>
      </span>
    </Alert>
  ) : null;
}


