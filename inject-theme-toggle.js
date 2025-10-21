// High Contrast Theme Toggle Script for ProofOfFit
// Run this in the browser console on http://localhost:3000

(function() {
    console.log('🎨 Injecting High Contrast Theme Toggle...');
    
    // Create theme toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🎨 Toggle High Contrast';
    toggleButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background: #3b82f6;
        color: white;
        border: 2px solid #1e40af;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    `;
    
    // Add hover effect
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.background = '#1e40af';
        toggleButton.style.transform = 'scale(1.05)';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.background = '#3b82f6';
        toggleButton.style.transform = 'scale(1)';
    });
    
    // Theme toggle functionality
    let isHighContrast = false;
    
    toggleButton.addEventListener('click', () => {
        const html = document.documentElement;
        
        if (isHighContrast) {
            // Disable high contrast
            html.removeAttribute('data-theme');
            html.classList.remove('high-contrast');
            toggleButton.innerHTML = '🎨 Enable High Contrast';
            toggleButton.style.background = '#3b82f6';
            toggleButton.style.borderColor = '#1e40af';
            isHighContrast = false;
            console.log('✅ High contrast theme disabled');
        } else {
            // Enable high contrast
            html.setAttribute('data-theme', 'high-contrast');
            html.classList.add('high-contrast');
            toggleButton.innerHTML = '🎨 Disable High Contrast';
            toggleButton.style.background = '#fbbf24';
            toggleButton.style.borderColor = '#f59e0b';
            isHighContrast = true;
            console.log('✅ High contrast theme enabled');
        }
    });
    
    // Add button to page
    document.body.appendChild(toggleButton);
    
    // Check if high contrast is already active
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'high-contrast' || html.classList.contains('high-contrast')) {
        isHighContrast = true;
        toggleButton.innerHTML = '🎨 Disable High Contrast';
        toggleButton.style.background = '#fbbf24';
        toggleButton.style.borderColor = '#f59e0b';
    }
    
    console.log('✅ High contrast theme toggle injected successfully!');
    console.log('📍 Toggle button added to top-right corner');
    console.log('🎯 Click the button to test high contrast mode');
    
    // Add keyboard shortcut (Ctrl+Shift+H)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            toggleButton.click();
        }
    });
    
    console.log('⌨️  Keyboard shortcut: Ctrl+Shift+H to toggle theme');
})();
