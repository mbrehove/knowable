'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface ScorePlotProps {
  points: { x: number; y: number }[]
  keyHistory: { key: string; time: number }[]
  xDomain: [number, number]
}

const ScorePlot: React.FC<ScorePlotProps> = ({ points, xDomain }) => {
  return (
    <div>
      <h2>Score Graph</h2>
      <LineChart
        width={600}
        height={400}
        data={points}
        margin={{ top: 5, right: 30, left: 50, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='x' domain={xDomain} type='number' />
        <YAxis />
        <Tooltip />
        <Line type='monotone' dataKey='y' stroke='#8884d8' />
      </LineChart>
    </div>
  )
}

export default ScorePlot
