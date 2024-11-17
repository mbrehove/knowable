// ScorePlot.js
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import arrow icons

const ScorePlot = ({ points, keyHistory, xDomain }) => {
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
            />
        );
    };

    const currentScore = points.length > 0 ? points[points.length - 1].y : 0;
    const previousScore = points.length > 1 ? points[points.length - 2].y : 0;
    const change = currentScore - previousScore;
  
    const formattedChange = change.toFixed(2);
    const changeColor = change >= 0 ? 'green' : 'red';
    const changeSign = change >= 0 ? '+' : '';
    
    return (
        <div>
            <h2>
                Current Score: {currentScore.toFixed(2)} ({changeSign}
                <span style={{ color: changeColor }}>{formattedChange}</span>)
            </h2>
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

export default ScorePlot;
