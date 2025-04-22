import React from 'react';
import '../styles/TextDisplay.css';

interface TextDisplayProps {
  text: string;
  userInput: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, userInput }) => {
  // Get the current line of text to display
  const getCurrentLine = () => {
    const words = text.split(' ');
    const userWords = userInput.split(' ');
    const currentWordIndex = userWords.length - 1;

    // Get the current line (up to 8 words)
    const lineStartIndex = Math.max(0, currentWordIndex - 2);
    const lineEndIndex = Math.min(words.length, lineStartIndex + 8);
    const currentLineWords = words.slice(lineStartIndex, lineEndIndex);

    // Process each word in the current line
    return currentLineWords.map((word, index) => {
      const wordIndex = lineStartIndex + index;

      // Words that have been fully typed
      if (wordIndex < currentWordIndex) {
        const typedWord = userWords[wordIndex];
        const isCorrect = typedWord === word;

        return {
          word,
          status: isCorrect ? 'correct' : 'incorrect',
          isCurrent: false
        };
      }

      // Current word being typed
      else if (wordIndex === currentWordIndex) {
        const currentUserWord = userWords[currentWordIndex] || '';
        const letters = word.split('');

        // Process each letter in the current word
        const processedLetters = letters.map((letter, letterIndex) => {
          if (letterIndex < currentUserWord.length) {
            // Letter has been typed
            return {
              letter,
              status: letter === currentUserWord[letterIndex] ? 'correct' : 'incorrect',
              isCurrent: false
            };
          } else if (letterIndex === currentUserWord.length) {
            // Current letter to type
            return {
              letter,
              status: 'current',
              isCurrent: true
            };
          } else {
            // Letter yet to be typed
            return {
              letter,
              status: 'remaining',
              isCurrent: false
            };
          }
        });

        return {
          word,
          processedLetters,
          isCurrent: true
        };
      }

      // Words yet to be typed
      else {
        return {
          word,
          status: 'remaining',
          isCurrent: false
        };
      }
    });
  };

  const currentLine = getCurrentLine();

  // Get the current word being typed
  const currentWord = currentLine.find(word => 'processedLetters' in word);

  // Get the upcoming words in the current line
  const upcomingWords = currentLine.filter(word =>
    !('processedLetters' in word) && word.status === 'remaining'
  );

  return (
    <div className="text-display">
      <div className="text-content">
        <div className="typing-line">
          {/* Current word being typed */}
          {currentWord && 'processedLetters' in currentWord && currentWord.processedLetters ? (
            <span className="word current-word">
              {currentWord.processedLetters.map((letter, index) => (
                <span
                  key={`letter-${index}`}
                  className={`letter ${letter.status}`}
                >
                  {letter.letter}
                </span>
              ))}
            </span>
          ) : null}

          {/* Upcoming words in the current line */}
          {upcomingWords.map((word, index) => (
            <span
              key={`upcoming-${index}`}
              className="word remaining"
            >
              {word.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextDisplay;
