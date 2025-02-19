const API_KEY = "Enter your API KEY"; // Replace with your actual Groq API key
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Groq API Error: ${response.status} - ${errorBody}`); // Log detailed error
      throw new Error(
        `Groq API request failed. Status: ${response.status}. Please check the console for details.`
      ); // User-friendly error
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(
      "Sorry, I encountered an error communicating with the Groq API. Please try again later and check your API key."
    );
  }
}

function appendMessage(content, isUser = false, isError = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(
    isUser ? "user-message" : isError ? "error-message" : "bot-message"
  );
  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true);
    userInput.value = "";

    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ];

      const botResponse = await fetchGroqData(messages);
      appendMessage(botResponse);
    } catch (error) {
      appendMessage(error.message, false, true);
    }
  }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

chatDisplay.innerHTML = ""; // Clear the chat display on page load
// No initial message is added now
