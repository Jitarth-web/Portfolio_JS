import { useState, useEffect, useRef } from 'react';
import { Palette, Volume2, VolumeX } from 'lucide-react';
import song from '../assets/V_J_x_Narvent_-_Memory_Reboot_Slowed_(mp3.pm).mp3';

const themes = [
  { name: 'red', color: '#e53935' },
  { name: 'pink', color: '#e83e8c' },
  { name: 'green', color: '#43a047' },
  { name: 'blue', color: '#085ece' },
  { name: 'orange', color: '#ff6a21' },
  { name: 'purple', color: '#8e44ad' },
  { name: 'teal', color: '#077e7e' },
  { name: 'yellow', color: '#f1c40f' },
  { name: 'indigo', color: '#4b0082' },
  { name: 'black', color: '#000000' },
  

];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('red');
  const [isOpen, setIsOpen] = useState(false);
  const [isHouseHovered, setIsHouseHovered] = useState(false);
  const [isBoneHovered, setIsBoneHovered] = useState(false);
  const [isMusicHovered, setIsMusicHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(song);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHasBeenClicked(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'red';
    setCurrentTheme(savedTheme);
    document.documentElement.className = `theme-${savedTheme}`;
  }, []);

  const activeThemeColor = themes.find(t => t.name === currentTheme)?.color || '#e53935' ;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('portfolio-theme', themeName);
    document.documentElement.className = `theme-${themeName}`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >
      {isOpen && (
        <div
          className="theme-palette-wrapper"
          style={{
            display: 'flex',
            gap: '10px',
            background: 'var(--bg-nav)',
            backdropFilter: 'blur(24px) saturate(145%)',
            padding: '12px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => changeTheme(theme.name)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: theme.color,
                border: currentTheme === theme.name ? '2px solid white' : '2px solid transparent',
                boxShadow: currentTheme === theme.name ? `0 0 12px ${theme.color}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label={`Select ${theme.name} theme`}
            />
          ))}
        </div>
      )}
      <button
        onClick={togglePlay}
        onMouseEnter={() => setIsMusicHovered(true)}
        onMouseLeave={() => setIsMusicHovered(false)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isPlaying || isMusicHovered ? activeThemeColor : 'rgba(255, 255, 255, 0.24)'}`,
          boxShadow: isPlaying || isMusicHovered ? `0 0 20px ${activeThemeColor}80` : 'none',
          transform: isMusicHovered ? 'translateY(-3px)' : 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'white',
        }}
        title={isPlaying ? "Pause Music 🎵" : "Play Music 🔇"}
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <Volume2 size={20} color={activeThemeColor} />
        ) : (
          <VolumeX size={20} color="white" />
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent("toggle-house"));
        }}
        onMouseEnter={() => setIsHouseHovered(true)}
        onMouseLeave={() => setIsHouseHovered(false)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isHouseHovered ? activeThemeColor : 'rgba(255, 255, 255, 0.24)'}`,
          boxShadow: isHouseHovered ? `0 0 20px ${activeThemeColor}80` : 'none',
          transform: isHouseHovered ? 'translateY(-3px)' : 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '20px',
          color: 'white',
        }}
        title="Send Bo Bo to Sleep / Wake Up 🏚️"
        aria-label="Toggle Dog House"
      >
        🏚️
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          // Drop bone at the bottom-left corner of the first page (Hero)
          window.dispatchEvent(new CustomEvent("drop-bone", {
            detail: {
              x: Math.max(80, window.innerWidth * 0.05),
              y: window.innerHeight * 0.7
            }
          }));
        }}
        onMouseEnter={() => setIsBoneHovered(true)}
        onMouseLeave={() => setIsBoneHovered(false)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isBoneHovered ? activeThemeColor : 'rgba(255, 255, 255, 0.24)'}`,
          boxShadow: isBoneHovered ? `0 0 20px ${activeThemeColor}80` : 'none',
          transform: isBoneHovered ? 'translateY(-3px)' : 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '20px',
          color: 'white',
        }}
        title="Feed Bone to Bo Bo 🦴"
        aria-label="Feed Bone"
      >
        🦴
      </button>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasBeenClicked(true);
        }}
        className={(!hasBeenClicked || isOpen) ? "theme-selector-btn-glowing" : ""}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: activeThemeColor,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '--active-theme-color': activeThemeColor,
        }}
        aria-label="Toggle theme palette"
      >
        <Palette 
          size={24} 
          color="#ffffff"
        />
      </button>
    </div>
  );
}
