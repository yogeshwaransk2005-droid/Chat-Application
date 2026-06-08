import React, { useState } from "react";

function GroupChat() {

    const [groups] = useState([
        {
            id: 1,
            name: "Developers",
            lastMessage: "Meeting at 6 PM 🔥",
            members: 12,
            image: "https://i.pravatar.cc/50?img=1"
        },
        {
            id: 2,
            name: "College Friends",
            lastMessage: "Assignment complete ah? 😅",
            members: 8,
            image: "https://i.pravatar.cc/50?img=2"
        },
        {
            id: 3,
            name: "Project Team",
            lastMessage: "UI update panniten 👍",
            members: 5,
            image: "https://i.pravatar.cc/50?img=3"
        }
    ]);

    const [selectedGroup, setSelectedGroup] = useState(null);

    return (

        <div className="group-chat-container">

            <div className="group-sidebar">

                <div className="group-header">

                    <h2>👥 Groups</h2>

                </div>

                <div className="group-list">

                    {
                        groups.map((group) => (

                            <div
                                key={group.id}
                                className={
                                    selectedGroup?.id === group.id
                                        ? "group-item active"
                                        : "group-item"
                                }

                                onClick={() => setSelectedGroup(group)}
                            >

                                <img
                                    src={group.image}
                                    alt={group.name}
                                    className="group-image"
                                />

                                <div className="group-info">

                                    <h4>{group.name}</h4>

                                    <p>{group.lastMessage}</p>

                                    <span>
                                        👤 {group.members} Members
                                    </span>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>

            <div className="group-chat-window">

                {
                    selectedGroup ? (

                        <>

                            <div className="group-chat-header">

                                <img
                                    src={selectedGroup.image}
                                    alt={selectedGroup.name}
                                    className="group-chat-image"
                                />

                                <div>

                                    <h3>{selectedGroup.name}</h3>

                                    <span>
                                        👥 {selectedGroup.members} Members
                                    </span>

                                </div>

                            </div>

                            <div className="group-messages">

                                <div className="group-message received">
                                    <strong>Arun:</strong> Hello Team 👋
                                </div>

                                <div className="group-message sent">
                                    UI completed machaan 🔥
                                </div>

                            </div>

                            <div className="group-chat-input">

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                />

                                <button>
                                    Send
                                </button>

                            </div>

                        </>

                    ) : (

                        <div className="no-group-selected">

                            <h2>
                                Select a Group to Start Chatting 💬
                            </h2>

                        </div>

                    )
                }

            </div>

        </div>

    );

}

export default GroupChat;