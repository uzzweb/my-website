// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.supportedThemes = ['light', 'dark'];
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.createThemeSwitcher();
        this.applyTheme();
        this.bindEvents();
        this.autoSwitchTheme();
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && this.supportedThemes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Auto-detect based on time
            this.currentTheme = this.getTimeBasedTheme();
        }
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        // Dark mode between 6 PM and 6 AM
        return (hour >= 18 || hour < 6) ? 'dark' : 'light';
    }
    
    createThemeSwitcher() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;
        
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) return;
        
        // Update the existing theme switcher
        this.updateThemeSwitcher();
    }
    
    updateThemeSwitcher() {
        const themeCurrent = document.querySelector('.theme-current');
        const themeName = document.querySelector('.theme-name');
        const themeIcon = document.querySelector('.theme-current i');
        
        if (!themeCurrent || !themeName || !themeIcon) return;
        
        if (this.currentTheme === 'dark') {
            themeIcon.className = 'fas fa-moon';
            themeName.textContent = 'Qorong\'i rejim';
        } else {
            themeIcon.className = 'fas fa-sun';
            themeName.textContent = 'Yorug\' rejim';
        }
    }
    
    bindEvents() {
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) return;
        
        const current = themeSwitcher.querySelector('.theme-current');
        const dropdown = themeSwitcher.querySelector('.theme-dropdown');
        const options = themeSwitcher.querySelectorAll('.theme-option');
        
        // Toggle dropdown
        current.addEventListener('click', () => {
            themeSwitcher.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeSwitcher.contains(e.target)) {
                themeSwitcher.classList.remove('active');
            }
        });
        
        // Handle theme selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.changeTheme(theme);
                themeSwitcher.classList.remove('active');
            });
        });
    }
    
    changeTheme(theme) {
        if (theme === this.currentTheme) return;
        
        this.currentTheme = theme;
        localStorage.setItem('selectedTheme', theme);
        this.applyTheme();
        this.updateThemeSwitcher();
        this.showThemeNotification();
    }
    
    applyTheme() {
        // Remove existing theme classes
        document.body.classList.remove('light-theme', 'dark-theme');
        
        // Add current theme class
        document.body.classList.add(`${this.currentTheme}-theme`);
        
        // Update meta theme-color
        this.updateMetaThemeColor();
    }
    
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = this.currentTheme === 'dark' ? '#2c3e50' : '#ffffff';
    }
    
    autoSwitchTheme() {
        // Check for theme changes every minute
        setInterval(() => {
            const timeBasedTheme = this.getTimeBasedTheme();
            if (timeBasedTheme !== this.currentTheme && !localStorage.getItem('selectedTheme')) {
                this.changeTheme(timeBasedTheme);
            }
        }, 60000); // Check every minute
    }
    
    showThemeNotification() {
        if (typeof showNotification === 'function') {
            const themeName = this.currentTheme === 'dark' ? 'Qorong\'i rejim' : 'Yorug\' rejim';
            showNotification(`Mavzu o'zgartirildi: ${themeName}`, 'success');
        }
    }
    
    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Public method to check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const themeManager = new ThemeManager();
    window.themeManager = themeManager;
});