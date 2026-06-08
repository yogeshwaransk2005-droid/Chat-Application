import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import OnlineUsers from "../components/OnlineUsers";

import { AuthContext } from "../context/AuthContext";
import {
  getUsers,
  fetchConversation
} from "../services/api";

import {
  connectSocket,
  disconnectSocket,
  sendSocketMessage
} from "../services/socketService";

function Home() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingConversation, setLoadingConversation] = useState(false);

  // Load users

  useEffect(() => {

  console.log(
    "AUTH HEADER =",
    localStorage.getItem(
      "chatAuthUser"
    )
  );

}, []);
  useEffect(() => {

    if (!user) return;

    const loadUsers = async () => {

      try {

        const users = await getUsers();

        console.log("Current User:", user);
        console.log("Users Loaded:", users);

        setContacts(
          users.filter(
            (u) => u.id !== user.id
          )
        );

      } catch (error) {

        console.error(
          "Failed to load users",
          error
        );
      }
    };

    loadUsers();

  }, [user]);

  // Restore selected chat after refresh
useEffect(() => {

  const savedUser =
    localStorage.getItem(
      "selectedUser"
    );

  if (savedUser) {

    setSelectedUser(
      JSON.parse(savedUser)
    );

  }

}, []);

  // Connect websocket
  useEffect(() => {

    console.log("USER =", user);

    if (!user) {
      console.log("USER NULL");
      return;
    }

    console.log("CONNECTING SOCKET...");
    console.log("TOKEN =", user.token);

    const handleIncomingMessage = (message) => {

      console.log(
        "📩 Message Received:",
        message
      );

      setMessages((prev) => {

        const exists = prev.some(
          (m) => m.id === message.id
        );

        if (exists) {
          return prev;
        }

        return [...prev, message];
      });
    };

    const handleTypingEvent = (
      typingEvent
    ) => {

      console.log(
        "⌨ Typing Event:",
        typingEvent
      );
    };

    connectSocket(
      user.token,
      handleIncomingMessage,
      handleTypingEvent
    );

    return () => {

      disconnectSocket();
    };

  }, [user]);

  const loadConversation = async (
    contact
  ) => {

    console.log(
      "Selected User:",
      contact
    );



    setSelectedUser(contact);
    setLoadingConversation(true);
    localStorage.setItem(
  "selectedUser",
  JSON.stringify(contact)
);

    try {

      const conversation =
        await fetchConversation(
          user.id,
          contact.id
        );

      console.log(
        "Conversation:",
        conversation
      );

      setMessages(conversation || []);

    } catch (error) {

      console.error(
        "Conversation Load Failed",
        error
      );

      setMessages([]);

    } finally {

      setLoadingConversation(false);
    }
  };



// Reload conversation after refresh
useEffect(() => {

  if (
    selectedUser &&
    user
  ) {

    const loadSavedConversation =
      async () => {

        try {

          setLoadingConversation(
            true
          );

          const conversation =
            await fetchConversation(
              user.id,
              selectedUser.id
            );

          setMessages(
            conversation || []
          );

        } catch (error) {

          console.error(
            "Failed to reload conversation",
            error
          );

        } finally {

          setLoadingConversation(
            false
          );

        }

      };

    loadSavedConversation();

  }

}, [selectedUser, user]);


  const handleSendMessage = () => {

    if (!selectedUser) {

      alert("Select a user first");
      return;
    }

    if (!messageText.trim()) {
      return;
    }

    const payload = {

      senderId: user.id,
      senderName: user.username,
      receiverId: selectedUser.id,
      content: messageText.trim(),
      type: "text"
    };

    console.log(
      "Sending:",
      payload
    );

    sendSocketMessage(payload);

    setMessageText("");
  };

  const handleLogout = () => {

    disconnectSocket();

    logout();

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">

      <Navbar
        currentUser={user.username}
        onLogout={handleLogout}
      />

      <div className="home-content">

        <Sidebar
          users={contacts}
          selectedUser={selectedUser}
          onSelectUser={loadConversation}
        />

        <ChatBox
          currentUser={user}
          selectedUser={selectedUser}
          messages={messages}
          messageText={messageText}
          setMessageText={setMessageText}
          onSend={handleSendMessage}
          isLoading={loadingConversation}
        />

        <OnlineUsers
          users={contacts.filter(
            (u) => u.online
          )}
          onSelectUser={loadConversation}
        />

      </div>

    </div>
  );
}

export default Home;