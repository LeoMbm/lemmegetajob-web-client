"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Input,
} from "@chakra-ui/react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import ToastMessage from "@/components/global/alert/Toast";
import { useSession } from "next-auth/react";
export const DeleteRoom = ({ overlay, isOpen, onClose, room, roomData }) => {
  const [onDelete, setOnDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameConfirmation, setNameConfirmation] = useState("");
  const session = useSession();
  const authToken = session.data?.backendToken;
  const handleDelete = async () => {
    setLoading(true);
    const value = nameConfirmation;
    const to_confirm = "DELETE/" + room.name;
    console.log(value);
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    if (value !== to_confirm) {
      setStatus("error");
      setMessage("Should be " + to_confirm);
      setLoading(false);
      return;
    } else {
      const id = room.id;
      console.log(id);
      const res = await fetch(`/api/rooms?roomId=${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setMessage(data.message);
        setStatus("success");
        setLoading(false);
        onClose();
      } else {
        setStatus("error");
        setMessage(data.message);
        setLoading(false);
      }
    }
  };

  console.log(roomData);
  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setOnDelete(false);
        }}
      >
        {overlay}
        <ModalContent>
          {onDelete ? (
            <>
              <ModalHeader>
                Are you sure you want to delete this room?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Please note that once deleted, you won't be able to create a
                  new room for the next 24 hours.
                </Text>
                <FormControl className="mt-2">
                  <FormLabel>Type: "DELETE/{room.name}"to confirm</FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    className="rounded-lg"
                    color="black"
                    onChange={(e) => setNameConfirmation(e.target.value)}
                  />
                  <FormHelperText>Be sure before do that.</FormHelperText>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button isLoading={loading} onClick={handleDelete}>
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    setOnDelete(false);
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>{room.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <List spacing={3}>
                  {Object.keys(room).map((key, value) => (
                    <ListItem key={key}>
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      {key}: {room[key]}
                    </ListItem>
                  ))}
                </List>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setOnDelete(true)}>Delete Room</Button>
                <Button
                  marginLeft="1em"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    setOnDelete(false);
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
          {status === "error" && (
            <ToastMessage
              message={message}
              status={status}
              onClose={() => false}
            />
          )}
        </ModalContent>
      </Modal>
      {status === "success" && (
        <ToastMessage message={message} status={status} onClose={() => false} />
      )}
    </>
  );
};
