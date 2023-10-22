"use client";

import {
  Avatar,
  AvatarBadge,
  Box,
  Image,
  Text,
  Tooltip,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserData } from "@/lib/useUserData";
import { User } from "@/types/user";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";
import SidebarMobile from "./mobile/SidebarMobile";
import { useRouter } from "next/navigation";
export default function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [hiddenHeader, setHiddenHeader] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { userData, error, isLoading } = useUserData();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

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
  console.log(user);

  return (
    <>
      <Box
        className={`px-2 py-2.5  dark:bg-gray-800 sm:px-4 bg-gray-50 fixed top-0 left-0 right-0 z-50 ${
          hiddenHeader ? "-translate-y-full" : "translate-y-0"
        } transition-transform ease-in-out duration-300`}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Link href="https://ricosaas.eu/">
          <Box display="flex" alignItems="center">
            <Image
              src="https://ricosaas.eu/static/screenshots/logo.png"
              alt="Rico Logo"
              h="10"
              mr="3"
            />
            <Text
              fontSize="xl"
              fontWeight="semibold"
              color="black"
              whiteSpace="nowrap"
            >
              RICO
            </Text>
          </Box>
        </Link>
        <Box display="flex" alignItems="center" className="mobile:hidden">
          <Switch
            colorScheme="blue"
            size="lg"
            mr="1em"
            onClick={toggleColorMode}
          />
          <Menu>
            <Tooltip
              label={
                user?.rooms.length > 0
                  ? "Connected to " + user.rooms[0].name
                  : "You are not connected to any room yet"
              }
              placement="auto"
            >
              <MenuButton>
                <Avatar size="md">
                  {user?.rooms.length > 0 ? (
                    <AvatarBadge boxSize="1em" bg="green.500" />
                  ) : (
                    <AvatarBadge boxSize="1em" bg="red.500" />
                  )}
                </Avatar>
              </MenuButton>
            </Tooltip>
            <MenuList>
              <MenuItem cursor="default">
                <Box display="flex" flexDir="column" alignItems="flex-start">
                  {isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        whiteSpace="nowrap"
                        display="block"
                      >
                        {user.first_name + " " + user.last_name}
                      </Text>
                      <Text fontSize="sm" whiteSpace="nowrap" display="block">
                        {user.email}
                      </Text>
                    </>
                  )}
                </Box>
              </MenuItem>
              <MenuItem as="a" href="/dashboard/profile">
                Profile
              </MenuItem>
              <MenuItem as="a" href="/dashboard/settings">
                Settings
              </MenuItem>
              <MenuItem onClick={() => alert("Log out")}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        {isSidebarOpen ? (
          <CloseIcon
            w={4}
            h={4}
            display={{ base: "block", md: "none" }}
            onClick={toggleSidebar}
            cursor="pointer"
            color="black"
          />
        ) : (
          <HamburgerIcon
            w={6}
            h={6}
            display={{ base: "block", md: "none" }}
            onClick={toggleSidebar}
            cursor="pointer"
            color="black"
          />
        )}
      </Box>
      <Box
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25 z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Le contenu de votre SidebarMobile */}
        <SidebarMobile isSidebarOpen={isSidebarOpen} />
      </Box>
    </>
  );
}
