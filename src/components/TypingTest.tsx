import { useState, useEffect, useCallback, useRef } from 'react';
import TextDisplay from './TextDisplay';
import UserInput from './UserInput';
import Stats from './Stats';
import '../styles/TypingTest.css';

// Word list for typing practice
const generateWordList = (): string[] => {
  const commonWords = [
    'more', 'begin', 'each', 'large', 'under', 'face', 'small', 'want', 'you', 'they', 'public', 'which',
    'use', 'high', 'he', 'of', 'may', 'just', 'if', 'lead', 'by', 'eye', 'both', 'way', 'head', 'over', 'follow',
    'large', 'only', 'would', 'against', 'of', 'system', 'head', 'if', 'like', 'go', 'you', 'need', 'leave',
    'time', 'number', 'person', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
    'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'work', 'first',
    'well', 'even', 'want', 'because', 'these', 'give', 'day', 'most', 'us'
  ];

  // Shuffle the array to get random words
  return [...commonWords].sort(() => 0.5 - Math.random());
};

// Generate text from word list
const generateText = (wordCount: number = 50): string => {
  const wordList = generateWordList();
  const selectedWords = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = i % wordList.length;
    selectedWords.push(wordList[randomIndex]);
  }

  return selectedWords.join(' ');
};

const TypingTest = () => {
  const [text, setText] = useState<string>(generateText());
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Calculate WPM and accuracy
  useEffect(() => {
    if (startTime && userInput.length > 0) {
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - startTime) / 60000;

      // Count words
      const words = userInput.split(' ').length;

      // Calculate WPM
      const currentWpm = Math.round(words / Math.max(elapsedMinutes, 0.01));
      setWpm(currentWpm);

      // Calculate accuracy
      const userWords = userInput.split(' ');
      const textWords = text.split(' ').slice(0, userWords.length);

      let errorCount = 0;
      let totalChars = 0;

      for (let i = 0; i < userWords.length; i++) {
        if (i < textWords.length) {
          const userWord = userWords[i];
          const textWord = textWords[i];
          totalChars += userWord.length;

          for (let j = 0; j < userWord.length; j++) {
            if (j >= textWord.length || userWord[j] !== textWord[j]) {
              errorCount++;
            }
          }
        }
      }

      const currentAccuracy = totalChars > 0
        ? Math.max(0, Math.round(100 - (errorCount / totalChars * 100)))
        : 100;

      setAccuracy(currentAccuracy);
      setErrors(errorCount);

      // Update character and word count
      setCharCount(userInput.length);
      setWordCount(words);
    }
  }, [userInput, startTime, text]);

  // Handle user input
  const handleUserInput = useCallback((input: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(input);

    // Check if the user has completed the current line
    const userWords = input.split(' ');
    const textWords = text.split(' ');
    const currentWordIndex = userWords.length - 1;

    // If the user has typed the last word in the current line
    // or if they've typed more than 80% of the current text, add more words
    if (currentWordIndex >= textWords.length - 1 ||
        userWords.length > textWords.length * 0.8) {
      const additionalText = generateText(10); // Add 10 more words
      setText(text + ' ' + additionalText);
    }
  }, [text, startTime]);

  // Reset the test
  const resetTest = useCallback(() => {
    setText(generateText());
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setWordCount(0);
    setCharCount(0);
    setErrors(0);

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="typing-test">
      <div className="typing-container">
        <TextDisplay text={text} userInput={userInput} />

        <UserInput
          value={userInput}
          onChange={handleUserInput}
          inputRef={inputRef}
        />
      </div>

      <div className="controls">
        <Stats
          wpm={wpm}
          accuracy={accuracy}
          wordCount={wordCount}
          charCount={charCount}
          errors={errors}
        />

        <button className="reset-button" onClick={resetTest}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
