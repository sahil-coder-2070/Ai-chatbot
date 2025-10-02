(() => {
    const messagesEl = document.getElementById('messages');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');



    function appendMessage({ role = 'assistant', text = '', typing = false }) {
        const msg = document.createElement('div');
        msg.className = 'msg' + (role === 'user' ? ' user' : '');
        msg.setAttribute('role', 'article');

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = role === 'user' ? 'You' : 'AI';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        if (typing) {
            const t = document.createElement('div');
            t.className = 'typing';
            t.innerHTML = '<span></span><span></span><span></span>';
            bubble.appendChild(t);
        } else {
            bubble.innerHTML = text.replace(/\n/g, '<br>');
        }

        msg.appendChild(avatar);
        msg.appendChild(bubble);
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return { msg, bubble };
    }
    function simulateReply(userText) {
        const { msg, bubble } = appendMessage({ role: 'assistant', typing: true });

        setTimeout(async () => {
            const reply = await generateReply(userText);
            bubble.innerHTML = reply.replace(/\n/g, '<br>');
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 900 + Math.min(2000, userText.length * 30));
    }

    // ...existing code...
    async function generateReply(input) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": process.env.OPENROUTER_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-chat-v3.1:free",
                    messages: [
                        {
                            content: input,
                            role: "user"
                        }
                    ]
                }),
            });

            const body = await response.json();
            const content = body?.choices?.[0]?.message?.content;
            return content ?? "No content returned from API.";
        } catch (err) {
            console.error(err);
            return `Error: ${err.message || err}`;
        }
    }
    // Initial message
    sendBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (!value) return;
        appendMessage({ role: 'user', text: value });
        input.value = '';
        simulateReply(value);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    clearBtn.addEventListener('click', () => {
        // Clear messages and keep a starter message
        messagesEl.innerHTML = '';
        appendMessage({ role: 'assistant', text: "Conversation cleared. How can I help you today?" });
    });

    // initial focus
    input.focus();
})();


// // Chat completion (POST /chat/completions)
// const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     "Authorization": "Bearer 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",
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     "model": "deepseek/deepseek-chat-v3.1:free",
//     "messages": [
//       {
//         "content": "what is open source project ",
//         "role": "user"
//       }
//     ]
//   }),
// });

// const body = await response.json();
// // console.log(body);
// console.log(body.choices[0].message.content);