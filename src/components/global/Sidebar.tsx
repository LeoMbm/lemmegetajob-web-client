'use client';

import { Sidebar } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import { FaRobot } from 'react-icons/fa';
import { RiSettings3Fill, RiToolsFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {MdKeyboardArrowDown} from 'react-icons/md'
import {FaTools} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'

const customTheme: CustomFlowbiteTheme['sidebar'] = {
    root: {
      inner: 'flex-grow h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-5 px-3 dark:bg-gray-800',
    }
  };
  
export default function ContentSeparator() {
    const activePath = usePathname();
    const [botDropdownOpen, setBotDropdownOpen] = useState(activePath.startsWith('/dashboard/bot'));
    
    const toggleBotDropdown = () => {
        setBotDropdownOpen(!botDropdownOpen);
    };

  return (
    <div className="mobile:hidden h-full">
    <Sidebar theme={customTheme} aria-label="Sidebar with content separator example" className="w-64 flex-shrink-0" >
      <Sidebar.Items className='h-full flex flex-col justify-between'> 
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/dashboard"
            icon={HiChartPie}
            active={activePath === '/dashboard'}
            className={activePath === '/dashboard' ? 'active-item' : ''}
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
                                    href="/dashboard/bot/configuration"
                                    icon={RiToolsFill}
                                    className={activePath === '/dashboard/bot/configuration' ? 'active-item py-1 pl-4' : 'text-sm py-1 pl-4'}
                                     
                                >
                                    <p>
                                        Configuration
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="/dashboard/bot/scraping"
                                    icon={HiInbox}
                                    className={activePath === '/dashboard/bot/scraping' ? 'active-item py-1 pl-4' : 'text-sm py-1 pl-4'}
                                >
                                    <p>
                                        Scraping
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="/dashboard/bot/database"
                                    icon={HiTable}
                                    className={activePath === '/dashboard/bot/database' ? 'active-item py-1 pl-4' : 'text-sm py-1 pl-4'}
                                >
                                    <p>
                                        Database
                                    </p>
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="/dashboard/bot/apply"
                                    icon={HiArrowSmRight}
                                    className={activePath === '/dashboard/bot/apply' ? 'active-item py-1 pl-4' : 'text-sm py-1 pl-4'}
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
            className={activePath === '/dashboard/profile' ? 'active-item' : ''}
          >
            <p>
              Profile
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="/dashboard/settings"
            icon={RiSettings3Fill}
            className={activePath === '/dashboard/settings' ? 'active-item' : ''}
          >
            <p>
              Settings
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={FiLogOut}
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


