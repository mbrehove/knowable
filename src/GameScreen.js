// GameScreen.js
import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import arrow icons
import './InteractivePlot.css';

const GameScreen = ({ level, onLevelComplete, config }) => {
    const [points, setPoints] = useState([{ x: 0, y: 0 }]);
    const [xDomain, setXDomain] = useState([0, config.maxSteps]);
    const [stepsTaken, setStepsTaken] = useState(0);
    const [scoringLogic, setScoringLogic] = useState();
    const [keyHistory, setKeyHistory] = useState([]); // New state variable


    useEffect(() => {
        // Reset points and steps when the level changes
        setPoints([{ x: 0, y: 0 }]);
        setScoringLogic(() => config.createScoringLogic());
        setStepsTaken(0);
        setKeyHistory([]); // Reset key history
    }, [level]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                setPoints((currentPoints) => {
                    const newY = scoringLogic(currentPoints, keyHistory, event.key)
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

        // Check if the level is complete
        if (stepsTaken >= config.maxSteps) {
            const levelData = {
                // Include any data you want to pass back
                points,
                keyHistory,
                scoringLogic
            };
            onLevelComplete(levelData);
        }
        

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [stepsTaken, xDomain, points, onLevelComplete]);

    // Custom Dot component
    const CustomDot = (props) => {
        const { cx, cy, index } = props;
        const keyPressed = keyHistory[index - 1]; // Get the key pressed at this point
    
        if (!keyPressed) {
            return null; // Do not render for the initial point
        }
    
        const IconComponent = keyPressed === 'ArrowLeft' ? FaArrowLeft : FaArrowRight;
    
        return (
        <IconComponent
            x={cx - 5}
            y={cy - 5}
            size={10}
            color="blue"
            style={{ position: 'absolute' }}
            // style={{ position: 'absolute', transform: `translate(${cx - 5}px, ${cy - 5}px)` }}
        />
        );
    };

    return (
        <div className="container">
            <h2 className="title">Level {level}</h2>
            <p className="subtitle">
                Press left or right arrow keys to add points ({stepsTaken}/{config.maxSteps})
            </p>
            <LineChart
                width={600}
                height={400}
                data={points}
                margin={{ top: 5, right: 30, left: 50, bottom: 25 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="x"
                    label={{ value: 'Turn', position: 'bottom', offset: 0 }}
                    domain={xDomain}
                    type="number"
                />
                <YAxis
                    label={{
                        value: 'Score',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -5,
                    }}
                />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="y"
                    stroke="#8884d8"
                    animationDuration={200}
                    dot={(props) => {
                        const { key, ...otherProps } = props;
                        return <CustomDot key={key} {...otherProps} keyHistory={keyHistory} />;
                      }}
                />
            </LineChart>
        </div>
    );
};



export default GameScreen;
