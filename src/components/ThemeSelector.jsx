import { useState, useEffect } from 'react';

const themes = [
  { name: 'green', color: '#43a047' },
  { name: 'red', color: '#e53935' },
  { name: 'blue', color: '#085ece' },
  { name: 'teal', color: '#077e7e' },
  { name: 'orange', color: '#ff6a21' },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('green');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'green';
    setCurrentTheme(savedTheme);
    document.documentElement.className = `theme-${savedTheme}`;
  }, []);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('portfolio-theme', themeName);
    document.documentElement.className = `theme-${themeName}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(24px) saturate(145%)',
        padding: '12px 18px',
        borderRadius: '999px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
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
  );
}
