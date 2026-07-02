// ======================================
// PREMIUM STUDENT MANAGEMENT DASHBOARD
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebarToggle();
    initializeThemeToggle();
});

// --- SIDEBAR TOGGLE ---
function initializeSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// --- THEME TOGGLE (LIGHT/DARK) ---
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = false;

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            isDarkMode = !isDarkMode;

            const icon = themeToggle.querySelector('i');
            if (isDarkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                applyDarkMode();
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                removeDarkMode();
            }
        });
    }
}

function applyDarkMode() {
    // Basic dark mode styling
    document.documentElement.style.setProperty('--bg-primary', '#0f172a');
    document.documentElement.style.setProperty('--bg-card', '#1e293b');
    document.documentElement.style.setProperty('--border-color', '#334155');
    document.documentElement.style.setProperty('--text-primary', '#f8fafc');
    document.documentElement.style.setProperty('--text-muted', '#94a3b8');
}

function removeDarkMode() {
    // Reset to default light mode
    document.documentElement.style.setProperty('--bg-primary', '#f1f5f9');
    document.documentElement.style.setProperty('--bg-card', '#ffffff');
    document.documentElement.style.setProperty('--border-color', '#e2e8f0');
    document.documentElement.style.setProperty('--text-primary', '#1e293b');
    document.documentElement.style.setProperty('--text-muted', '#64748b');
}
