// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand();

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// ТВОИ КЛЮЧИ (В продакшене так делать нельзя!)
const OPENROUTER_API_KEY = "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";

function appendMessage(text, role) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerHTML = `${text}<span class="time">${time}</span>`;
    chatContainer.appendChild(msgDiv);
    
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
    return msgDiv;
}

async function handleSend() {
    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Отображаем сообщение пользователя
    appendMessage(text, 'user');
    userInput.value = "";

    // 2. Создаем временное сообщение "Бот думает..."
    const tempMsg = appendMessage("...", 'bot');

    try {
        // 3. Запрос к OpenRouter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.href, // Требование OpenRouter
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "qwen/qwen-2.5-7b-instruct:free",
                "messages": [
                    {"role": "system", "content": "Ты - полезный AI-ассистент. Отвечай кратко."},
                    {"role": "user", "content": text}
                ]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // 4. Заменяем "..." на реальный ответ
        tempMsg.innerHTML = `${aiResponse}<span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        
    } catch (error) {
        console.error("Ошибка API:", error);
        tempMsg.innerText = "Ошибка: не удалось получить ответ. Проверь консоль.";
    }

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

tg.ready();
