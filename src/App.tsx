import { useState, useEffect } from 'react';

interface GameState {
  currentRoom: number;
  fragments: string[];
  roomsCompleted: boolean[];
  answers: { [key: number]: string };
  username: string;
  gameStarted: boolean;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 1,
    fragments: [],
    roomsCompleted: [false, false, false, false, false, false],
    answers: {},
    username: '',
    gameStarted: false
  });

  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

  const roomColors = {
    0: { bg: '#0a0a0a', accent: '#8b5cf6', text: '#e9d5ff' }, // Welcome screen
    1: { bg: '#1a0d2e', accent: '#8b5cf6', text: '#e9d5ff' },
    2: { bg: '#0d1821', accent: '#3b82f6', text: '#dbeafe' },
    3: { bg: '#1e3a1a', accent: '#22c55e', text: '#dcfce7' },
    4: { bg: '#3a1a1a', accent: '#ef4444', text: '#fee2e2' },
    5: { bg: '#3a2a1a', accent: '#f59e0b', text: '#fef3c7' },
    6: { bg: '#0a0a0a', accent: '#ffffff', text: '#f5f5f5' }
  };

  const rooms = {
    1: {
      title: 'The Paradox Cipher',
      description: 'A cryptic inscription reads: "I am the beginning of eternity, the end of time and space, the beginning of every end, and the end of every place." Solve the riddle to claim your first fragment.',
      puzzle: 'What letter am I?',
      answer: 'E',
      fragment: '1',
      explanation: 'The letter "E" appears at the beginning and end of the words described. The answer was hidden in plain sight.'
    },
    2: {
      title: 'The Forgotten Constellation',
      description: 'An ancient star map shows a constellation with coordinates. Each star is labeled with a number sequence that forms a pattern.',
      puzzle: '2, 3, 5, 7, 11, 13, 17, 19, __. What is the next number in this celestial sequence?',
      answer: '23',
      fragment: 'I',
      explanation: 'The sequence follows prime numbers. The next prime after 19 is 23.'
    },
    3: {
      title: 'The Reflection Paradox',
      description: 'A mirror room where words appear backwards. One phrase is written: "DESSERTS" - but when you look at its reflection...',
      puzzle: 'What word appears when you reverse "DESSERTS"?',
      answer: 'STRESSED',
      fragment: 'H',
      explanation: 'Sometimes what seems sweet is actually the opposite when viewed from another perspective.'
    },
    4: {
      title: 'The Silent Symphony',
      description: 'A musical staff with one rest in an otherwise complete measure.',
      puzzle: 'In music, what symbol represents complete silence?',
      answer: 'REST',
      fragment: '_',
      explanation: 'Silence is as important as sound in music.'
    },
    5: {
      title: 'The Empty List',
      description: 'A census of names, but one line remains blank.',
      puzzle: 'Names: Alice, Bob, Charlie, Dave, _____. The pattern reveals the missing name.',
      answer: 'EVE',
      fragment: 'R',
      explanation: 'Every list has gaps we must discover to complete.'
    },
    6: {
      title: 'THE MISSING FRAME',
      description: 'You have collected fragments from each room. Arrange them to reveal the final answer.',
      puzzle: 'Combine your fragments in order to spell the word.',
      answer: '1IH_R',
      fragment: '',
      explanation: 'The answer was always "HIRING" - you just needed to see the complete picture.'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms[gameState.currentRoom as keyof typeof rooms];
    
    if (inputValue.toUpperCase().trim() === room.answer.toUpperCase()) {
      setFeedback('Correct! ' + room.explanation);
      
      const newFragments = [...gameState.fragments];
      if (room.fragment && !newFragments.includes(room.fragment)) {
        newFragments.push(room.fragment);
      }
      
      const newCompleted = [...gameState.roomsCompleted];
      newCompleted[gameState.currentRoom - 1] = true;
      
      setGameState({
        ...gameState,
        fragments: newFragments,
        roomsCompleted: newCompleted,
        answers: { ...gameState.answers, [gameState.currentRoom]: inputValue }
      });
      
      setInputValue('');
      
      setTimeout(() => {
        if (gameState.currentRoom < 6) {
          setGameState(prev => ({ ...prev, currentRoom: prev.currentRoom + 1 }));
          setFeedback('');
        }
      }, 2000);
    } else {
      setFeedback('Not quite. Try again.');
    }
  };

  const goToRoom = (roomNum: number) => {
    if (roomNum === 6 && gameState.fragments.length < 5) {
      setFeedback('Collect all fragments before entering the final room.');
      return;
    }
    setGameState({ ...gameState, currentRoom: roomNum });
    setInputValue('');
    setFeedback('');
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setGameState({
        ...gameState,
        username: usernameInput.trim(),
        gameStarted: true
      });
    }
  };

  // Show welcome screen if game hasn't started
  if (!gameState.gameStarted) {
    const welcomeColor = roomColors[0 as keyof typeof roomColors];
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: welcomeColor.bg,
        color: welcomeColor.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${welcomeColor.accent}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${welcomeColor.accent}10 0%, transparent 50%)`,
          animation: 'pulse 8s ease-in-out infinite'
        }} />
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 30px ${welcomeColor.accent}40; }
            50% { box-shadow: 0 0 60px ${welcomeColor.accent}60; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        <div style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '50px 40px',
          borderRadius: '20px',
          border: `2px solid ${welcomeColor.accent}`,
          boxShadow: `0 0 50px ${welcomeColor.accent}40`,
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.8s ease-out, glowPulse 3s ease-in-out infinite'
        }}>
          {/* Tour Arcade Presents */}
          <div style={{
            fontSize: '0.9rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            opacity: 0.6,
            marginBottom: '15px',
            textAlign: 'center',
            animation: 'fadeInUp 1s ease-out 0.2s backwards'
          }}>
            Tour Arcade Presents
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: welcomeColor.accent,
            letterSpacing: '3px',
            textAlign: 'center',
            textShadow: `0 0 20px ${welcomeColor.accent}80`,
            animation: 'fadeInUp 1s ease-out 0.4s backwards'
          }}>
            THE MISSING FRAME
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            marginBottom: '30px',
            textAlign: 'center',
            lineHeight: '1.6',
            animation: 'fadeInUp 1s ease-out 0.6s backwards'
          }}>
            Welcome to an escape room experience where answers are never where the questions are. Navigate through 6 mysterious rooms, each hiding a crucial fragment. Only by collecting all pieces will the final truth be revealed.
          </p>

          <div style={{
            backgroundColor: 'rgba(139,92,246,0.15)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid rgba(139,92,246,0.4)',
            animation: 'fadeInUp 1s ease-out 0.8s backwards'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              marginBottom: '10px',
              color: welcomeColor.accent,
              textShadow: `0 0 10px ${welcomeColor.accent}60`
            }}>
              The Rules:
            </h3>
            <ul style={{
              fontSize: '0.95rem',
              opacity: 0.8,
              paddingLeft: '20px',
              lineHeight: '1.8'
            }}>
              <li>Each room presents a puzzle focused on absence and omission</li>
              <li>Solve puzzles to collect fragments</li>
              <li>The fragments only make sense when combined</li>
              <li>Complete all 5 rooms to unlock the final revelation</li>
            </ul>
          </div>

          <form onSubmit={handleStartGame} style={{
            animation: 'fadeInUp 1s ease-out 1s backwards'
          }}>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              marginBottom: '10px',
              color: welcomeColor.accent,
              textShadow: `0 0 10px ${welcomeColor.accent}60`
            }}>
              Enter your name to begin:
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Your name..."
              required
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: `2px solid ${welcomeColor.accent}`,
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: welcomeColor.text,
                marginBottom: '20px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${welcomeColor.accent}60`;
                e.currentTarget.style.borderColor = welcomeColor.accent;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: welcomeColor.accent,
                color: '#000',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${welcomeColor.accent}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Enter the Missing Frame
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentRoomData = rooms[gameState.currentRoom as keyof typeof rooms];
  const currentColor = roomColors[gameState.currentRoom as keyof typeof roomColors];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentColor.bg,
      color: currentColor.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.5s ease',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: currentColor.accent,
            letterSpacing: '2px'
          }}>
            THE MISSING FRAME
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            Welcome, {gameState.username}
          </p>
        </div>

        {/* Room Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => goToRoom(num)}
              style={{
                padding: '10px 20px',
                backgroundColor: gameState.currentRoom === num ? currentColor.accent : 'rgba(255,255,255,0.1)',
                color: gameState.currentRoom === num ? '#000' : currentColor.text,
                border: gameState.roomsCompleted[num - 1] ? `2px solid ${currentColor.accent}` : '2px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: gameState.currentRoom === num ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              Room {num} {gameState.roomsCompleted[num - 1] ? '✓' : ''}
            </button>
          ))}
        </div>

        {/* Fragments Display */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: `1px solid ${currentColor.accent}`
        }}>
          <div style={{ fontSize: '0.9rem', marginBottom: '5px', opacity: 0.7 }}>
            Collected Fragments:
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: currentColor.accent,
            minHeight: '40px',
            alignItems: 'center'
          }}>
            {gameState.fragments.length > 0 ? (
              gameState.fragments.map((frag, idx) => (
                <span key={idx} style={{
                  padding: '5px 15px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px'
                }}>
                  {frag}
                </span>
              ))
            ) : (
              <span style={{ opacity: 0.5, fontSize: '1rem' }}>None yet</span>
            )}
          </div>
        </div>

        {/* Current Room */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: '30px',
          borderRadius: '16px',
          border: `2px solid ${currentColor.accent}`,
          boxShadow: `0 0 30px ${currentColor.accent}40`
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '15px',
            color: currentColor.accent
          }}>
            {currentRoomData.title}
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '25px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            {currentRoomData.description}
          </p>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: currentColor.accent,
              marginBottom: '10px'
            }}>
              Puzzle:
            </div>
            <div style={{ fontSize: '1.1rem' }}>
              {currentRoomData.puzzle}
            </div>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your answer..."
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: `2px solid ${currentColor.accent}`,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: currentColor.text,
                marginBottom: '15px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: currentColor.accent,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Submit Answer
            </button>
          </form>

          {/* Feedback */}
          {feedback && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: feedback.includes('Correct') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
              border: `1px solid ${feedback.includes('Correct') ? '#22c55e' : '#ef4444'}`,
              borderRadius: '8px',
              fontSize: '1rem'
            }}>
              {feedback}
            </div>
          )}
        </div>

        {/* Final Victory */}
        {gameState.currentRoom === 6 && gameState.roomsCompleted[5] && (
          <div style={{
            marginTop: '30px',
            padding: '30px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            border: '2px solid #ffffff',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              🎉 CONGRATULATIONS! 🎉
            </h2>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '15px'
            }}>
              You've completed THE MISSING FRAME
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: currentColor.accent
            }}>
              The answer is: HIRING
            </p>
            <p style={{
              marginTop: '20px',
              fontSize: '1.1rem',
              opacity: 0.9
            }}>
              Sometimes the most important pieces are the ones we overlook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}