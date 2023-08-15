'use client';
import React, { useEffect, useRef, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { LaunchButton } from '../LaunchButton';
import ToastFeedback from '../../Toast';
import { ClearLogsButton } from '../ClearLogsButton';
import { StopButton } from '../StopButton';

const LOG_URL = process.env.NEXT_PUBLIC_LOG_REALTIME_URL;

export const LogView = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [botLaunched, setBotLaunched] = useState(false);
  const [namespaces, setNamespaces] = useState<string | null>(null);
  const [deployementName, setDeployementName] = useState<string | null>(null);
  const [diodeStatus, setDiodeStatus] = useState('');

  useEffect(() => {
    const scrollableContainer = scrollableContainerRef.current;
    scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
  }, [logs]);



  const launchInstance = async () => {
    const res = await fetch('/api/bot/launch', {
      method: 'POST',
    });
  
    const data = await res.json();
    setNamespaces(data.namespace);
    setDeployementName(data.deployment_name);
    console.log(data);
    return data;
  };

  const stopInstance = async () => {
    const res = await fetch('/api/bot/stop', {
      method: 'POST',
    });

    const data = await res.json();
    console.log(data);
    return data;
  };

  const handleStop = async () => {
    console.log('Stopping bot...');
    try {
      const response = await stopInstance();
      console.log(response);
      if (response.status === 200) {
        console.log('Bot stopped successfully.');
        setDiodeStatus('');
        setBotLaunched(false);
      }
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
  };



  const handleLaunch = async () => {
    console.log('Launching bot...');
    setDiodeStatus('waiting');
    
    try {
      const response = await launchInstance();
      console.log(response);
      if (response.status === 200) {
        console.log('Bot launched successfully let\'s go !');
        setDiodeStatus('success');
        setBotLaunched(true);
      } else {
        setDiodeStatus('failure');
        setTimeout(() => {
          setDiodeStatus('');
        }, 5000); // Réinitialiser la diode après 5 secondes
      }
    } 
    catch (error) {
      console.error('Error launching bot:', error);
      setDiodeStatus('failure');
        setTimeout(() => {
          setDiodeStatus('');
        }, 5000);
    }
  };

  const handleClearLogs = () => {
    console.log(logs);
    setLogs([]);
    console.log('Logs cleared.');
  };

  useEffect(() => {
    if (botLaunched) {
      const socket = new WebSocket(`${LOG_URL}/leombm`);

      setSocket(socket);

      socket.onopen = () => {
        console.log('WebSocket connection established.');
      };

      socket.onmessage = (event) => {
        const message = event.data;
        console.log('Received message:', message);
      
        if (message) {
          setLogs((prevLogs) => [...prevLogs, message]);
        } else if (message.error) {
          console.error('Error:', message.error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed.');
        setDiodeStatus('');
        setBotLaunched(false);
 
      };

      return () => {
        socket.close();
      };
    }
  }, [botLaunched]);




    return (
    <div>
      <div className='flex items-center justify-between w-full xl:w-1/4'>
      <LaunchButton diodeStatus={diodeStatus} launcher={handleLaunch} />
      <StopButton diodeStatus={diodeStatus} launcher={handleStop} />
      <ClearLogsButton handler={handleClearLogs} disabled={logs.length === 0 ? true : false} />
      </div>
      <div className="w-full h-full border rounded-lg overflow-hidden shadow-md mt-4">
        <div className="flex flex-col-reverse h-96 overflow-y-auto" ref={scrollableContainerRef}>
          <ScrollableFeed forceScroll={true}>
            {logs.length === 0 ? (
              <div className="flex items-center justify-center py-3 bg-gray-200 text-gray-600">
                No logs
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-300 last:border-b-0 bg-white hover:bg-gray-100 transition-colors duration-300"
                >
                  <span className="text-gray-800">{log}</span>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-500 text-white">New</span>
                </div>
              ))
            )}
          </ScrollableFeed>
        </div>
      </div>
      <ToastFeedback status={diodeStatus} />
    </div>
  );
};