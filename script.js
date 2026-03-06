// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, role) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerHTML = `${text}<span class="time">${time}</span>`;
    chatContainer.appendChild(msgDiv);
    
    // Плавная прокрутка вниз
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function handleSend() {
    const text = userInput.value.trim();
    if (text === "") return;

    // Добавляем сообщение пользователя
    appendMessage(text, 'user');
    userInput.value = "";

    // Имитация ответа бота (здесь в будущем будет запрос к вашему API)
    setTimeout(() => {
        appendMessage("Это скелет ответа. Скоро я буду подключен к OpenAI!", 'bot');
    }, 1000);
}

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

// Уведомляем Telegram, что приложение готово
tg.ready();
