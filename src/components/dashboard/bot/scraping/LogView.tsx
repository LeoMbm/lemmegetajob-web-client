"use client";
import React, { use, useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { LaunchButton } from "../LaunchButton";
import ToastFeedback from "../../Toast";
import { ClearLogsButton } from "../ClearLogsButton";
import { StopButton } from "../StopButton";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogItem } from "./LogItem";
import { useUserData } from "@/lib/useUserData";
import { User } from "@/types/user";
import { Spinner } from "flowbite-react";

const LOG_URL = process.env.NEXT_PUBLIC_LOG_SCRAP_REALTIME_URL;

export const LogView = () => {
  const { userData, error, isLoading } = useUserData();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [botLaunched, setBotLaunched] = useState(false);
  const [namespaces, setNamespaces] = useState<string | null>(null);
  const [deployementName, setDeployementName] = useState<string | null>(null);
  const [diodeStatus, setDiodeStatus] = useState("");
  const [message, setMessage] = useState<string | null>("");
  const session = useSession();
  const authToken = session.data?.backendToken;
  if (isLoading) {
    console.log("Loading logs");
  }
  const user: User = userData?.user;
  const socket_email = user?.email.replace(/[^a-zA-Z0-9]/g, "");
  console.log(socket_email);

  useEffect(() => {
    const savedLogs = localStorage.getItem("logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    const savedDiodeStatus = localStorage.getItem("diodeStatus");
    if (savedDiodeStatus) {
      setDiodeStatus(savedDiodeStatus);
    }

    const savedBotLaunched = localStorage.getItem("botLaunched");
    if (savedBotLaunched) {
      setBotLaunched(true);
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

  const launchInstance = async () => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    const res = await fetch("/api/bot/launch", {
      method: "POST",
      headers,
      body: JSON.stringify({ mode: "scraping" }),
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
      body: JSON.stringify({ mode: "scraping" }),
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
        setBotLaunched(false);
        setDiodeStatus("");
        setLogs([...logs, "Bot stopped successfully."]); // fixed spread argument
        localStorage.removeItem("logs");
        localStorage.removeItem("diodeStatus");
        localStorage.removeItem("botLaunched");
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
        setBotLaunched(true);
        localStorage.setItem("botLaunched", "true");
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

  // useEffect(() => {
  //   if (botLaunched && socket_email) {
  //     const socket = new WebSocket(`${LOG_URL}/${socket_email}/scraping`);

  //     setSocket(socket);

  //     socket.onopen = () => {
  //       console.log("WebSocket connection established.");
  //     };

  //     socket.onmessage = (event) => {
  //       const message = event.data;
  //       console.log("Received message:", message);

  //       if (message) {
  //         setLogs((prevLogs) => [...prevLogs, message]);
  //       } else if (message.error) {
  //         console.error("Error:", message.error);
  //       }
  //     };

  //     socket.onclose = () => {
  //       console.log("WebSocket connection closed.");
  //       setDiodeStatus("");
  //       setBotLaunched(false);
  //       localStorage.removeItem("botLaunched");
  //       setSocket(null);
  //     };

  //     return () => {
  //       socket.close();
  //     };
  //   }
  // }, [botLaunched]);

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

  useEffect(() => {
    // Fake logs
    if (botLaunched) {
      const fakeLogs = [
        "Bot launched successfully",
        "Loading configuration...",
        "Logging in...",
        "Logged in successfully",
        "Searching job for Backend Developer in Brussels...",
        "Job scraped successfully 1",
        "Job scraped successfully 2",
        "Job scraped successfully 3",
        "Job scraped successfully 4",
        "Job scraped successfully 5",
        "Job scraped successfully 6",
        "Job scraped successfully 7",
        "Job scraped successfully 8",
        "Job scraped successfully 9",
        "Job scraped successfully 10",
        "Job scraped successfully 11",
        "Job scraped successfully 12",
        "Job scraped successfully 13",
        "Job scraped successfully 14",
        "Job scraped successfully 15",
        "No more jobs found",
        "Jobs saved in database",
        "Bot stopped successfully",
      ];
      let logIndex = 0;

      const logIntervalId = setInterval(() => {
        if (logIndex < fakeLogs.length) {
          setLogs((prevLogs) => [...prevLogs, fakeLogs[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logIntervalId); // Arrêtez l'intervalle lorsque tous les logs ont été ajoutés
        }
      }, 3000);

      return () => {
        clearInterval(logIntervalId); // Nettoyez l'intervalle lorsque le bot est arrêté
      };
    }
  }, [botLaunched]);

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
                logs.map((log, i) => <LogItem log={log} index={i} />)
              )}
            </ScrollableFeed>
          </div>
        )}
      </div>
      <ToastFeedback message={message} status={diodeStatus} />
    </div>
  );
};
