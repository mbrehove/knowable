import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa' // Import arrow icons

interface ScorePlotProps {
  points: { x: number; y: number }[]
  keyHistory: { key: string; time: number }[]
  xDomain: [number, number]
  accuracy?: boolean[]
}

const ScorePlot: React.FC<ScorePlotProps> = ({
  points,
  keyHistory,
  xDomain,
  accuracy
}) => {
  // Custom Dot component
  const CustomDot: React.FC<{
    cx?: number
    cy?: number
    index?: number
  }> = ({ cx, cy, index }) => {
    if (index === undefined || cx === undefined || cy === undefined) {
      return null
    }
    const keyPressed = keyHistory[index - 1] // Get the key pressed at this point

    if (!keyPressed) {
      return null // Do not render for the initial point
    }
    let IconComponent
    switch (keyPressed.key) {
      case 'ArrowLeft':
        IconComponent = FaArrowLeft
        break
      case 'ArrowRight':
        IconComponent = FaArrowRight
        break
      case 'ArrowUp':
        IconComponent = FaArrowUp
        break
      case 'ArrowDown':
        IconComponent = FaArrowDown
        break
      default:
        return null
    }

    // Determine color based on accuracy
    const color =
      accuracy && index > 0 ? (accuracy[index - 1] ? 'green' : 'red') : 'blue'

    return (
      <IconComponent
        x={cx - 5}
        y={cy - 5}
        size={20}
        color={color}
        style={{ position: 'absolute' }}
      />
    )
  }

  const currentScore = points.length > 0 ? points[points.length - 1].y : 0
  const previousScore = points.length > 1 ? points[points.length - 2].y : 0
  const change = currentScore - previousScore

  const formattedChange = change.toFixed(2)
  const changeColor = change >= 0 ? 'green' : 'red'
  const changeSign = change >= 0 ? '+' : ''

  return (
    <div style={{ width: '100%' }}>
      <h2>
        Current Score: {currentScore.toFixed(2)} ({changeSign}
        <span style={{ color: changeColor }}>{formattedChange}</span>)
      </h2>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={points}
            margin={{ top: 5, right: 30, left: 50, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='x'
              label={{
                value: 'Turn',
                position: 'bottom',
                offset: 0,
                style: { fontSize: '24px' }
              }}
              strokeWidth={6}
              domain={xDomain}
              type='number'
              tick={{ fontSize: '24px' }}
            />
            <YAxis
              label={{
                value: 'Score',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
                style: { fontSize: '24px' }
              }}
              strokeWidth={6}
              tick={{ fontSize: '24px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'transparent',
                border: '1px solid #8884d8',
                color: '#000'
              }}
            />
            <Line
              type='monotone'
              dataKey='y'
              strokeWidth={6} // Thicker plotted line
              animationDuration={200}
              dot={props => {
                const { key, ...otherProps } = props
                return <CustomDot key={key} {...otherProps} />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ScorePlot
