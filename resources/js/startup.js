async function startBackend() {
    try {
        await Neutralino.os.execCommand('node backend/server.js', {
            background: true
        });
        console.log('Backend server started');
    } catch (error) {
        console.error('Failed to start backend:', error);
    }
}

// Export the function
window.startBackend = startBackend;
