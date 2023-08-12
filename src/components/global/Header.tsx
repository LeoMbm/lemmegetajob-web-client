'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import SidebarMobile from './mobile/SidebarMobile';

export default function Header() {

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [hiddenHeader, setHiddenHeader] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
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
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [prevScrollPos]);
    
  return (
    <>
    <Navbar
      fluid
      className={`px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 bg-gray-50 fixed top-0 left-0 right-0 z-50 ${
        hiddenHeader ? '-translate-y-full' : 'translate-y-0'
      } transition-transform ease-in-out duration-300`}
    >
      <Navbar.Brand href="https://flowbite-react.com">
        <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="https://flowbite.com/docs/images/logo.svg"
        />
        <span className="self-center whitespace-nowrap text-xl text-black font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <div className='mobile:hidden'>
        <Dropdown
          inline
          label={
              <Avatar 
              alt="User settings" 
              bordered
              color="gray" 
          rounded/>
        }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              John Doe
            </span>
            <span className="block truncate text-sm font-medium">
              name@gmail.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item href='/dashboard/profile'>
            Profile
          </Dropdown.Item>
          <Dropdown.Item href='/dashboard/settings'>
            Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            Sign out
          </Dropdown.Item>
        </Dropdown>
        </div>
        <Navbar.Toggle onClick={toggleSidebar} />
      </div>
    </Navbar>
    <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25 z-40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <SidebarMobile isSidebarOpen={isSidebarOpen} />
    </div>
    </>
  )
}


