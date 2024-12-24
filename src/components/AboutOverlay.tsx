import React from 'react'

interface AboutOverlayProps {
  onClose: () => void
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ onClose }) => {
  return (
    <>
      <div onClick={onClose} />

      <div>
        <h2>About This Game</h2>
        <p>
          For a long time I&apos;ve had the vauge idea that successfull people
          just got lucky. It&apos;s not just that some are born in the right
          place and the right time. Even those people who have the winning
          formula for business or management or war or science or love and who
          repeatedly make choices that lead to their success are still somehow
          beneficiaries of a stroke of luck harder to explain. It&apos;s the
          idea that they could not possibly have had enough life experience to
          learn those big picgure strategies through trial and error or
          listening to sage advice. I wanted to make a game that encapsulated
          this notion. In each level of Knowable the rules are incredibly simple
          and the optimal strategy is very straight forward. If it&apos;s
          spelled out for you it&apos;s easy to figure out what keys do what in
          a couple turns and play optimally for the rest of the game. This means
          that if you guess what the rules are you&apos;re going to get a
          perfect or near perfect score. The only catch is that you never quite
          know what the rules are and by the time you figure it out there&apos;s
          not much time left. Like life, this leaves you feeling rather foolish
          especially when the advice you are given purports to give away the
          answer. In life it&apos;s true that others following the right advice
          are in fact incredibly successful because they followed it.
          Nonetheless, life is harder than that.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  )
}

export default AboutOverlay
