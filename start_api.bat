@echo off
echo Starting HeightScale API Server...
echo.
echo API will be available at:
echo   - Local: http://localhost:8000
echo   - Network: http://YOUR_IP:8000
echo.
echo Press Ctrl+C to stop the server
echo.
C:\Users\janne\Documents\GitHub\HeightScale\.venv\Scripts\python.exe C:\Users\janne\Documents\GitHub\HeightScale\api_server.py
pause
