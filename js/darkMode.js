
//Light / Night Mode
const switchButton = document.getElementById('switch');
const tooltip = switchButton.querySelector('.tooltip');

// Verifica si hay un tema guardado en el Local Storage
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);

// Cambia el icono según el tema actual
updateSwitchIcon(currentTheme);

switchButton.addEventListener('click', () => {
    // Alternar entre claro y oscuro
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);

    console.log(newTheme);

    // Guardar la preferencia en Local Storage
    localStorage.setItem('theme', newTheme);

    // Cambiar el icono según el tema
    updateSwitchIcon(newTheme);
});

function updateSwitchIcon(theme) {
    const sunIcon = switchButton.querySelector('.fa-sun');
    const moonIcon = switchButton.querySelector('.fa-moon');

    if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
        tooltip.textContent = 'Dark mode';
    } else {
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
        tooltip.textContent = 'Light mode';
    }
}
