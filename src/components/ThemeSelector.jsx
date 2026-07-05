import { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';

const themes = [
  { name: 'green', color: '#43a047' },
  { name: 'red', color: '#e53935' },
  { name: 'blue', color: '#085ece' },
  { name: 'orange', color: '#ff6a21' },
  { name: 'purple', color: '#8e44ad' },
  { name: 'pink', color: '#e83e8c' },
  { name: 'teal', color: '#077e7e' },
  { name: 'yellow', color: '#f1c40f' },
  { name: 'indigo', color: '#4b0082' },
  { name: 'black', color: '#000000' },
  

];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('green');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
    setCurrentTheme(savedTheme);
    document.documentElement.className = `theme-${savedTheme}`;
  }, []);

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
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: themes.find(t => t.name === currentTheme)?.color || '#43a047',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `0 0 20px ${themes.find(t => t.name === currentTheme)?.color || '#43a047'}40`,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
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
