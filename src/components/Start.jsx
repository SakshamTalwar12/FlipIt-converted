import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; 
import "../styles/Start.css";

function Start() {
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [startActive, setStartActive] = useState(false);
    const [instructionText, setInstructionText] = useState("Select difficulty to start the game");
    const particlesContainerRef = useRef(null);
    
    // Create particles on component mount
    useEffect(() => {
        if (particlesContainerRef.current) {
            for (let i = 0; i < 25; i++) {
                createParticle();
            }
        }
        
        // Create particles periodically
        const particleInterval = setInterval(() => {
            if (particlesContainerRef.current) {
                createParticle();
            }
        }, 500);
        
        // Clean up particles when component unmounts
        return () => {
            clearInterval(particleInterval);
            if (particlesContainerRef.current) {
                while (particlesContainerRef.current.firstChild) {
                    particlesContainerRef.current.removeChild(particlesContainerRef.current.firstChild);
                }
            }
        };
    }, []);
    
    // Function to create a single particle
    const createParticle = () => {
        if (!particlesContainerRef.current) return;
        
        const size = Math.random() * 8 + 2;
        const left = Math.random() * 100 + '%';
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.6 + 0.2;

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = left;
        particle.style.bottom = '-50px';
        particle.style.opacity = opacity.toString();
        particle.style.animation = `float ${duration}s linear infinite ${delay}s`;

        particlesContainerRef.current.appendChild(particle);
        
        // Remove particle after animation completes to avoid memory leaks
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    };
    
    // Handle difficulty selection
    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setStartActive(true);
        setInstructionText("Click START to begin!");
        
        // Trigger letter animation
        const letters = document.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.style.animation = 'none';
            setTimeout(() => {
                letter.style.animation = 'dropIn 0.4s forwards';
                letter.style.animationDelay = `${index * 0.05}s`;
            }, 10);
        });
    };
    
    // Handle start button click
    const handleStartClick = () => {
        if (!selectedDifficulty) return;
        window.location.href = `/${selectedDifficulty}`;
    };

    return (
        <>
            <div className="particles" ref={particlesContainerRef}></div>
            <div className="container">
                <div className="title-container">
                    <div className="title-word">
                        <span className="letter">M</span>
                        <span className="letter">E</span>
                        <span className="letter">M</span>
                        <span className="letter">O</span>
                        <span className="letter">R</span>
                        <span className="letter">Y</span>
                    </div>
                    <div className="title-word">
                        <span className="letter">G</span>
                        <span className="letter">A</span>
                        <span className="letter">M</span>
                        <span className="letter">E</span>
                    </div>
                    <p className="subtitle">Test your memory with this fun challenge!</p>
                </div>
                
                <button 
                    className={`start-button ${startActive ? 'active' : ''}`} 
                    onClick={handleStartClick}
                >
                    START
                </button>
                
                <div className="difficulty-bar">
                    {['easy', 'medium', 'hard'].map(difficulty => (
                        <div 
                            key={difficulty}
                            className={`difficulty-option ${selectedDifficulty === difficulty ? 'active' : ''}`}
                            onClick={() => handleDifficultySelect(difficulty)}
                        >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </div>
                    ))}
                </div>
                <p 
                    className="instruction-text" 
                    style={{ color: selectedDifficulty ? 'rgba(255, 255, 255, 0.9)' : '' }}
                >
                    {instructionText}
                </p>
            </div>
        </>
    );
}

export default Start;