import React from 'react'

interface AboutOverlayProps {
  onClose: () => void
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-50'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-md z-50 shadow-xl'>
        <h2 className='text-2xl font-bold mb-4'>About This Game</h2>
        <p className='mb-4'>
          This is a typing game designed to help you improve your typing speed
          and accuracy. Practice with different levels and challenge yourself to
          become faster and more precise!
        </p>
        <button
          onClick={onClose}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
        >
          Close
        </button>
      </div>
    </>
  )
}

export default AboutOverlay
