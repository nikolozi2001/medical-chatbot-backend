# Medical Chatbot Backend

This is the backend for a medical chatbot application. The backend uses Google's Gemini API to generate responses to user queries. It also includes a fallback mechanism to provide predefined responses when the API is unavailable.

## Features

- Chatbot API using Google's Gemini API
- Rate limiting to prevent abuse
- Fallback responses for common queries
- Centralized error handling

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/medical-chatbot-backend.git
   cd medical-chatbot-backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:

   ```plaintext
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Server

Start the server:

```sh
node index.js
```

The server will run on `http://localhost:3000`.

## API Endpoints

### POST /chat

Send a message to the chatbot.

- **URL**: `/chat`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "message": "Your question here"
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Chatbot's response"
  }
  ```

### GET /models

List available models from the Gemini API.

- **URL**: `/models`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "model": "model-name",
      "description": "Model description"
    },
    ...
  ]
  ```

## Error Handling

The server includes centralized error handling to manage different types of errors and provide appropriate responses.

## License

This project is licensed under the MIT License.
