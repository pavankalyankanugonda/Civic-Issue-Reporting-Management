# Script to download Maven and build the backend

$mavenVersion = "3.9.6"
$mavenDownloadUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenHome = "C:\apache-maven-$mavenVersion"
$projectDir = Get-Location

# Download Maven if not exists
if (-not (Test-Path $mavenHome)) {
    Write-Host "Downloading Apache Maven $mavenVersion..."
    Invoke-WebRequest -Uri $mavenDownloadUrl -OutFile "$env:TEMP\maven.zip"
    
    Write-Host "Extracting Maven..."
    Expand-Archive -Path "$env:TEMP\maven.zip" -DestinationPath "C:\"
    Remove-Item "$env:TEMP\maven.zip"
}

# Add Maven to PATH
$env:PATH = "$mavenHome\bin;$env:PATH"

# Navigate to backend directory
Set-Location "$projectDir\backend"

# Build the backend
Write-Host "Building backend..."
& "$mavenHome\bin\mvn.cmd" clean install -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Backend is ready to start."
} else {
    Write-Host "Build failed. Please check the error messages above."
}
