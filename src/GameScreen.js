// GameScreen.js
import React, { useState, useEffect } from 'react';
import ScorePlot from './ScorePlot'; // Import the new ScorePlot component
import './InteractivePlot.css';

const GameScreen = ({ level, onLevelComplete, config }) => {
  const [points, setPoints] = useState([{ x: 0, y: 0 }]);
  const [xDomain, setXDomain] = useState([0, config.maxSteps]);
  const [stepsTaken, setStepsTaken] = useState(0);
  const [keyHistory, setKeyHistory] = useState([]);

  useEffect(() => {
    // Reset points and steps when the level changes
    setPoints([{ x: 0, y: 0 }]);
    setStepsTaken(0);
    setKeyHistory([]);
  }, [level, config]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setPoints((currentPoints) => {
          const newY = config.scoringLogic(currentPoints, keyHistory, event.key);
          const newX = currentPoints.length;
          const updatedPoints = [...currentPoints, { x: newX, y: newY }];
          // Update domain if new point is out of bounds
          if (newX > xDomain[1]) {
            setXDomain([xDomain[0] + 10, xDomain[1] + 10]);
          }

          return updatedPoints;
        });
        setStepsTaken((prev) => prev + 1);
        setKeyHistory((prevHistory) => [...prevHistory, event.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [stepsTaken, xDomain, points, keyHistory, config]);

  useEffect(() => {
    // Check if the level is complete
    if (stepsTaken >= config.maxSteps) {
      const levelData = {
        points,
        keyHistory,
        randomValues: config.randomValues,
        description: config.description,
      };
      onLevelComplete(levelData);
    }
  }, [
    stepsTaken,
    config.maxSteps,
    onLevelComplete,
    points,
    keyHistory,
    config.randomValues,
    config.description,
  ]);

  return (
    <div className="container">
      <h2 className="title">Level {level}</h2>
      <p className="subtitle">
        Press left or right arrow keys to add points ({stepsTaken}/{config.maxSteps})
      </p>
      <ScorePlot points={points} keyHistory={keyHistory} xDomain={xDomain} />
    </div>
  );
};

export default GameScreen;
