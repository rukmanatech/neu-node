$sourceBackend = ".\resources\backend"
$distFolder = ".\dist"

# Create backend folder in dist if it doesn't exist
New-Item -ItemType Directory -Force -Path "$distFolder\resources\backend" | Out-Null

# Copy backend files and node_modules
Copy-Item -Path "$sourceBackend\*" -Destination "$distFolder\resources\backend" -Recurse -Force

Write-Host "Backend files copied successfully!"
