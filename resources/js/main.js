// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

/*
    Function to display information about the Neutralino app.
    This function updates the content of the 'info' element in the HTML
    with details regarding the running Neutralino application, including
    its ID, port, operating system, and version information.
*/
function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT} inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

/*
    Function to open the official Neutralino documentation in the default web browser.
*/
function openDocs() {
    Neutralino.os.open("https://neutralino.js.org/docs");
}

/*
    Function to open a tutorial video on Neutralino's official YouTube channel in the default web browser.
*/
function openTutorial() {
    Neutralino.os.open("https://www.youtube.com/c/CodeZri");
}

/*
    Function to set up a system tray menu with options specific to the window mode.
    This function checks if the application is running in window mode, and if so,
    it defines the tray menu items and sets up the tray accordingly.
*/
function setTray() {
    // Tray menu is only available in window mode
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }

    // Define tray menu items
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };

    // Set the tray menu
    Neutralino.os.setTray(tray);
}

/*
    Function to handle click events on the tray menu items.
    This function performs different actions based on the clicked item's ID,
    such as displaying version information or exiting the application.
*/
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            // Display version information
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "QUIT":
            // Exit the application
            Neutralino.app.exit();
            break;
    }
}

/*
    Function to handle the window close event by gracefully exiting the Neutralino application.
*/
function onWindowClose() {
    Neutralino.app.exit();
}

// Function to check backend connection status
async function checkBackendStatus() {
    try {
        const port = window.backendPort || 3000;
        const response = await fetch(`http://localhost:${port}/status`);
        const data = await response.json();
        document.getElementById('status').textContent = 'Backend Connected';
        document.getElementById('status').style.color = 'green';
        return true;
    } catch (error) {
        document.getElementById('status').textContent = 'Backend Disconnected';
        document.getElementById('status').style.color = 'red';
        console.error('Backend connection error:', error);
        return false;
    }
}

// Function to wait for backend to be ready
async function waitForBackend(maxAttempts = 30, interval = 2000) {
    console.log('Waiting for backend to start...');
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const port = window.backendPort || 3000;
            console.log(`Attempt ${i + 1}/${maxAttempts} to connect to backend on port ${port}...`);
            const response = await fetch(`http://localhost:${port}/status`);
            const data = await response.json();
            console.log('Backend is ready');
            return true;
        } catch (error) {
            console.log(`Waiting for backend... (${i + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
    console.error('Backend failed to start after maximum attempts');
    return false;
}

// Function to start the backend server
async function startBackend() {
    try {
        const response = await fetch('http://localhost:3000/start');
        const data = await response.json();
        console.log('Backend started successfully');
        return { port: data.port };
    } catch (error) {
        console.error('Failed to start backend:', error);
    }
}

// Initialize backend and UI
async function initializeApp() {
    try {
        // Initialize Neutralino
        await Neutralino.init();

        // Set up event listeners
        Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
        Neutralino.events.on("windowClose", onWindowClose);

        // Show app info
        showInfo();

        // Set up tray
        if(NL_OS != "Darwin") { 
            setTray();
        }

        // Start the backend server
        console.log('Starting backend server...');
        const { port } = await startBackend();
        window.backendPort = port;
        console.log('Backend started on port:', port);

        // Wait for backend to be ready
        console.log('Checking backend connection...');
        const backendReady = await waitForBackend();
        
        if (backendReady) {
            console.log('Backend is running and connected');
            // Start periodic status check
            setInterval(checkBackendStatus, 5000);
        } else {
            console.error('Failed to connect to backend');
            document.getElementById('status').textContent = 'Backend Failed to Start';
            document.getElementById('status').style.color = 'red';
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the application
initializeApp();
