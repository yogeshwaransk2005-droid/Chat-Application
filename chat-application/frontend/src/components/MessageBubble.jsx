import React from "react";

function MessageBubble({ message, currentUser }) {

    const isSender = message.sender === currentUser;

    return (

        <div
            className={
                isSender
                    ? "message-bubble sender"
                    : "message-bubble receiver"
            }
        >

            <div className="message-content">

                {
                    message.type === "text" && (
                        <p>{message.content}</p>
                    )
                }

                {
                    message.type === "image" && (
                        <img
                            src={message.content}
                            alt="shared"
                            className="message-image"
                        />
                    )
                }

                {
                    message.type === "video" && (
                        <video controls className="message-video">
                            <source src={message.content} />
                        </video>
                    )
                }

                {
                    message.type === "audio" && (
                        <audio controls>
                            <source src={message.content} />
                        </audio>
                    )
                }

                {
                    message.type === "file" && (
                        <a
                            href={message.content}
                            target="_blank"
                            rel="noreferrer"
                            className="file-link"
                        >
                            📄 Download File
                        </a>
                    )
                }

            </div>

            <div className="message-info">

                <span className="message-time">
                    {message.time}
                </span>

            </div>

        </div>

    );

}

export default MessageBubble;