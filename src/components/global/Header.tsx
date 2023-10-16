"use client";

import { Avatar, Dropdown, Navbar, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import SidebarMobile from "./mobile/SidebarMobile";
import { useSession } from "next-auth/react";
import { useUserData } from "@/lib/useUserData";
import { User } from "@/types/user";

export default function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [hiddenHeader, setHiddenHeader] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { userData, error, isLoading } = useUserData();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > 50) {
        if (prevScrollPos > currentScrollPos) {
          setHiddenHeader(false);
        } else {
          setHiddenHeader(true);
        }
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const user: User = userData?.user;

  return (
    <>
      <Navbar
        fluid
        className={`px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 bg-gray-50 fixed top-0 left-0 right-0 z-50 ${
          hiddenHeader ? "-translate-y-full" : "translate-y-0"
        } transition-transform ease-in-out duration-300`}
      >
        <Navbar.Brand href="https://ricosaas.eu/">
          <img
            src="https://ricosaas.eu/static/screenshots/logo.png"
            className="h-10 mr-3"
            alt="Rico Logo"
          />
          <span className="self-center whitespace-nowrap text-xl text-black font-semibold dark:text-white">
            RICO
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <div className="mobile:hidden">
            <Dropdown
              inline
              label={
                <Avatar alt="User settings" bordered color="gray" rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    user.first_name + " " + user.last_name
                  )}
                </span>
                <span className="block truncate text-sm font-medium">
                  {isLoading ? <Spinner size="xs" /> : user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item href="/dashboard/profile">Profile</Dropdown.Item>
              <Dropdown.Item href="/dashboard/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
          <Navbar.Toggle onClick={toggleSidebar} />
        </div>
      </Navbar>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25 z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <SidebarMobile isSidebarOpen={isSidebarOpen} />
      </div>
    </>
  );
}
