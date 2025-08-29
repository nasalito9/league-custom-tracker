#!/usr/bin/env python3
"""
Startup script for the League Custom Tracker Python Backend
"""
import subprocess
import sys
import os

def install_dependencies():
    """Install Python dependencies from requirements.txt"""
    try:
        print("Installing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "../requirements.txt"])
        print("Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False
    return True

def start_server():
    """Start the FastAPI server"""
    try:
        print("Starting Python backend server on http://localhost:8000")
        subprocess.check_call([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except subprocess.CalledProcessError as e:
        print(f"Error starting server: {e}")
        return False
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        return True
    return True

if __name__ == "__main__":
    # Change to the directory where this script is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if dependencies should be installed
    if len(sys.argv) > 1 and sys.argv[1] == "--install":
        if not install_dependencies():
            sys.exit(1)
    
    # Start the server
    start_server() 