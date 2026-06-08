import React from "react";
import EmojiPicker from "./EmojiPicker";
import FileUpload from "./FileUpload";

function ChatBox({
  currentUser,
  selectedUser,
  messages,
  messageText,
  setMessageText,
  onSend,
  isLoading
}) {

  const selectedName =
    selectedUser?.username ||
    "Select a user";

  const handleKeyPress = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      onSend();
    }
  };

  const getStatusIcon = (
    status
  ) => {

    switch (status) {

      case "SENT":
        return "✓";

      case "DELIVERED":
        return "✓✓";

      case "READ":
        return "✓✓";

      default:
        return "";
    }
  };

  return (

    <div className="chat-box">

      {/* Header */}

      <div className="chat-header chat-header-panel">

        <div>

          <h2>
            {selectedName}
          </h2>

          <p className="chat-subtitle">

            Private Conversation

            {
              isLoading &&
              " (Loading...)"
            }

          </p>

        </div>

      </div>

      {/* Messages */}

      <div className="chat-messages">

        {

          selectedUser ? (

            messages.length ? (

              messages.map(
                (message) => (

                  <div
                    key={
                      message.id ||
                      `${message.senderId}-${message.createdAt}`
                    }
                    className={
                      message.senderId === currentUser.id
                        ? "message sent"
                        : "message received"
                    }
                  >

                    <div className="sender">

                      {
                        message.senderName ||
                        "Unknown"
                      }

                    </div>

                    <div>

                      {
                        message.deleted
                          ? "This message was deleted."
                          : message.content
                      }

                    </div>

                    <div className="message-footer">

                      {

                        message.senderId === currentUser.id && (

                          <span
                            className={
                              message.status === "READ"
                                ? "message-status read"
                                : "message-status"
                            }
                          >

                            {
                              getStatusIcon(
                                message.status
                              )
                            }

                          </span>

                        )

                      }

                      <span className="message-time">

                        {
                          new Date(
                            message.createdAt ||
                            new Date()
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )
                        }

                      </span>

                    </div>

                  </div>

                )
              )

            ) : isLoading ? (

              <div className="empty-chat">

                Loading messages...

              </div>

            ) : (

              <div className="empty-chat">

                No messages yet.
                Start the conversation.

              </div>

            )

          ) : (

            <div className="empty-chat">

              Choose a contact
              to open chat.

            </div>

          )

        }

      </div>

      {/* Input Area */}

      <div className="chat-input-area">

  <FileUpload
    onFileSelect={(files) =>
      console.log("Files:", files)
    }
  />

  <EmojiPicker
    onEmojiSelect={(emoji) =>
      setMessageText(
        (prev) => prev + emoji
      )
    }
  />

  <input
    type="text"
    className="chat-input"
    placeholder={
      selectedUser
        ? "Type your message..."
        : "Select a chat first..."
    }
    value={messageText}
    disabled={
      !selectedUser ||
      isLoading
    }
    onChange={(e) =>
      setMessageText(
        e.target.value
      )
    }
    onKeyDown={
      handleKeyPress
    }
  />

  <button
    className="send-btn"
    onClick={onSend}
    disabled={
      !selectedUser ||
      !messageText.trim() ||
      isLoading
    }
  >
    {
      isLoading
        ? "Sending..."
        : "Send"
    }
  </button>

</div>

    </div>

  );

}

export default ChatBox;