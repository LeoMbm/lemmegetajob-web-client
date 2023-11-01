"use client";

import { Sidebar } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { FaRobot } from "react-icons/fa";
import { RiSettings3Fill, RiToolsFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { Button } from "@chakra-ui/react";

const customTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    inner:
      "flex-grow h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-5 px-3 dark:bg-gray-800",
  },
};

export default function ContentSeparator({ user }) {
  const activePath = usePathname();
  const [botDropdownOpen, setBotDropdownOpen] = useState(
    activePath.startsWith("/dashboard/bot")
  );
  const [bloading, setBLoading] = useState(false);
  const [billingUrl, setBillingUrl] = useState("");

  const toggleBotDropdown = () => {
    setBotDropdownOpen(!botDropdownOpen);
  };

  const handleLogout = () => {
    signOut();
    Cookies.remove("rico_c_tk");
  };

  useEffect(() => {
    const handleBillingPortal = async () => {
      setBLoading(true);
      const response = await fetch("/api/portal", {
        method: "GET",
      });
      if (response.status === 200) {
        const json = await response.json();
        setBillingUrl(json.url);

        setBLoading(false);
      } else {
        setBLoading(false);
      }
    };

    handleBillingPortal();
  }, []);

  return (
    <div className="mobile:hidden h-full">
      <Sidebar
        theme={customTheme}
        aria-label="Sidebar with content separator example"
        className="w-64 flex-shrink-0"
      >
        <Sidebar.Items className="h-full flex flex-col justify-between">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/dashboard"
              icon={HiChartPie}
              active={activePath === "/dashboard"}
              className={activePath === "/dashboard" ? "active-item" : ""}
            >
              <p>Dashboard</p>
            </Sidebar.Item>
            <Sidebar.Item
              icon={FaRobot}
              active={activePath === "/dashboard/bot"}
              onClick={toggleBotDropdown}
              className="cursor-pointer"
              href={null}
            >
              <div className="flex items-center justify-between">
                <p className="mr-2">Bot</p>

                <MdKeyboardArrowDown
                  className={`h-5 w-5 transition-transform duration-200 transform ${
                    botDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </Sidebar.Item>
            {botDropdownOpen && (
              <>
                <Sidebar.Item
                  href="/dashboard/bot/configuration"
                  icon={RiToolsFill}
                  className={
                    activePath === "/dashboard/bot/configuration"
                      ? "active-item py-1 pl-4"
                      : "text-sm py-1 pl-4"
                  }
                >
                  <p>Configuration</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/scraping"
                  icon={HiInbox}
                  className={
                    activePath === "/dashboard/bot/scraping"
                      ? "active-item py-1 pl-4"
                      : "text-sm py-1 pl-4"
                  }
                >
                  <p>Scraping</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/database"
                  icon={HiTable}
                  className={
                    activePath === "/dashboard/bot/database"
                      ? "active-item py-1 pl-4"
                      : "text-sm py-1 pl-4"
                  }
                >
                  <p>Database</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/apply"
                  icon={HiArrowSmRight}
                  className={
                    activePath === "/dashboard/bot/apply"
                      ? "active-item py-1 pl-4"
                      : "text-sm py-1 pl-4"
                  }
                >
                  <p>Apply</p>
                </Sidebar.Item>
              </>
            )}
            <Sidebar.Item
              href="/dashboard/profile"
              icon={HiUser}
              className={
                activePath === "/dashboard/profile" ? "active-item" : ""
              }
            >
              <p>Profile</p>
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard/settings"
              icon={RiSettings3Fill}
              className={
                activePath === "/dashboard/settings" ? "active-item" : ""
              }
            >
              <p>Settings</p>
            </Sidebar.Item>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  data-testid="flowbite-sidebar-item-icon"
                  className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="px-3 flex-1 whitespace-nowrap">
                  <p>Sign Out</p>
                </span>
              </button>
            </li>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className="mt-auto">
            <Sidebar.Item
              icon={HiChartPie}
              href={user?.isPro ? billingUrl : "#"}
            >
              <p>{user?.isPro ? "Manage your plan" : "Upgrade"}</p>
            </Sidebar.Item>
            <Sidebar.Item
              href="https://ricodocs-58lic.notaku.site/"
              icon={HiViewBoards}
              target="_blank"
            >
              <p>Documentation</p>
            </Sidebar.Item>
            <Sidebar.Item
              href="https://rico-2gfp4.desk.notaku.site/"
              target="_blank"
              icon={HiViewBoards}
            >
              <p>Help Center</p>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
