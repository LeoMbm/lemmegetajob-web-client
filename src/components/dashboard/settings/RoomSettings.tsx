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
} from "@chakra-ui/react";
import { useUserData } from "@/lib/useUserData";
import ToastMessage from "@/components/global/alert/Toast";
import { useSession } from "next-auth/react";
import { DeleteRoom } from "./modal/DeleteRoom";
import { Room } from "@/types/room";
export const RoomSettings = () => {
  const { userData, error, isLoading } = useUserData();
  const [creating, setCreating] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const user = userData?.user;
  const dt = new Date();
  const [date, setDate] = useState(dt.toLocaleDateString());
  const session = useSession();
  const authToken = session.data?.backendToken;
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

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
      setMessage(data.message);
      setCreating(false);
    } else {
      setStatus("error");
      setMessage(data.message);
      setCreating(false);
    }
  };

  useEffect(() => {
    if (user) {
      setRooms(user.rooms);
    }
  }, [user]);

  return (
    <>
      {message && status && (
        <div className="flex items-center justify-center mt-6">
          <ToastMessage
            message={message}
            status={status}
            onClose={() => false}
          />
        </div>
      )}
      <Stack spacing="4" width="90%" margin="auto">
        {isLoading && <Text>Loading...</Text>}

        {user && rooms.length > 0 ? (
          rooms.map((room) => (
            <Card
              key={room.id}
              size="sm"
              backgroundColor="gray.100"
              textColor="black"
              className="cursor-pointer"
              _hover={{
                backgroundColor: "gray.200",
              }}
              onClick={() => {
                setOverlay(<OverlayOne />);
                onOpen();
              }}
            >
              <CardHeader>
                <Heading size="md">Room: {room.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text>Status: Active</Text>
                <Text>Created At: {date}</Text>
              </CardBody>
              <DeleteRoom
                overlay={overlay}
                isOpen={isOpen}
                onClose={onClose}
                room={room}
              />
            </Card>
          ))
        ) : (
          <Button
            onClick={handleCreate}
            size="md"
            colorScheme="blue"
            color="blue.500"
            isLoading={creating}
          >
            Create you first room
          </Button>
        )}
      </Stack>
    </>
  );
};
