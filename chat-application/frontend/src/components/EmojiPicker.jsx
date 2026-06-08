import React, { useState } from "react";
import Picker from "emoji-picker-react";

function EmojiPicker({ onEmojiSelect }) {

  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="emoji-container">

      <button
        className="emoji-btn"
        onClick={() => setShowPicker(!showPicker)}
      >
        😊
      </button>

      {showPicker && (
        <div className="emoji-picker-popup">
          <Picker
            onEmojiClick={(emojiData) => {
              onEmojiSelect(emojiData.emoji);
            }}
          />
        </div>
      )}

    </div>
  );
}

export default EmojiPicker;