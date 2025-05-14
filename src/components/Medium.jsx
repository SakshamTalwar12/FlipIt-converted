import React, { useEffect, useState, useRef } from "react";
import Typed from "typed.js";
import { useNavigate } from "react-router-dom";
import "../styles/Medium.css";

function Medium() {
  const navigate = useNavigate();
  
  // Handle navigation back to home/difficulty selection
  const handleBackClick = () => {
    navigate("/");
  };
  
  const typedRef = useRef(null);
  const typedInstanceRef = useRef(null);
  const particlesRef = useRef(null);

  const [triesLeft, setTriesLeft] = useState(4); // Medium mode has 4 tries
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, img: "./images/winter.jpg", alt: "Winter", flipped: false, matched: false },
    { id: 2, img: "./images/winter.jpg", alt: "Winter", flipped: false, matched: false },
    { id: 3, img: "./images/lily-banse-9eH2QtfQAjI-unsplash.jpg", alt: "Lily", flipped: false, matched: false },
    { id: 4, img: "./images/lily-banse-9eH2QtfQAjI-unsplash.jpg", alt: "Lily", flipped: false, matched: false },
    { id: 5, img: "./images/summer.jpg", alt: "Summer", flipped: false, matched: false },
    { id: 6, img: "./images/summer.jpg", alt: "Summer", flipped: false, matched: false },
    { id: 7, img: "./images/forest.jpg", alt: "Forest", flipped: false, matched: false },
    { id: 8, img: "./images/forest.jpg", alt: "Forest", flipped: false, matched: false }
  ]);
  
  // Initialize game and handle effects
  useEffect(() => {
    // Shuffle cards on mount
    shuffleCards();
    
    // Create initial particles
    createParticles(10);
    
    // Create particles periodically
    const particleInterval = setInterval(() => createParticles(3), 1000);
    
    // Add letter animations to title
    const letters = document.querySelectorAll(".letter");
    letters.forEach((letter, index) => {
      letter.style.animation = "dropIn 0.6s forwards";
      letter.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Clean up on unmount
    return () => {
      clearInterval(particleInterval);
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, []);
  
  // Check for win/lose conditions
  useEffect(() => {
    if (matchedPairs === 4) { // Medium mode has 4 pairs
      handleWin();
    }
  }, [matchedPairs]);
  
  useEffect(() => {
    if (triesLeft <= 0) {
      handleLose();
    }
  }, [triesLeft]);
  
  // Initialize typed.js when game over
  useEffect(() => {
    if ((gameOver || gameWon) && typedRef.current) {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
      
      typedInstanceRef.current = new Typed(typedRef.current, {
        strings: [gameWon ? "Congratulations! You Win!" : "Game Over! You Lose."],
        typeSpeed: 60,
        backSpeed: 60,
        loop: false
      });
      
      // Ask to play again
      const timer = setTimeout(() => {
        if (window.confirm("Do you want to play again?")) {
          window.location.reload();
        }
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [gameOver, gameWon]);
  
  // Shuffle cards function
  const shuffleCards = () => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
  };
  
  // Handle card flip
  const handleCardClick = (id) => {
    // Don't allow clicks if already have 2 cards flipped or game over
    if (flippedCards.length >= 2 || gameOver || gameWon) return;
    
    // Don't allow clicking already flipped or matched cards
    if (cards.find(card => card.id === id).flipped || cards.find(card => card.id === id).matched) return;
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, id]);
  };
  
  // Process flipped cards
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [id1, id2] = flippedCards;
      const card1 = cards.find(card => card.id === id1);
      const card2 = cards.find(card => card.id === id2);
      
      if (card1.img === card2.img) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === id1 || card.id === id2 
                ? { ...card, matched: true }
                : card
            )
          );
          setFlippedCards([]);
          setMatchedPairs(prev => prev + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === id1 || card.id === id2 
                ? { ...card, flipped: false } 
                : card
            )
          );
          setFlippedCards([]);
          setTriesLeft(prev => prev - 1);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);
  
  // Create particles function
  const createParticles = (count) => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < count; i++) {
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

      particlesRef.current.appendChild(particle);
      
      // Remove particle after animation completes to avoid memory leaks
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    }
  };
  
  // Create confetti for win celebration
  const createConfetti = () => {
    const confettiColors = ['#F3C623', '#FF00FF', '#00BFFF', '#9b297b', '#FF69B4'];
    let count = 0;
    
    const createSingleConfetti = () => {
      if (count >= 100) return;
      
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const size = Math.random() * 15 + 5;
      const left = Math.random() * 100 + '%';
      const animationDuration = Math.random() * 4 + 2;
      const colorIndex = Math.floor(Math.random() * confettiColors.length);
      
      Object.assign(confetti.style, {
        left: left,
        width: size + 'px',
        height: size + 'px',
        backgroundColor: confettiColors[colorIndex],
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        animation: `confettiFall ${animationDuration}s linear forwards`
      });
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), animationDuration * 1000);
      
      count++;
      setTimeout(createSingleConfetti, 25);
    };
    
    createSingleConfetti();
  };
  
  // Handle win condition
  const handleWin = () => {
    createConfetti();
    
    setTimeout(() => {
      setGameWon(true);
    }, 500);
  };
  
  // Handle lose condition
  const handleLose = () => {
    setTimeout(() => {
      setGameOver(true);
    }, 500);
  };
  return (
  <>
    <div className="particles" ref={particlesRef}></div>
    
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
    </div>
    
    <div className="tries-container">
      Number of tries left: <span id="tries">{triesLeft}</span>
    </div>
    
    <div className="difficulty-container">Difficulty: <span id="hard">Medium</span></div>
    
    <div className="back-btn" onClick={handleBackClick}>↖</div>
    
    <div className={`container2 ${gameOver || gameWon ? 'fade-out' : ''}`}>
      {cards.map(card => (
        <div 
          key={card.id} 
          className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
          onClick={() => handleCardClick(card.id)}
        >
          <div className="card-inner">
            <div className="card-front">
              <h2>Click to Flip</h2>
            </div>
            <div className="card-back">
              <img 
                src={card.img} 
                alt={card.alt} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className={`winlose ${gameOver || gameWon ? 'visible' : ''}`}>
      <span ref={typedRef} className="typed"></span>
    </div>
  </>
);
}

export default Medium;
