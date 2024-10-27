import { words as INITIAL_WORDS } from "../data.js";

const $time = document.querySelector('time')
const $paragraph = document.querySelector('p')
const $input = document.querySelector('#game input')

const $game = document.querySelector('#game')
const $results = document.querySelector('#results')
const $wpm = $results.querySelector('#results-wpm')
const $accuracy = $results.querySelector('#results-accuracy')
const $button = document.querySelector('#reload-button')

const wordCountButtons = document.querySelectorAll('.wordCount button');
const buttonOkCustomWords = document.querySelector('#buttonOkCustomWords');
const wordsInput = document.getElementById('wordsInput');
let inputWordsValue;
let wordCountValue = 50;
let wordCount;

const timeButtons = document.querySelectorAll('.time button');
const buttonOkCustomTime = document.querySelector('#buttonOkCustomTime');
const timeInput = document.getElementById('timeInput');
const customTimeForm = document.getElementById('timePopup');

let customTimeValue;
let selectedTime;

const customWordForm = document.getElementById('wordPopup');

const INITIAL_TIME = 30; //Tiempo inicial
let elapsedTime = 0; // Registrar el tiempo transcurrido

let words = []; //Aquí van a ir todas las palabras que hay que escribir
let currentTime;
let timeValue = INITIAL_TIME; //Este tiempo irá bajando cada segundo

let playing;

setupTimeButtons();
setupWordCountButtons()
initGame();
initEvents();

function setupTimeButtons() {
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedTime = button.getAttribute('timeconfig');
            if (selectedTime === 'custom') {
                // Mostrar el formulario de tiempo personalizado y enfocar el input
                customTimeForm.classList.remove('hidden');
                timeInput.focus();
                $input.disabled = true;

                buttonOkCustomTime.addEventListener('click', function(event) {
                    event.preventDefault();
                    customTimeValue = parseInt(timeInput.value, 10);
                    console.log(`Tiempo personalizado ingresado: ${customTimeValue} segundos`);
                    
                    if (!isNaN(customTimeValue) && customTimeValue > 0 && customTimeValue <= 3600) {
                        timeValue = customTimeValue;
                
                        // Cerrar el formulario de tiempo personalizado
                        customTimeForm.classList.add('hidden');
                        $input.disabled = false;
                        $input.focus();
                
                        initGame(); // Reinicia el juego con el tiempo personalizado
                    } else {
                        alert('Por favor, ingresa un número válido entre 1 y 3600.');
                    }
                })
            } else {
                //Tiempo predeterminado
                timeValue = parseInt(selectedTime, 10);
                console.log(`Tiempo seleccionado: ${timeValue} segundos`);

                // Establecer la clase 'active' solo en el botón seleccionado
                timeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Reiniciar el juego con el nuevo tiempo
                initGame();
            }
        });
    });
}

function setupWordCountButtons(){
    wordCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtén el valor del atributo wordcount del botón
            wordCountValue = button.getAttribute('wordcount');
            if (wordCountValue === 'custom') {                
                // Mostrar el modal y el botón de confirmar
                customWordForm.classList.remove('hidden');
                wordsInput.focus();
                $input.disabled = true;
                $time.style.visibility = 'hidden';

                buttonOkCustomWords.addEventListener('click', function(event) {
                    event.preventDefault()
                    inputWordsValue = parseInt(wordsInput.value, 10);
                    console.log(`Valor ingresado: ${inputWordsValue}`);
                    wordCount = inputWordsValue;

                    // Cerrar el modal y restaurar el enfoque del input principal
                    customWordForm.classList.add('hidden');
                    $input.disabled = false;
                    $input.focus();
                    $time.style.visibility = 'visible';
                    
                    updateWordList(wordCount)
                });
            } else {
                // Es un número predeterminado
                wordCount = parseInt(wordCountValue, 10);
                console.log(`Valor seleccionado: ${wordCount}`);
                initGame(); // Reinicia el juego
            }
        });
    });
}

//Configurar el juego antes de empezarlo
function initGame() {
    //Limpiar los resultados y el input
    $game.style.display = 'flex'
    $results.style.display = 'none'
    $input.value = ''

    playing = false

    if (wordCountValue === 'custom') {
        inputWordsValue = parseInt(wordsInput.value, 10);
        console.log(`Valor ingresado INIT: ${inputWordsValue}`);
        wordCount = inputWordsValue;
    } else {
        //Coge el texto al azar y coge solo las 32 primeras palabras
        words = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
        ).slice(0, wordCountValue);
    }

    currentTime = timeValue; //Aquí se actualiza el tiempo
    $time.textContent = currentTime; //Aquí le pones al elemento del DOM un valor (en este caso el tiempo restante)

    /*Itera sobre cada palabra, la divide en letras (para poder manejar cada letra individualmente) 
    y luego junta las letras (x-letter) para formar la palabra (x-word)*/
    $paragraph.innerHTML = words.map((word, index) => {
        const letters = word.split('') //Separa cada palabra en cada caracter. (PARA --> P,A,R,A)

        //HTML te permite crear tus propias etiquetas (mejor poner un prefijo delante por si hay actualizaciones)
        return `
        <x-word>
            ${
                letters
                .map(letter => `<x-letter>${letter}</x-letter>`)
                .join('')
            }
        </x-word>
        `
    }).join(''); //Esto se pone para que me aparezca como cadena de texto y no como array

    //Coge la primera palabra de todas y le añade la clase "active"
    const $firstWord = $paragraph.querySelector('x-word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('x-letter').classList.add('active') //Selecciono la primera letra de la primera palabra
}

