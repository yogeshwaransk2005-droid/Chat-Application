import React from "react";

function Sidebar({ users, selectedUser, onSelectUser }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>💬 Chats</h2>
      </div>
      <div className="sidebar-search">
        <input type="text" placeholder="Search chats..." className="search-box" />
      </div>
      <div className="sidebar-users">
        {users.map((user) => (
          <div
            key={user.id}
            className={selectedUser?.id === user.id ? "user-item active" : "user-item"}
            onClick={() => onSelectUser(user)}
          >
            <img src={user.avatarUrl || `https://i.pravatar.cc/50?u=${user.id}`} alt={user.username} className="user-avatar" />
            <div className="user-info">
              <div className="user-top">
                <h4>{user.username}</h4>
                <span className="message-time">{user.online ? "Online" : "Offline"}</span>
              </div>
              <div className="user-bottom">
                <p className="last-message">{user.email}</p>
                <span className={user.online ? "online-dot" : "offline-dot"}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
