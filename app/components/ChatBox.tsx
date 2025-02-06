"use client";

import { useState, useEffect } from "react";
import { socket } from "../lib/socketClient";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "../globals.css";

export default function ChatBox() {
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{
    [room: string]: { sender: string; message: string }[];
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Connect to the server and listen for events
  useEffect(() => {
    // Connect to the server
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Emit to get available rooms when the component mounts
    socket.emit("get-available-rooms");

    // Listen for updates to available rooms
    socket.on("availableRooms", (rooms: string[]) => {
      setRooms(rooms);
    });

    // Listen for user joined event
    socket.on("user_joined", (message, room) => {
      console.log("User joined:", message);

      setMessages((prevMessages) => {
        const roomMessages = prevMessages[room] || [];
        return {
          ...prevMessages,
          [room]: [...roomMessages, { sender: "system", message }],
        };
      });
    });

    // Listen for user leaving the room
    socket.on("leave-room", ({ room, userName }) => {
      console.log(`User ${userName} left room ${room}`);

      setMessages((prevMessages) => {
        const roomMessages = prevMessages[room] || [];
        return {
          ...prevMessages,
          [room]: [
            ...roomMessages,
            { sender: "system", message: `${userName} left the room.` },
          ],
        };
      });
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("availableRooms");
      socket.off("user_joined");
      socket.off("leave-room");
      socket.off("newMessage");
      socket.off("messageHistory");
    };
  }, []);

  // Fetch username from localStorage when component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
    }
    setLoading(false); // Set loading to false once the username is retrieved
  }, []);

  // Handle incoming messages from the server
  useEffect(() => {
    const handleNewMessage = ({ sender, message, room }: { sender: string; message: string; room: string }) => {
      console.log(`New message from ${sender}: ${message}`);
      setMessages((prevMessages) => {
        const roomMessages = prevMessages[room] || [];
        return {
          ...prevMessages,
          [room]: [...roomMessages, { sender, message }],
        };
      });
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // Handle room joining and message history
  useEffect(() => {
    if (room && userName && !joined) {
      console.log("Emitting join-room", { room, userName });
      socket.emit("join-room", { room, userName });
      setJoined(true);

      // Fetch message history for the room after joining
      socket.emit("get-message-history", room);
    }

    // Listen for message history and update the state
    socket.on("messageHistory", (messages, room) => {
      console.log("Message history:", messages, room);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: messages, // Update the messages for the specific room
      }));
    });

    // Cleanup messageHistory listener when the room changes
    return () => {
      socket.off("messageHistory");
    };
  }, [room, userName, joined]);

  // Handle username changes (if applicable)
  useEffect(() => {
    if (userName) {
      console.log("Username is available: ", userName);
    } else {
      console.log("No username set yet.");
    }
  }, [userName]);

  // Send message logic
  const handleSendMessage = (message: any) => {
    if (!room || !userName) {
      console.error("Room or UserName is missing");
      return;
    }

    const data = { room, message, sender: userName };

    // Save message locally (optimistic UI update)
    setMessages((prev) => {
      const roomMessages = prev[room] || [];
      return {
        ...prev,
        [room]: [...roomMessages, { sender: userName, message }],
      };
    });

    // Emit message to the server
    socket.emit("message", data);
  };

  const handleSelectRoom = (selectedRoom: string) => {
    setRoom(selectedRoom);
  };

  const handleCreateRoom = () => {
    if (room) {
      socket.emit("createRoom", room); // Emit the new room to the server
      setRoom(""); // Clear the input field
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", room); // Handle leaving a room
    setRoom("");
    setJoined(false);
  };

  const handleRemoveRoom = (roomToRemove: string) => {
    socket.emit("removeRoom", roomToRemove); // Emit room removal to the server
    setRooms((prevRooms) => prevRooms.filter((r) => r !== roomToRemove)); // Update the rooms list after removing
  };

  const handleJoinRoom = () => {
    if (room && userName && !joined) {
      console.log("Emitting join-room", { room, userName });
      socket.emit("join-room", { room, userName });
      setJoined(true);

      // Fetch message history for the room after joining
      socket.emit("get-message-history", room);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading indicator
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="fixed bottom-4 left-4 h-14 px-6 m-2 text-lg text-white transition-colors duration-150 bg-teal-500 rounded-lg focus:shadow-outline hover:bg-teal-600"
      >
        Open Chat Room
      </button>

      {isModalOpen && (
        <div className="fixed bottom-4 left-4 w-50 max-w-3xl mx-auto p-4 bg-gray-800 border rounded-lg">
          <div className="bg-gray-800 p-6 rounded-lg w-80 sm:w-96 max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Welcome {userName || "Guest"}!
            </h3>

            {!joined ? (
              <div className="flex flex-col">
                <div className="mt-2 w-full max-h-[80px] overflow-y-auto">
                  <h2 className="mt-2 font-bold text-white text-sm">Available Rooms listed:</h2>
                  <br />
                  <ul className="list-disc pl-4">
                    {rooms.map((availableRoom) => (
                      <li key={availableRoom} className="mt-2">
                        <button
                          onClick={() => handleSelectRoom(availableRoom)}
                          className={`text-base ${room === availableRoom
                            ? "bg-blue-500 text-white"
                            : "text-blue-500"
                            } p-2 rounded-lg`}
                        >
                          {availableRoom}
                        </button>
                        <button
                          className="text-red-500 ml-2"
                          onClick={() => handleRemoveRoom(availableRoom)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter new room name"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-42 h-10 px-4 py-2 mb-4 border-2 text-black text-xs placeholder-gray-800 rounded-lg"
                  />
                  <button
                    className="w-32 h-11 px-4 py-2 text-white text-xs bg-green-500 rounded-lg"
                    onClick={handleCreateRoom}
                  >
                    Create Room
                  </button>
                </div>

                <button
                  className="p-2 mt-4 text-white bg-blue-500 rounded-lg"
                  onClick={handleJoinRoom}
                  disabled={!room || !userName}
                >
                  Join Room
                </button>
              </div>
            ) : (
              <div className="w-full max-w-3xl mx-auto">
                <h1 className="mb-4 text-md text-white">You are in room: {room}</h1>
                <div className="h-[200px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 text-black rounded-lg">
                  <div>
                    {messages[room]?.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        sender={msg.sender}
                        message={msg.message}
                        isOwnMessage={msg.sender === userName}
                      />
                    ))}
                  </div>
                  <ChatForm onSendMessage={handleSendMessage} />
                </div>

                <button className="mt-4 text-red-500" onClick={handleLeaveRoom}>
                  Exit Chat
                </button>
              </div>
            )}

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