function initEvents() {
    //En algunos navegadores el "autofocus" no funciona bien    
    document.addEventListener('keydown', () => {
        $input.focus()
        $input.addEventListener('keydown', startGameTimer, { once: true });
        $input.addEventListener('keydown', oneKeyDown) //Espacios, retrocesos... (podemos evitar el comportamiento por defecto)
        $input.addEventListener('keyup', oneKeyUp) //Para las teclas normales (ya lo ha introducido)
    
    })

    $button.addEventListener('click', initGame)
}

function oneKeyDown(event) {
    const $currentWord = $paragraph.querySelector('x-word.active') //Buscamos la palabra activa
    const $currentLetter = $currentWord.querySelector('x-letter.active') //Buscamos la letra activa en la palabra activa (la letra que el usuario debería estar escribiendo)

    const {key} = event //Key es la tecla que se pulsa. En el espacio es ' '
    if (key === ' ') {
        event.preventDefault() //Si le das al espacio, no hagas lo típico (es decir, escribir el espacio en el input)

        const $nextWord = $currentWord.nextElementSibling //Coge el siguiente elemento que es igual (es decir, la siguiente palabra)
        const $nextLetter = $nextWord.querySelector('x-letter') // Siguiente letra de la siguiente palabra
        
        //Al darle al espacio, la palabra y la letra activa cambian a la siguiente
        $currentWord.classList.remove('active', 'marked')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''

        //Para poner la linea roja debajo si pasamos la palabra sin acabar de escribirla
        //Seleccionamos todas las letras que no son correct en la palabra actual
        const hasMissedLetters = $currentWord 
        .querySelectorAll('x-letter:not(.correct)').length > 0 //Si faltan letras por escribir en la palabra actual

        //Le añadimos el borde rojo. Si no hay letras, le ponemos el color verde a la letra
        const classToAdd = hasMissedLetters ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd) 
        return
    }

    //Parecido al espacio pero con la anterior
    if (key === 'Backspace') {
        const $prevWord = $currentWord.previousElementSibling //Coge el anterior elemento que es igual (es decir, la anterior palabra)
        const $prevLetter = $currentLetter.previousElementSibling // Anterior letra de la palabra anterior

        //Si estamos en la primera letra de todo el texto, no hacemos nada
        if (!$prevWord && !$prevLetter) {
            event.preventDefault()
            return
        }

        //Si no tengo letra anterior significa que estoy en la primera letra de la siguiente palabra
        const $wordMarked = $paragraph.querySelector('x-word.marked')
        if ($wordMarked && !$prevLetter) {
            event.preventDefault()
            $prevWord.classList.remove('marked')
            $prevWord.classList.add('active')

            const $letterToGo = $prevWord.querySelector('x-letter:last-child')

            $currentLetter.classList.remove('active')
            $letterToGo.classList.add('active')

            $input.value = [
                ...$prevWord.querySelectorAll('x-letter.correct, x-letter.incorrect')
            ].map($el => {
                return $el.classList.contains('correct') ? $el.innerText : '*'
            })
            .join('')
        }
    }
}

