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
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";

const customTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    inner:
      "flex-grow h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-5 px-3 dark:bg-gray-800",
  },
  itemGroup:
    "space-y-2 border-t border-gray-200 pt-4 mt-14 first:border-t-0 first:pt-0 dark:border-gray-700",
};

export default function SidebarMobile({
  isSidebarOpen,
  isPro,
}: {
  isSidebarOpen: boolean;
  isPro: boolean;
}) {
  const activePath = usePathname();
  const [botDropdownOpen, setBotDropdownOpen] = useState(false);

  const toggleBotDropdown = () => {
    setBotDropdownOpen(!botDropdownOpen);
  };

  const handleSidebarItemClick = () => {
    if (isSidebarOpen) {
      isSidebarOpen = false;
    }
  };

  const handleLogout = () => {
    signOut();
    Cookies.remove("rico_c_tk");
  };

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        isSidebarOpen = false;
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <div
      className={`h-full ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
    >
      <Sidebar
        theme={customTheme}
        aria-label="Sidebar with content separator example"
        className={`w-64 flex-shrink-0 ${
          isSidebarOpen ? "" : "hidden sm:block"
        }`}
      >
        <Sidebar.Items className="h-full flex flex-col justify-between">
          <Sidebar.ItemGroup className="space-y-2 border-t border-gray-200 pt-4 first:mt-14 first:border-t-0 first:pt-0 dark:border-gray-700">
            <Sidebar.Item
              href="/dashboard"
              icon={HiChartPie}
              active={activePath === "/dashboard"}
              onClick={handleSidebarItemClick}
            >
              <p>Dashboard</p>
            </Sidebar.Item>
            <Sidebar.Item
              icon={FaRobot}
              active={activePath === "/dashboard/bot"}
              onClick={toggleBotDropdown}
              className="cursor-pointer"
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
                  className="text-sm py-1 pl-4"
                >
                  <p>Configuration</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/scraping"
                  icon={HiInbox}
                  className="text-sm py-1 pl-4"
                >
                  <p>Scraping</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/database"
                  icon={HiTable}
                  className="text-sm py-1 pl-4"
                >
                  <p>Database</p>
                </Sidebar.Item>
                <Sidebar.Item
                  href="/dashboard/bot/apply"
                  icon={HiArrowSmRight}
                  className="text-sm py-1 pl-4"
                >
                  <p>Apply</p>
                </Sidebar.Item>
              </>
            )}
            <Sidebar.Item href="/dashboard/profile" icon={HiUser}>
              <p>Profile</p>
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard/settings"
              icon={RiSettings3Fill}
              active={activePath === "/dashboard/settings"}
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
            <Sidebar.Item href="#" icon={HiChartPie}>
              <p>{isPro ? "Manage your plan" : "Upgrade"}</p>
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards}>
              <p>Documentation</p>
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards}>
              <p>Help</p>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
