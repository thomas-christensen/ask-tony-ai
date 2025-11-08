#!/bin/bash
# Script to install cursor-agent CLI during build (for Railway/production)

echo "📦 Installing cursor-agent CLI..."

# Check if cursor-agent is already installed
if command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent already installed"
    cursor-agent --version 2>/dev/null || echo "(version check skipped)"
    exit 0
fi

# Install cursor-agent
echo "Installing cursor-agent from https://cursor.com/install..."
curl -fsS https://cursor.com/install | bash

# Add to PATH for current session
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
if command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent installed successfully"
    cursor-agent --version 2>/dev/null || echo "Installation complete"
else
    echo "⚠️ cursor-agent installation may have issues"
    echo "Checking if binary exists..."
    ls -la ~/.local/bin/cursor-agent 2>/dev/null || echo "Binary not found in ~/.local/bin"
    echo "The app will still work if CURSOR_API_KEY is set"
fi

exit 0