/*"oneKeyUp" Se enfoca en validar el texto que el usuario está ingresando y 
marcar las letras como correctas o incorrectas en función de la palabra activa*/
function oneKeyUp() {
    //Recuperamos los elementos actuales
    const $currentWord = $paragraph.querySelector('x-word.active') //Buscamos la palabra activa
    const $currentLetter = $currentWord.querySelector('x-letter.active') //Buscamos la letra activa en la palabra activa (la letra que el usuario debería estar escribiendo)

    const currentWord = $currentWord.innerText.trim() //Obtiene el texto de la palabra activa y le quita los espacios en blanco al principio y al final. Esta será la palabra que el usuario debe escribir
    $input.maxLength = currentWord.length //Para que no pueda escribir más letras de las que tiene la palabra activa
    console.log({value: $input.value}, currentWord); //Muestra el valor actual que ha escrito el usuario y la palabra activa

    const $allLetters = $currentWord.querySelectorAll('x-letter') //Selecciona todas las letras de la palabra activa
    $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect')) //Recorre todas las letras de la palabra activa y elimina las clases correct e incorrect para restablecer su estado visual

    //Recuperar el valor del input
    //Recorre lo que hay escrito en el input y para cada caracter hace lo siguiente
    $input.value.split('').forEach((char, index) => {
        const $letter = $allLetters[index] //Selecciona la letra correspondiente en la palabra actual (activa) basada en la posicion index
        const letterToCheck = currentWord[index] //Selecciona la letra correcta en la misma posicion

        const isCorrect = char === letterToCheck //Compara la letra que ha ingresado el usuario (char) con la letra correcta en esa posición (letterToCheck).
        const letterClass = isCorrect ? 'correct' : 'incorrect' //Asigna la clase correct si la letra ingresada coincide con la esperada; de lo contrario, asigna incorrect.
        $letter.classList.add(letterClass) //Agrega la clase a la letra
    })
    
    //El cursor se podiciona en la letra que corresponde
    //Gestiona cuál es la letra activa a medida que el usuario escribe e identifica si ha llegado al final de la palabra actual
    $currentLetter.classList.remove('active', 'is-last')
    const inputLength = $input.value.length //Numero de caracteres que ha ingresado el usuario
    const $nextActiveLetter = $allLetters[inputLength] //si "inputLength" es 3, se selecciona la cuarta letra de la palabra (índice 3). Esta será la próxima letra en la que el usuario debe concentrarse.

    if ($nextActiveLetter) { //Si hay una siguiente letra (si no es undefined)
        $nextActiveLetter.classList.add('active') //La barra se coloca a la izqr de la letra activa
    } else {
        $currentLetter.classList.add('active', 'is-last') //Se mantiene la letra actual activa y se le añade la clase 'is-last'
      // TODO: gameover si no hay próxima palabra
    }
    
}

//Game Over
function gameOver() {
    //Muestra los resultados y oculta el juego
    $game.style.display = 'none'
    $results.style.display = 'flex'

    //Calcular palabras y letras correctas e incorrectas
    const correctWords = $paragraph.querySelectorAll('x-word.correct').length
    const correctLetter = $paragraph.querySelectorAll('x-letter.correct').length
    const incorrectLetter = $paragraph.querySelectorAll('x-letter.incorrect').length

    //Letras totales
    const totalLetters = correctLetter + incorrectLetter

    //Calcular la precision
    const accuracy = totalLetters > 0
      ? (correctLetter / totalLetters) * 100
        : 0;

    //Calcular WPM    
    /*Muestra la precisión calculada ($accuracy), 
    formateada con dos decimales y un símbolo de porcentaje*/
    const wpm = elapsedTime > 0
        ? (correctWords * 60) / elapsedTime
        : 0;

        // Guardar los resultados en el backend
    fetch('/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accuracy: accuracy.toFixed(2),
            wpm: wpm.toFixed(2)
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Puntuación guardada:', data);
    })
    .catch(error => {
        console.error('Error al guardar la puntuación:', error);
    });
    
    $wpm.textContent = wpm.toFixed(2);
    $accuracy.textContent = `${accuracy.toFixed(2)}%`
}

// Función para actualizar la lista de palabras según el número especificado
function updateWordList(count) {
    // Coge el texto al azar y usa la cantidad seleccionada de palabras
    words = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
    ).slice(0, count);

    // Actualiza el contenido del párrafo con las nuevas palabras
    $paragraph.innerHTML = words.map(word => {
        const letters = word.split('');
        return `
        <x-word>
            ${letters.map(letter => `<x-letter>${letter}</x-letter>`).join('')}
        </x-word>
        `;
    }).join('');

    // Coge la primera palabra de todas y le añade la clase "active"
    const $firstWord = $paragraph.querySelector('x-word');
    $firstWord.classList.add('active');
    $firstWord.querySelector('x-letter').classList.add('active'); // Selecciono la primera letra de la primera palabra
    $input.addEventListener('keydown', initEvents, { once: true });
}

//Tiempo
function startGameTimer() {
    if (!playing) {
        playing = true;
        elapsedTime = 0;
        const intervalId = setInterval(() => {
            currentTime--;
            elapsedTime++;
            $time.textContent = currentTime;

            // Verificar si se acabó el tiempo
            if (currentTime === 0) {
                clearInterval(intervalId);
                gameOver();
            }

            // Verificar si el usuario ha completado todas las palabras
            const $lastWord = $paragraph.querySelector('x-word:last-child');
            const allLettersCorrect = !$lastWord.querySelector('x-letter:not(.correct)');

            if (allLettersCorrect) {
                clearInterval(intervalId);
                gameOver();
            }
        }, 1000);
    }
}