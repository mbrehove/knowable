// WelcomeScreen.js
import React from 'react';

const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="welcome-screen">
                        <h1>Knowable</h1>
            <p>
Life is confusing. There are a lot of people that will give you advice about how to succeed.
Everyone gives advice that wored for them, but you're in a different situation with different 
choices and you need to figure out which strategy works for you. 

In this game, like life, you'll make choices without knowing the rules and try to figure it out
as you go allong. 
            </p>
            <button onClick={onStart} autoFocus>New Game</button>
        </div>
    );
};

export default WelcomeScreen;
