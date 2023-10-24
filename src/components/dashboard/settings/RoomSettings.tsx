"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Text,
  Button,
  IconButton,
  useDisclosure,
  ModalOverlay,
  Box,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useUserData } from "@/lib/useUserData";
import ToastMessage from "@/components/global/alert/Toast";
import { useSession } from "next-auth/react";
import { DeleteRoom } from "./modal/DeleteRoom";
import { Room } from "@/types/room";
import { MdCheckCircle } from "react-icons/md";
import { DeleteIcon, EmailIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
export const RoomSettings = ({ user }) => {
  // const { userData, error, isLoading } = useUserData();
  const [creating, setCreating] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  // const user = userData?.user;
  const dt = new Date();
  const [date, setDate] = useState(dt.toLocaleDateString());
  // const session = useSession();
  const authToken = Cookies.get("rico_c_tk");
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const [roomData, setRoomData] = useState<{}>({
    Bot: {},
    Services: {},
    Metadata: {},
  });

  const handleCreate = async () => {
    setCreating(true);
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers,
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log(data);
      setRooms((prevRooms) => [...prevRooms, data.rooms]);
      setStatus("success");
      setMessage(data.data.message);
      setCreating(false);
    } else {
      setStatus("error");
      setMessage(data.data.message);
      setCreating(false);
    }
  };
  const getRoomsData = async (roomId) => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    const res = await fetch(`/api/rooms?roomId=${roomId}`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    if (res.status === 200) {
      setRoomData({
        Bot: data.details.deployments,
        Services: data.details.services,
        Metadata: data.details.details,
      });
    }
  };

  useEffect(() => {
    if (user) {
      setRooms(user.rooms);
      if (user.rooms.length > 0) {
        getRoomsData(user.rooms[0].id);
      }
    }
  }, []);


  return (
    <>
      {message && status && (
        <div className="flex items-center justify-center mt-6">
          <ToastMessage message={message} status={status} onClose={onClose} />
        </div>
      )}
      <Stack spacing="4" width="90%" margin="auto">
        {user && rooms.length > 0 ? (
          rooms.map((room) => (
            <Accordion key={room.id} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {room.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <List spacing={3}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            Bot
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <List spacing={3}>
                          {roomData?.Bot &&
                            Array.isArray(roomData.Bot) &&
                            roomData.Bot.map((item) => (
                              <ListItem key={item.metadata.uid}>
                                <ListIcon
                                  as={MdCheckCircle}
                                  color="green.500"
                                />
                                {item.metadata.name}
                              </ListItem>
                            ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            Services
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <List spacing={3}>
                          {" "}
                          {roomData?.Services &&
                            Array.isArray(roomData.Services) &&
                            roomData.Services.map((item) => (
                              <ListItem key={item.metadata.uid}>
                                <ListIcon
                                  as={MdCheckCircle}
                                  color="green.500"
                                />
                                {item.metadata.name}
                              </ListItem>
                            ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                    <Box>
                      <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="Delete Room"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setOverlay(<OverlayOne />);
                          onOpen();
                        }}
                      />
                    </Box>
                  </List>
                </AccordionPanel>
              </AccordionItem>
              <DeleteRoom
                overlay={overlay}
                isOpen={isOpen}
                onClose={onClose}
                room={room}
                roomData={roomData}
              />
            </Accordion>
          ))
        ) : (
          <Button
            onClick={handleCreate}
            size="md"
            colorScheme="blue"
            color="blue.500"
            isLoading={creating}
          >
            Create your first room
          </Button>
        )}
      </Stack>
    </>
  );
};
