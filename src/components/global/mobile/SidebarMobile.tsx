'use client';

import { Sidebar } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import { FaRobot } from 'react-icons/fa';
import { RiSettings3Fill, RiToolsFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {MdKeyboardArrowDown} from 'react-icons/md'
import {FaTools} from 'react-icons/fa'

const customTheme: CustomFlowbiteTheme['sidebar'] = {
    root: {
      inner: 'flex-grow h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-5 px-3 dark:bg-gray-800',
    },
    itemGroup: "space-y-2 border-t border-gray-200 pt-4 mt-14 first:border-t-0 first:pt-0 dark:border-gray-700"
  };

export default function SidebarMobile({ isSidebarOpen }: { isSidebarOpen: boolean }) {
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

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [isSidebarOpen]);

  return (
    <div className={`h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
    <Sidebar theme={customTheme} aria-label="Sidebar with content separator example" className={`w-64 flex-shrink-0 ${isSidebarOpen ? '' : 'hidden sm:block'}`}>
      <Sidebar.Items className='h-full flex flex-col justify-between'> 
        <Sidebar.ItemGroup className='space-y-2 border-t border-gray-200 pt-4 first:mt-14 first:border-t-0 first:pt-0 dark:border-gray-700' >
          <Sidebar.Item
            href="/dashboard"
            icon={HiChartPie}
            active={activePath === '/dashboard'}
            onClick={handleSidebarItemClick}
          >
            <p>
              Dashboard
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            icon={FaRobot}
            active={activePath === '/dashboard/bot'}
            onClick={toggleBotDropdown}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
                <p className="mr-2">
                    Bot
                </p>
                
                <MdKeyboardArrowDown className={`h-5 w-5 transition-transform duration-200 transform ${botDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </Sidebar.Item>
          {botDropdownOpen && (
                            <>
                                <Sidebar.Item
                                    href="#"
                                    icon={RiToolsFill}
                                     className="text-sm py-1 pl-4"
                                >
                                    <p>
                                        Configuration
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="#"
                                    icon={HiInbox}
                                     className="text-sm py-1 pl-4"
                                >
                                    <p>
                                        Scraping
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="#"
                                    icon={HiTable}
                                     className="text-sm py-1 pl-4"
                                >
                                    <p>
                                        Database
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="#"
                                    icon={HiArrowSmRight}
                                     className="text-sm py-1 pl-4"
                                >
                                    <p>
                                        Apply
                                    </p>
                                </Sidebar.Item>
                            </>
                        )}
          <Sidebar.Item
            href="/dashboard/profile"
            icon={HiUser}
          >
            <p>
              Profile
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="/dashboard/settings"
            icon={RiSettings3Fill}
            active={activePath === '/dashboard/settings'}
          >
            <p>
              Settings
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiArrowSmRight}
          >
            <p>
              Sign Out
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="mt-auto">
          <Sidebar.Item
            href="#"
            icon={HiChartPie}
          >
            <p>
              Upgrade to Pro
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiViewBoards}
          >
            <p>
              Documentation
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiViewBoards}
          >
            <p>
              Help
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>
  )
}


