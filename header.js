const modeButtons = document.querySelectorAll('.mode button');
        
        const allSections = document.querySelectorAll('#testConfig .time, #testConfig .wordCount, #testConfig .quoteLength, #testConfig .zen, #testConfig .customText');
        let mode = '';

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Desactivar el botón activo actual
        document.querySelector('.mode .active')?.classList.remove('active');

        // Activar el botón que se ha clicado
        button.classList.add('active');

        // Ocultar todas las secciones primero
        allSections.forEach(section => {
            console.log(section);
            section.classList.add('hidden'); // Añadir clase hidden
            section.classList.remove('grid'); // Establecer display: none
        });

        // Mostrar la sección correspondiente al botón clicado
        mode = button.getAttribute('mode');
        // console.log('mode: ' + mode);

        let sectionToShow;
        switch (mode) {
            case 'time':
                sectionToShow = document.querySelector('#testConfig .time');
                break;
            case 'words':
                sectionToShow = document.querySelector('#testConfig .wordCount');
                break;
            case 'quote':
                sectionToShow = document.querySelector('#testConfig .quoteLength');
                break;
            case 'zen':
                sectionToShow = document.querySelector('#testConfig .zen');
                break;
            case 'custom':
                sectionToShow = document.querySelector('#testConfig .customText');
                break;
            default:
                sectionToShow = null;
        }

        // Mostrar la sección correspondiente
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden'); // Remover clase hidden
            sectionToShow.classList.add('grid'); // Añadir clase grid para mostrar como grid
        }
    });
});

const sectionButtons = document.querySelectorAll('.optionSection button');

sectionButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase activa de todos los botones de tiempo
        sectionButtons.forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');
        console.log(button);

        
    });
});

//Coger los valores de las palabras y los segundos