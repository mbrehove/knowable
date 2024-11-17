import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './InteractivePlot.css';

const InteractivePlot = () => {
  const [points, setPoints] = useState([{ x: 0, y: 0 }]);
  const [xDomain, setXDomain] = useState([0, 50]); // Initial domain

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setPoints(currentPoints => {
          const newX = currentPoints.length;
          const updatedPoints = [...currentPoints, { x: newX, y: newX }];

          // Update domain if new point is out of bounds
          if (newX > xDomain[1]) {
            setXDomain([xDomain[0] + 10, xDomain[1] + 10]); // Shift domain forward by 10
          }

          return updatedPoints;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [xDomain]); // Depend on xDomain to recalculate when it changes

  return (
    <div className="container">
      <h2 className="title">Level </h2>
      <p className="subtitle">Press left or right arrow keys to add points</p>
      <LineChart
        width={600}
        height={400}
        data={points}
        margin={{ top: 5, right: 30, left: 50, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          label={{ value: "Turn", position: "bottom", offset: 0 }}
          domain={xDomain}
          type="number" // Explicitly set type to "number" for custom domains
        />
        <YAxis
          label={{ value: "Score", angle: -90, position: "insideLeft", offset: -5 }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          animationDuration={200} // 200ms = 0.2s
        />
      </LineChart>
    </div>
  );
};

export default InteractivePlot;
