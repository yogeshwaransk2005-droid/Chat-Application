import React from "react";

function OnlineUsers({ users, onSelectUser }) {
  return (
    <div className="online-users">
      <h3>🟢 Online Users</h3>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-card" onClick={() => onSelectUser(user)}>
            <img src={user.avatarUrl || `https://i.pravatar.cc/50?u=${user.id}`} alt={user.username} className="user-avatar" />
            <div className="user-details">
              <h4>{user.username}</h4>
              <span className="user-status">🟢 Online</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnlineUsers;
