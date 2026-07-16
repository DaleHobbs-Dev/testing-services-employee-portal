import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            const isDarkMode = saved === 'true';
            // Apply the class immediately during initialization
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return isDarkMode;
        }
        // Default new sessions to light mode.
        document.documentElement.classList.remove('dark');
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save preference
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    const toggle = () => setIsDark(!isDark);

    return { isDark, toggle };
}
