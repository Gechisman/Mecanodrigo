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

// document.getElementById('registerForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Evita el envío por defecto del formulario
    
//     const formData = new FormData(event.target);

//     try {
//         const response = await fetch('/register', {
//             method: 'POST',
//             body: formData,
//         });
        
//         const data = await response.json();
        
//         if (data.success) {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Registro exitoso',
//                 text: data.message,
//                 confirmButtonText: 'Aceptar',
//             }).then(() => {
//                 window.location.href = '/';
//             });
//         } else {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: data.message,
//                 confirmButtonText: 'Aceptar',
//             });
//         }
//     } catch (error) {
//         console.error('Error al registrar:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Hubo un problema al intentar registrarse. Intenta nuevamente.',
//             confirmButtonText: 'Aceptar',
//         });
//     }
// });

