import React from "react";

function Navbar({ currentUser, onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="app-logo">💬 ChatApp</h2>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search users or chats..." className="search-input" />
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <img src="https://i.pravatar.cc/40" alt="profile" className="profile-image" />
          <div>
            <h4>{currentUser}</h4>
            <span className="online-status">🟢 Online</span>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
