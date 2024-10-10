const socket = io('https://whatsappkalpesh.onrender.com', {
    transports: ['websocket', 'polling']
});



    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".scrollable-content");
    var audio = new Audio('/ton1.mp3');
    var audio2 = new Audio('/sendmessage.mp3');

    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
        if(position == 'left'){
            audio.play();
        }
        if(position == 'right'){
            audio2.play();
        }
    }

    const name1 = prompt("Enter your name to join");
    socket.emit('new-user-joined', name1);

    // Listening for new user joined event
    socket.on('user-joined', (name) => {
        append(`${name} joined the chat`, 'left');
    });

    socket.on('user-disconnected', (name) => {
        append(`${name} left the chat`, 'left');
    });

    // Form submission to send messages
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh
        const message = messageInput.value;
        append(`${message}`, 'right');
        socket.emit('send', message); // Send message to the server
        messageInput.value = ''; // Clear the input field
    });

    // Listening for incoming messages (optional, if you are implementing chat)
    socket.on('receive', (data) => {
        append(`${data.name}: ${data.message}`, 'left');
    });
