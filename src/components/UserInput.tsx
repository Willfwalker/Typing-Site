import React from 'react';
import '../styles/UserInput.css';

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const UserInput: React.FC<UserInputProps> = ({ value, onChange, inputRef }) => {
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Prevent certain key combinations (like Ctrl+A) to avoid disrupting the typing flow
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow: Backspace, Delete, Tab, Escape, Enter
    if ([8, 46, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+Z, Ctrl+X, Ctrl+C, Ctrl+V
        (e.ctrlKey && [90, 88, 67, 86].indexOf(e.keyCode) !== -1)) {
      return;
    }

    // Prevent Ctrl+A (select all) to avoid disrupting the typing flow
    if (e.ctrlKey && e.keyCode === 65) {
      e.preventDefault();
    }
  };

  return (
    <div className="user-input">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing..."
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default UserInput;
