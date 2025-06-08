import { useTheme, type Theme } from '../hooks/useTheme';
import './ThemeSwitch.css';

export function ThemeSwitch() {
  const { theme, changeTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeTheme(event.target.value as Theme);
  };

  const getThemeIcon = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '💻';
    }
  };

  return (
    <div className="theme-switch">
      <label htmlFor="theme-select" className="theme-switch-label">
        <span className="theme-icon">{getThemeIcon(theme)}</span>
        Theme
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleThemeChange}
        className="theme-select"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
} 