import { useTheme } from '../contexts/ThemeContext';

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="4" stroke="#858BB2" strokeWidth="1.5"/>
    <path d="M10 1V3M10 17V19M1 10H3M17 10H19M3.22 3.22L4.64 4.64M15.36 15.36L16.78 16.78M16.78 3.22L15.36 4.64M4.64 15.36L3.22 16.78" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop sidebar — left fixed vertical bar */}
      <aside
        className="hidden md:flex flex-col items-center justify-between fixed left-0 top-0 h-screen z-50 overflow-hidden"
        style={{ width: 103, backgroundColor: '#373B53', borderRadius: '0 20px 20px 0' }}
        aria-label="Main navigation"
      >
        {/* Logo block */}
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 103, height: 103 }}>
           <img src="/logo.png" alt="logo type shii" />
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-6 pb-8">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <div className="w-full h-px" style={{ backgroundColor: '#494E6E' }} />
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#7C5DFA] flex items-center justify-center">

            <img src="/Oval.png" alt="profile image" />
          </div>
        </div>
      </aside>

      {/* Mobile / Tablet top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ height: 72, backgroundColor: '#373B53' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="relative flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ width: 72, height: 72, borderRadius: '0 20px 20px 0' }}>
          <img src="/logo.png" alt="logo" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-5 pr-5">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <div className="h-10 w-px" style={{ backgroundColor: '#494E6E' }} />
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#7C5DFA] flex items-center justify-center">
              <img src="/Oval.png" alt="profile image" />
          </div>
        </div>
      </header>
    </>
  );
};
