'use client';

import { Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';

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
      color="success"
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


