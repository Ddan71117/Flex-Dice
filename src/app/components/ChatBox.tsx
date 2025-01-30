"use client";

import { useState, useEffect } from "react";
import { socket } from "../lib/socketClient"; // assuming this is your socket connection setup
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import "../globals.css";

export default function ChatBox() {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);  // Store available rooms
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [userName, setUserName] = useState("");

  // Fetch available rooms when the component mounts
  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Get available rooms from the server when the component is mounted
    socket.emit("get-available-rooms");

    // Listen for updates to the available rooms
    socket.on("availableRooms", (rooms: string[]) => {
      setRooms(rooms);
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message: string) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("availableRooms");
      socket.off("message");
      socket.off("user_joined");
    };
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const handleSelectRoom = (selectedRoom: string) => {
    setRoom(selectedRoom);
  };

  const handleCreateRoom = () => {
    if (room) {
      socket.emit("createRoom", room);  // Emit the new room to the server
      setRoom("");  // Clear the input field
    }
  };

  const handleRemoveRoom = (roomToRemove: string) => {
    socket.emit("removeRoom", roomToRemove); // Emit room removal to the server
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", room); // Handle leaving a room
    setRoom("");
    setJoined(false);
  };

  return (
    <div className="fixed bottom-4 left-4 w-50 max-w-3xl mx-auto p-4 bg-white border rounded-lg">
      {!joined ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900">Chat Room</h1>
          <div className="w-64 px-4 py-2 mb-4 border-2 text-black placeholder-gray-800 rounded-l bold text-lg bg-gray-200">
            Player: {userName}
          </div>

          {/* Available Rooms - Scrollable */}
          <div className="mt-4 w-full max-h-[80px] overflow-y-auto"> 
            <h2 className="text-lg font-bold text-black">Available Rooms:</h2>
            <ul className="list-disc pl-4">
              {rooms.map((availableRoom) => (
                <li key={availableRoom} className="mt-2">
                  <button
                    onClick={() => handleSelectRoom(availableRoom)}
                    className={`text-base ${
                      room === availableRoom
                        ? "bg-blue-500 text-white" // Highlight the selected room
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

          {/* Create a Room */}
          <div className="mt-4">
            {/* <h2 className="text-xl">Create a new room:</h2> */}
            <input
              type="text"
              placeholder="Enter new room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-64 px-4 py-2 mb-4 border-2 text-black placeholder-gray-800 rounded-lg"
            />
            <button
              className="p-2 mt-2 text-white bg-green-500 rounded-lg"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </div>

          {/* Join the selected room */}
          <button
            className="p-2 mt-4 text-white bg-blue-500 rounded-lg"
            onClick={handleJoinRoom}
            disabled={!room}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Room: {room}</h1>
          <div className="h-[200px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 text-black rounded-lg">
            <div>
              {messages.map((msg, index) => (
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

          {/* Exit Room Button */}
          <button
            className="mt-4 text-red-500"
            onClick={handleLeaveRoom}
          >
            Exit Chat
          </button>
        </div>
      )}
    </div>
  );
}
