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

  return (
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
  );
};

export default ScorePlot;
