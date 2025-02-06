"use client";

import { useState, useEffect } from "react";
import { socket } from "../lib/socketClient"; // assuming this is your socket connection setup
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "../globals.css";

export default function ChatBox() {
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  //const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  const [messages, setMessages] = useState<{ [key: string]: { sender: string; message: string }[] }>({}); // Messages are stored per room


  useEffect(() => {
    // Connected to the server
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.emit("get-available-rooms");

    // Emit to get available rooms when component mounts
    socket.on("availableRooms", (rooms: string[]) => {
      setRooms(rooms);
    });

    // Listen for messages and update state only for the current room
    socket.on('message', ({ room, sender, message }) => {
      console.log(`Received message from ${sender} in room ${room}: ${message}`);

      if (room === currentRoom) { // Only update messages for the current room
        setMessages((prevMessages) => {
          const roomMessages = prevMessages[room] || []; // Initialize an empty array if room doesn't exist yet
          return {
            ...prevMessages,
            [room]: [...roomMessages, { sender, message }], // Add the new message to the room's message list
          };
        });
      }
    });


    // Message history from the server (on joining a room)
    socket.on('messageHistory', (room, messages) => {
      console.log('Message history for ${room}:', messages);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: messages, // Update message history for the specific room
      }));
    });

    // User join/leave system messages (either join-room or leave-room)
    socket.on('join-room', ({ room, userName }) => {
      console.log(`User ${userName} joined room ${room}`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: [
          ...(prevMessages[room] || []),
          { sender: "system", message: `${userName} joined the room.` },
        ],
      }));
    });

    socket.on('leave-room', ({ room, userName }) => {
      console.log(`User ${userName} left room ${room}`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: [
          ...(prevMessages[room] || []), // Get the existing messages for the room or use an empty array
          { sender: "system", message: `${userName} left the room.` },
        ],
      }));
    });


    // User joined event handling (if you need this separately)
    socket.on("user_joined", (message) => {
      console.log("User joined event received:", message);
      setMessages((prevMessages) => {
        // Ensure that currentRoom exists in prevMessages, or initialize it as an empty array
        const roomMessages = prevMessages[currentRoom] || [];

        // Return updated state by adding the new message for the specific room
        return {
          ...prevMessages, // spread the previous state
          [currentRoom]: [...roomMessages, { sender: "system", message }], // add the new system message
        };
      });
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off("availableRooms");
      socket.off("message");
      socket.off("messageHistory");
      socket.off("join-room");
      socket.off("leave-room");
      socket.off("user_joined");
    };
  }, [userName]);


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  // Join room logic
  const handleJoinRoom = () => {
    if (room && userName && !joined) {
      console.log("Emitting join-room", { room, userName }); // Debug log
      socket.emit("join-room", { room, userName });
      setJoined(true);
    }
  };

  // //handle receiving messages
  // const handleReceiveMessage = (message: string) => {
  //   socket.emit("message", message);
  // };

  // Send message logic
  const handleSendMessage = (message: string) => {
    // Data to send to the server
    const data = { room, message, sender: userName };

    // Add the message to the UI state (only for the sender)
    setMessages((prevMessages) => {
      const roomMessages = prevMessages[room] || [];
      return {
        ...prevMessages, // Retain previous messages for all rooms
        [room]: [...roomMessages, { sender: userName, message }], // Add new message to the current room
      };
    });

    // Emit the message to the server for broadcasting
    socket.emit("message", data);
  };

  // Select a room from the list
  const handleSelectRoom = (selectedRoom: string) => {
    setRoom(selectedRoom);
  };

  // Create a new room
  const handleCreateRoom = () => {
    if (room) {
      socket.emit("createRoom", room); // Emit the new room to the server
      setRoom(""); // Clear the input field
    }
  };

  // Remove a room
  const handleRemoveRoom = (roomToRemove: string) => {
    socket.emit("removeRoom", roomToRemove); // Emit room removal to the server
    setRooms((prevRooms) => prevRooms.filter((r) => r !== roomToRemove)); // Update the rooms list after removing
  };

  // Handle leaving the room
  const handleLeaveRoom = () => {
    socket.emit("leave-room", room); // Handle leaving a room
    setRoom("");
    setJoined(false);
  };

  // Open the chat modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the chat modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const roomMessages = messages[currentRoom] || [];

  return (
    <div>
      {/* Button to open the chat modal positioned at the lower-right */}
      <button
        onClick={openModal}
        className="fixed bottom-4 left-4 h-14 px-6 m-2 text-lg text-white transition-colors duration-150 bg-teal-500 rounded-lg focus:shadow-outline hover:bg-teal-600"
      >
        Open Chat Room
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed bottom-4 left-4 w-50 max-w-3xl mx-auto p-4 bg-gray-800 border rounded-lg">
          <div className="bg-gray-800 p-6 rounded-lg w-80 sm:w-96 max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Welcome {userName || "Guest"}!
            </h3>

            {/* If not joined, show room list and userName input */}
            {!joined ? (
              <div className="flex flex-col">
                {/* Available Rooms */}
                <div className="mt-2 w-full max-h-[80px] overflow-y-auto">
                  <h2 className="mt-2 font-bold text-white text-sm">
                    Available Rooms listed:
                  </h2>
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

                {/* Create Room */}
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

                {/* Join Room */}
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
                <h1 className="mb-4 text-md text-white">
                  You are in room: {room}
                </h1>
                <div className="h-[200px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 text-black rounded-lg">
                  <div>
                    {(messages[room] || []).map((msg, index) => (
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

            {/* Close Modal Button */}
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
