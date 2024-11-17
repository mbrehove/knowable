// WelcomeScreen.js
import React from 'react';

const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="welcome-screen">
            <h1>Your Game Title</h1>
            <p>
                {/* Add your game rules and any introductory text here. */}
            </p>
            <button onClick={onStart} autoFocus>New Game</button>
        </div>
    );
};

export default WelcomeScreen;
