"use client";

import { useState, useEffect } from "react";
import { socket } from "../lib/socketClient"; // assuming this is your socket connection setup
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import "../globals.css";

export default function ChatBox() {
  const [room, setRoom] = useState(""); // Current selected room
  const [joined, setJoined] = useState(false); // Whether the user has joined a room
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]); // Messages in the room
  const [userName, setUserName] = useState(""); // Username
  const [rooms, setRooms] = useState<string[]>([]); // Available rooms
  const [newRoomName, setNewRoomName] = useState(""); // For creating a new room
  const [roomError, setRoomError] = useState(""); // Error message for room creation
  const [selectedRoomMessage, setSelectedRoomMessage] = useState(""); // Message for the selected room

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Fetch available rooms from the server when the component mounts
    socket.emit("getAvailableRooms");

    socket.on("availableRooms", (availableRooms: string[]) => {
      setRooms(availableRooms); // Update available rooms
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message: string) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    // Clean up listeners
    return () => {
      socket.off("user_joined");
      socket.off("message");
      socket.off("availableRooms");
    };
  }, []);

  const handleJoinRoom = () => {
    if (!room) {
      console.log("No room selected!"); // Debugging log
      return;
    }

    if (userName) {
      console.log(`Joining room: ${room}`); // Debugging log
      socket.emit("join-room", { room, username: userName }); // Emit join-room event
      setJoined(true); // Update UI to show that user joined the room
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim() === "") {
      setRoomError("Please enter a room name.");
      return;
    }
    socket.emit("createRoom", newRoomName); // Emit createRoom event
    setNewRoomName(""); // Clear input after submitting
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", room); // Emit leave-room event to server
    setRoom(""); // Reset room name
    setJoined(false); // User is no longer in a room
    setMessages([]); // Clear messages
  };

  // Handle selecting an available room
  const handleSelectRoom = (selectedRoom: string) => {
    setRoom(selectedRoom); // Set the selected room in state
    setSelectedRoomMessage(`You are joining room: ${selectedRoom}`); // Update the message
  };

  // Handle removing a room (if desired, based on your server setup)
  const handleRemoveRoom = (roomToRemove: string) => {
    socket.emit("removeRoom", roomToRemove); // Send request to server to remove the room
    setRooms(rooms.filter((r) => r !== roomToRemove)); // Update room list on the client side
  };

  return (
    <div className="fixed bottom-4 left-4 w-50 max-w-3xl mx-auto p-4 bg-white border rounded-lg">
      {!joined ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900">Chat Room</h1>
          <div className="w-64 px-4 py-2 mb-4 border-2 text-black placeholder-gray-800 rounded-l bold text-lg bg-gray-200">
            Player: {userName}
          </div>

          {/* Available Rooms */}
          <div className="mt-4">
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
            {/* <h2 className="text-xl text-black">Create a new room:</h2> */}
            <input
              type="text"
              placeholder="Enter new room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-64 px-4 py-2 mb-4 border-2 text-black placeholder-gray-800 rounded-lg"
            />
            <button
              className="p-2 mt-2 text-white bg-green-500 rounded-lg"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            {roomError && <p className="text-red-500 mt-2">{roomError}</p>}
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

      {/* Display selected room message */}
      {selectedRoomMessage && <p className="text-green-500 mt-4">{selectedRoomMessage}</p>}
    </div>
  );
}
