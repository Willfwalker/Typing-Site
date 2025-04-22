import React from 'react';
import '../styles/Stats.css';

interface StatsProps {
  wpm: number;
  accuracy: number;
  wordCount: number;
  charCount: number;
  errors: number;
}

const Stats: React.FC<StatsProps> = ({ wpm, accuracy, wordCount, charCount, errors }) => {
  return (
    <div className="stats">
      <div className="stat-item">
        <div className="stat-value">{wpm}</div>
        <div className="stat-label">WPM</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{accuracy}%</div>
        <div className="stat-label">Accuracy</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{wordCount}</div>
        <div className="stat-label">Words</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{charCount}</div>
        <div className="stat-label">Characters</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{errors}</div>
        <div className="stat-label">Errors</div>
      </div>
    </div>
  );
};

export default Stats;
