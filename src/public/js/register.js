async function handleRegister(event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.textContent = 'Usuario registrado correctamente';
            messageDiv.style.color = 'green';
        } else {
            const errorMessage = await response.text();
            messageDiv.textContent = errorMessage;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al registrar:', error);
    }
}