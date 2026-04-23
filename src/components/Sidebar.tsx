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
          <div className="absolute inset-0" style={{ backgroundColor: '#7C5DFA', borderRadius: '0 20px 0 0' }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '50%', backgroundColor: '#9277FF', borderRadius: '20px 0 20px 0' }} />
          <span className="relative z-10">
            <svg width="21" height="20" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3657 8.00275C13.5611 7.50895 14.2612 7.50895 14.4566 8.00275L15.8976 11.7087C15.9892 11.9462 16.2142 12.1055 16.4679 12.1185L20.4289 12.3227C20.9574 12.3499 21.172 13.0135 20.7578 13.3584L17.6793 15.8769C17.4806 16.0398 17.3965 16.3008 17.464 16.5459L18.5111 20.3681C18.6513 20.8782 18.0849 21.2877 17.6378 20.9987L14.2676 18.8615C14.0536 18.7277 13.7687 18.7277 13.5547 18.8615L10.1845 20.9987C9.73737 21.2877 9.17098 20.8782 9.31121 20.3681L10.3583 16.5459C10.4258 16.3008 10.3417 16.0398 10.143 15.8769L7.06448 13.3584C6.65025 13.0135 6.86488 12.3499 7.39339 12.3227L11.3544 12.1185C11.6081 12.1055 11.8331 11.9462 11.9247 11.7087L13.3657 8.00275Z" fill="white"/>
            </svg>
          </span>
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
