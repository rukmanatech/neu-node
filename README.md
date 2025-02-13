# Backend Status Monitor

A Neutralino.js application that monitors the status of a Node.js backend server. The application automatically starts the backend server and provides real-time connection status monitoring.

## Features

- Automatic backend server startup
- Real-time connection status monitoring
- Visual status indicators (green for connected, red for disconnected)
- Auto-refresh status every 5 seconds

## Project Structure

```
myapp/
├── backend/
│   └── server.js         # Node.js Express backend server
├── resources/
│   ├── js/
│   │   ├── startup.js    # Backend auto-start functionality
│   │   ├── main.js       # Main application logic
│   │   └── neutralino.js # Neutralino framework
│   ├── index.html        # Main UI
│   └── styles.css        # Application styles
└── neutralino.config.json # Neutralino configuration
```

## Prerequisites

- Node.js
- Neutralino.js CLI (`neu-cli`)

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install Neutralino dependencies:
   ```bash
   neu update
   ```

## Running the Application

Simply run:
```bash
neu run
```

This will:
1. Start the Neutralino application
2. Automatically start the backend server
3. Begin monitoring the connection status

## How It Works

1. **Backend Server**:
   - Express.js server running on port 3000
   - Provides `/status` endpoint for connection checking

2. **Frontend**:
   - Neutralino.js desktop application
   - Automatically starts the backend server on launch
   - Periodically checks backend connection status
   - Updates UI to reflect current connection state

3. **Auto-start System**:
   - `startup.js` handles backend server initialization
   - Uses Neutralino's native API to execute Node.js server
   - Ensures backend is ready when application starts

## Development

- Backend code is in `backend/server.js`
- Frontend UI is in `resources/index.html`
- Main application logic is in `resources/js/main.js`
- Backend startup logic is in `resources/js/startup.js`

## License

[MIT License](LICENSE)
#   n e u - n o d e  
 