"use client";
import React, { use, useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { LaunchButton } from "../LaunchButton";
import ToastFeedback from "../../Toast";
import { ClearLogsButton } from "../ClearLogsButton";
import { StopButton } from "../StopButton";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogApplyItem } from "./LogApplyItem";
import { useUserData } from "@/lib/useUserData";
import { User } from "@/types/user";
import { Spinner } from "flowbite-react";

const LOG_URL = process.env.NEXT_PUBLIC_LOG_REALTIME_URL;

export const LogApplyView = () => {
  const { userData, error, isLoading } = useUserData();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [botApplyLaunch, setBotApplyLaunch] = useState(false);
  const [namespaces, setNamespaces] = useState<string | null>(null);
  const [deployementName, setDeployementName] = useState<string | null>(null);
  const [diodeStatus, setDiodeStatus] = useState("");
  const [message, setMessage] = useState<string | null>("");
  const session = useSession();
  const authToken = session.data?.backendToken;
  if (isLoading) {
    console.log("Loading logs...");
  }

  const launchInstance = async () => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    const res = await fetch("/api/bot/launch", {
      method: "POST",
      headers,
      body: JSON.stringify({
        mode: "apply",
      }),
    });
    const data = await res.json();

    if (res.status === 401) {
      console.log("Redirect to sign in page");
    }
    if (res.status === 500) {
      console.log("Error launching bot");
    }
    if (res.status === 200) {
      console.log("Bot launched successfully");
      setNamespaces(data.namespace);
      setDeployementName(data.deployment_name);
    }
    return data;
  };

  const stopInstance = async () => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    const res = await fetch("/api/bot/stop", {
      method: "POST",
      headers,
      body: JSON.stringify({
        mode: "apply",
      }),
    });

    const data = await res.json();
    console.log(data);
    return data;
  };

  const handleStop = async () => {
    console.log("Stopping bot...");
    try {
      const response = await stopInstance();

      console.log(response);
      if (response.status === 200) {
        console.log("Bot stopped successfully.");
        setMessage("Bot stopped successfully.");
        setBotApplyLaunch(false);
        setDiodeStatus("");
        setLogs([...logs, "Bot stopped successfully."]); // fixed spread argument
        localStorage.removeItem("logs");
        localStorage.removeItem("diodeStatus");
        localStorage.removeItem("botApplyLaunch");
      }
      if (response.message.status === 401) {
        setMessage("You are not authorized to perform this action.");
        console.log("Redirect to sign in page");
        // router.push("/signin")
      }
      if (response.message.status === 404) {
        setMessage("Bot not found");
        console.log("Bot not found");
      }
    } catch (error) {
      console.error("Error stopping bot:", error);
    }
  };

  const handleLaunch = async () => {
    console.log("Launching bot...");
    setDiodeStatus("waiting");
    try {
      const response = await launchInstance();
      if (response.status === 200) {
        console.log("Bot launched successfully let's go !");
        setDiodeStatus("success");
        setBotApplyLaunch(true);
        localStorage.setItem("botApplyLaunch", "true");
        setMessage("Bot launched successfully");
      } else if (response.status === 401) {
        setDiodeStatus("failure");
        setMessage("You are not authorized to perform this action.");
        console.log("Redirect to sign in page");
        // router.push("/signin")
      } else {
        console.log(response);
        setDiodeStatus("failure");
        setMessage("Error launching bot");
        setTimeout(() => {
          setDiodeStatus("");
        }, 5000); // Réinitialiser la diode après 5 secondes
      }
    } catch (error) {
      console.error("Error launching bot:", error);
      setDiodeStatus("failure");
      setTimeout(() => {
        setDiodeStatus("");
      }, 5000);
    }
  };

  const handleClearLogs = () => {
    console.log(logs);
    setLogs([]);
    console.log("Logs cleared.");
  };

  useEffect(() => {
    const savedLogs = localStorage.getItem("logs");
    const savedDiodeStatus = localStorage.getItem("diodeStatus");
    const savedBotApplyLaunch = localStorage.getItem("botApplyLaunch");

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    if (savedDiodeStatus) {
      setDiodeStatus(savedDiodeStatus);
    }
    if (savedBotApplyLaunch) {
      setBotApplyLaunch(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
    localStorage.setItem("diodeStatus", diodeStatus);
  }, [logs, diodeStatus]);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      const scrollableContainer = scrollableContainerRef.current;
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (botApplyLaunch) {
      const user: User = userData?.user;
      const socket_email = user?.email.replace(/[^a-zA-Z0-9]/g, "");
      const socket = new WebSocket(`${LOG_URL}/${socket_email}`);

      setSocket(socket);

      socket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      socket.onmessage = (event) => {
        const message = event.data;
        console.log("Received message:", message);

        if (message) {
          setLogs((prevLogs) => [...prevLogs, message]);
        } else if (message.error) {
          console.error("Error:", message.error);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        setDiodeStatus("");
        setBotApplyLaunch(false);
        localStorage.removeItem("botApplyLaunch");
        setSocket(null);
      };

      return () => {
        socket.close();
      };
    }
  }, [botApplyLaunch, userData]);

  // FAKE PART
  const fakeLaunch = async () => {
    return {
      status: 200,
      message: "Bot launched successfully",
    };
  };

  const fakeStop = async () => {
    return {
      status: 200,
      message: "Bot stopped successfully",
    };
  };

  // useEffect(() => {
  //   // Fake logs
  //   if (botApplyLaunch) {
  //     const fakeLogs = [
  //       "Bot launched successfully",
  //       "Retrieve 100 jobs..",
  //       "Logging in...",
  //       "Logged in successfully",
  //       "Applying to Job 1",
  //       "Applying to Job 2",
  //       "Applying to Job 3",
  //       "Applying to Job 4",
  //       "Applying to Job 5",
  //       "Applying to Job 6",
  //       "Applying to Job 7",
  //       "Applying to Job 8",
  //       "Applying to Job 9",
  //       "Applying to Job 10",
  //       "Applying to Job 11",
  //       "Applying to Job 12",
  //       "Applying to Job 13",
  //       "Applying to Job 14",
  //       "Applying to Job 15",
  //       "Applying to Job 16",
  //       "Applying to Job 17",
  //       "Applying to Job 18",
  //       "Applying to Job 19",
  //       "Applying to Job 20",
  //       "Applying to Job 21",
  //     ];
  //     let logIndex = 0;

  //     const logIntervalId = setInterval(() => {
  //       if (logIndex < fakeLogs.length) {
  //         setLogs((prevLogs) => [...prevLogs, fakeLogs[logIndex]]);
  //         logIndex++;
  //       } else {
  //         clearInterval(logIntervalId);
  //       }
  //     }, 3000);

  //     return () => {
  //       clearInterval(logIntervalId); // Nettoyez l'intervalle lorsque le bot est arrêté
  //     };
  //   }
  // }, [botApplyLaunch]);

  return (
    <div>
      <div className="flex items-center justify-between w-full xl:w-1/2 xl:mx-auto">
        <LaunchButton diodeStatus={diodeStatus} launcher={handleLaunch} />
        <StopButton diodeStatus={diodeStatus} launcher={handleStop} />
        <ClearLogsButton
          handler={handleClearLogs}
          disabled={logs.length === 0 ? true : false}
        />
      </div>
      <div className="w-full h-full border rounded-lg overflow-hidden shadow-md mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-3 bg-gray-200 text-gray-600">
            <Spinner size="md" />
          </div>
        ) : (
          <div
            className="flex flex-col-reverse h-96 overflow-y-auto"
            ref={scrollableContainerRef}
          >
            <ScrollableFeed forceScroll={true}>
              {logs.length === 0 ? (
                <div className="flex items-center justify-center py-3 bg-gray-200 text-gray-600">
                  No logs
                </div>
              ) : (
                logs.map((log, i) => <LogApplyItem log={log} index={i} />)
              )}
            </ScrollableFeed>
          </div>
        )}
      </div>
      <ToastFeedback message={message} status={diodeStatus} />
    </div>
  );
};
