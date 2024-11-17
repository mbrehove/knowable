// WelcomeScreen.js
import React from 'react';
import './style.css';

const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="welcome-screen">
            <h1>Knowable</h1>
            <p>
                Life is confusing. There are a lot of people that will give you advice about how to succeed.
                Everyone gives advice that worked for them, but you're in a different situation with different 
                choices and you need to figure out which strategy works for you. 
            </p>
            <p>
                In this game, like life, you'll make choices without knowing the rules and try to figure it out
                as you go along. 
            </p>
            <button onClick={onStart} autoFocus>Press Enter to Continue</button>
        </div>
    );
};

export default WelcomeScreen;
