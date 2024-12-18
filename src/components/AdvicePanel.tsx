// AdvicePanel.tsx
import React from 'react'
import DOMPurify from 'dompurify' // Add this for security

interface AdvicePanelProps {
  adviceList: string[]
}

const AdvicePanel: React.FC<AdvicePanelProps> = ({ adviceList }) => {
  return (
    <div className='advice-panel'>
      <h3>Advice</h3>
      <ul>
        {adviceList.map((advice, index) => (
          <li 
            key={index}
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(advice)
            }}
          />
        ))}
      </ul>
    </div>
  )
}

export default AdvicePanel