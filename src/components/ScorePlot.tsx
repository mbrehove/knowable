import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import Image from 'next/image'
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'
import '../styles/plot.css'

interface ScorePlotProps {
  points: { x: number; y: number }[]
  keyHistory: { key: string; time: number }[]
  xDomain: [number, number]
  accuracy?: boolean[]
  image?: string
  authorName?: string
  authorQuote?: string
}

const ScorePlot: React.FC<ScorePlotProps> = ({
  points,
  keyHistory,
  xDomain,
  accuracy,
  image
}) => {
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        size={isMobile ? 15 : 20}
        color={color}
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
    <div className='plot-container'>
      <div className='score-display'>
        Current Score: {currentScore.toFixed(2)} ({changeSign}
        <span style={{ color: changeColor }}>{formattedChange}</span>)
      </div>
      <div className='plot-section'>
        {image && (
          <div className='image-background-container'>
            <Image
              src={image}
              fill
              alt='Plot background'
              className='overlay-image'
            />
          </div>
        )}
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={points}
            margin={
              isMobile
                ? { top: 5, right: 5, left: 10, bottom: 20 }
                : { top: 5, right: 20, left: 20, bottom: 20 }
            }
          >
            <XAxis
              dataKey='x'
              label={{
                value: 'Turn',
                position: 'bottom',
                offset: 0,
                className: 'axis-label'
              }}
              strokeWidth={isMobile ? 2 : 3}
              domain={xDomain}
              type='number'
              tick={{ className: 'axis-tick' }}
              stroke='#333333'
            />
            <YAxis
              label={{
                value: 'Score',
                angle: -90,
                position: 'left',
                offset: isMobile ? -5 : -10,
                className: 'axis-label'
              }}
              strokeWidth={isMobile ? 2 : 3}
              tick={{ className: 'axis-tick' }}
              stroke='#333333'
            />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='y'
              strokeWidth={isMobile ? 3 : 4}
              stroke='#8884d8'
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
