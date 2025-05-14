
import React, { useRef, useEffect } from 'react';
import Typed from 'typed.js';

function Typed() {
  const typedRef = useRef(null);
  const typedInstanceRef = useRef(null);
  
  useEffect(() => {
    if (typedRef.current) {
      typedInstanceRef.current = new Typed(typedRef.current, {
        strings: ['First text to display', 'Second text to display', 'More dynamic text here'],
        typeSpeed: 50,      // typing speed in milliseconds
        backSpeed: 30,      // backspacing speed in milliseconds
        startDelay: 500,    // delay before typing starts
        backDelay: 1000,    // delay before backspacing
        loop: true,         // loop the animation
        loopCount: Infinity, // number of loops (Infinity for endless)
        showCursor: true,   // show blinking cursor
        cursorChar: '|',    // character for cursor
        smartBackspace: true // only backspace what doesn't match previous string
      });
      
      // Cleanup on unmount
      return () => {
        if (typedInstanceRef.current) {
          typedInstanceRef.current.destroy();
        }
      };
    }
  }, []);
  
  return (
    <div>
      <h2>Typed Text:</h2>
      <span ref={typedRef}></span>
    </div>
  );
}


const typedConfig = {
  // Content options
  strings: ['Array of strings to display'],  
  stringsElement: null,     
  
  // Timing options
  typeSpeed: 50,            
  startDelay: 0,           
  backSpeed: 50,          
  backDelay: 700,         
  
  // Loop behavior
  loop: false,             
  loopCount: Infinity,     
  shuffle: false,           
  
  // Cursor options
  showCursor: true,        
  cursorChar: '|',         
  
  // Smart behavior
  smartBackspace: true,     
  fadeOut: false,          
  fadeOutClass: 'typed-fade-out',  
  fadeOutDelay: 500,       
  
  // Advanced options
  autoInsertCss: true,     
  bindInputFocusEvents: false,
  attr: null,               
  contentType: 'html',    
  
  // Callback functions
  onBegin: (self) => {},    // called before typing starts
  onComplete: (self) => {}, // called when typing is complete
  preStringTyped: (arrayPos, self) => {}, // before a string is typed
  onStringTyped: (arrayPos, self) => {}, // after a string is typed
  onLastStringBackspaced: (self) => {}, // after last string is backspaced
  onTypingPaused: (arrayPos, self) => {}, // during typing pause
  onTypingResumed: (arrayPos, self) => {}, // after typing resumed
  onReset: (self) => {},    // after reset
  onStop: (arrayPos, self) => {}, // after stop
  onStart: (arrayPos, self) => {}, // after start
};

// 5. Implementation in game components (as shown in your files)
// Example from your game files:
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
    
    // Game-specific follow-up actions
    const timer = setTimeout(() => {
      if (window.confirm("Do you want to play again?")) {
        window.location.reload();
      } else {
        navigate("/");
      }
    }, 4000);
    
    return () => clearTimeout(timer);
  }
}, [gameOver, gameWon, navigate]);

