# StreamingLLM

A real-time streaming chat application built with React and Node.js that supports AI-powered streaming responses.

---

# Features

* Real-time AI streaming responses
* React frontend
* Node.js backend
* Environment variable support
* Clean project structure
* API integration support

---

# Tech Stack

## Frontend

* React Native

## Backend

* Node.js
* Express
* Streaming APIs

---

# Project Structure

```bash
streamingLLM/
├── streaming-backend/
├── StreamingChatApp/
├── package.json
└── README.md
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone git@github.com:tanwiz13/streamingLLM.git
cd streamingLLM
```

---

# Frontend Setup

## 1. Navigate to Frontend

```bash
cd StreamingChatApp
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Frontend Server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# Backend Setup

## 1. Navigate to Backend

```bash
cd streaming-backend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment Variables

Create a `.env` file inside `streaming-backend`.

Example:

```env
GROQ_API_KEY=your_api_key_here
PORT=5000
```

---

# Important Security Note

Never push your `.env` file or API keys to GitHub.

Add this to `.gitignore`:

```gitignore
node_modules
.env
*.env
dist
build
```

---

## 4. Start Backend Server

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

# Running the Full Application

Start both:

* Frontend server
* Backend server

Then open:

```bash
http://localhost:5173
```

---

# Common Issues

## Push Protection Error

If GitHub blocks your push due to secrets:

* Remove `.env` from Git tracking
* Add `.env` to `.gitignore`
* Recreate Git history if necessary
* Regenerate exposed API keys

---

# Environment Variables

| Variable     | Description         |
| ------------ | ------------------- |
| GROQ_API_KEY | Groq API key        |
| PORT         | Backend server port |

---

# License

MIT License
