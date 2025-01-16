async function startBackend() {
    try {
        // Kill any existing Node.js processes
        try {
            await Neutralino.os.execCommand('taskkill /F /IM node.exe', {
                background: true
            });
            console.log('Killed existing Node.js processes');
        } catch (e) {
            console.log('No existing Node.js processes found');
        }

        // Get the resources path
        const resourcesPath = await Neutralino.app.getPath();
        console.log('Resources path:', resourcesPath);
        
        // Start the server
        console.log('Starting backend server...');
        const result = await Neutralino.os.execCommand('node resources/backend/server.js', {
            background: true
        });
        console.log('Backend server start command executed:', result);

        // Wait for status file to be created
        let port = 3000;
        let retries = 0;
        const maxRetries = 10;

        while (retries < maxRetries) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const statusFile = await Neutralino.filesystem.readFile('resources/backend/server-status.json');
                const status = JSON.parse(statusFile);
                port = status.port;
                console.log('Server is running on port:', port);
                break;
            } catch (e) {
                console.log('Waiting for server to start...', retries + 1);
                retries++;
            }
        }

        // Store port in window object for other scripts to use
        window.backendPort = port;
        
        return { port };
    } catch (error) {
        console.error('Failed to start backend:', error);
        throw error;
    }
}

// Export the function
window.startBackend = startBackend;
