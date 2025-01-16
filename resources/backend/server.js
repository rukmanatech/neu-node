const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const net = require('net');

// Log startup information
console.log('Starting backend server...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Function to check if port is in use
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', () => resolve(true))
            .once('listening', () => {
                server.close();
                resolve(false);
            })
            .listen(port);
    });
}

// Function to find available port
async function findAvailablePort(startPort) {
    let port = startPort;
    while (await isPortInUse(port)) {
        console.log(`Port ${port} is in use, trying next port...`);
        port++;
    }
    return port;
}

async function startServer() {
    try {
        // Check if node_modules exists
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
            console.log('node_modules found at:', nodeModulesPath);
            const modules = fs.readdirSync(nodeModulesPath);
            console.log('Installed modules:', modules);
        } else {
            console.error('node_modules not found at:', nodeModulesPath);
            process.exit(1);
        }

        const app = express();
        
        // Find available port
        const port = await findAvailablePort(3000);
        console.log(`Using port: ${port}`);

        // Enable CORS
        app.use(cors());
        console.log('CORS enabled');

        // Add error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({ error: err.message });
        });

        // Status endpoint
        app.get('/status', (req, res) => {
            console.log('Status endpoint called');
            res.json({ status: 'connected', port: port });
        });

        // Start endpoint
        app.get('/start', (req, res) => {
            console.log('Start endpoint called');
            res.json({ status: 'started', port: port });
        });

        // Create status file with port information
        const statusFile = path.join(process.cwd(), 'server-status.json');
        fs.writeFileSync(statusFile, JSON.stringify({ port: port }));

        // Start server
        const server = app.listen(port, () => {
            console.log(`Backend server running at http://localhost:${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use`);
            }
        });

        // Handle process termination
        process.on('SIGTERM', () => {
            console.log('Received SIGTERM signal. Closing server...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
