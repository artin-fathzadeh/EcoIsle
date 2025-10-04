#!/bin/bash

# EcoIsle Map Engine Switcher
# Quick utility to switch between Cesium and Three.js

set -e

echo "🌍 EcoIsle Map Engine Switcher"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
fi

# Function to show current engine
show_current() {
    if grep -q "VITE_MAP_ENGINE=cesium" .env 2>/dev/null; then
        echo "Current engine: 🌐 Cesium (3D Globe)"
    elif grep -q "VITE_MAP_ENGINE=threejs" .env 2>/dev/null; then
        echo "Current engine: 🎮 Three.js (Original)"
    else
        echo "Current engine: ⚠️  Not configured"
    fi
}

# Function to set engine
set_engine() {
    local engine=$1
    
    # Remove existing VITE_MAP_ENGINE line
    if grep -q "VITE_MAP_ENGINE" .env; then
        # Use different sed syntax for Linux vs macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' '/VITE_MAP_ENGINE/d' .env
        else
            sed -i '/VITE_MAP_ENGINE/d' .env
        fi
    fi
    
    # Add new VITE_MAP_ENGINE line
    echo "VITE_MAP_ENGINE=$engine" >> .env
    
    echo "✅ Map engine set to: $engine"
}

# Show current engine
show_current
echo ""

# Main menu
echo "Choose an option:"
echo "  1) Switch to Cesium (3D Globe)"
echo "  2) Switch to Three.js (Original)"
echo "  3) Show current engine"
echo "  4) Exit"
echo ""
echo -n "Enter choice [1-4]: "

read choice

case $choice in
    1)
        echo ""
        echo "🌐 Switching to Cesium..."
        set_engine "cesium"
        echo ""
        echo "ℹ️  Please restart your dev server:"
        echo "   npm run dev"
        ;;
    2)
        echo ""
        echo "🎮 Switching to Three.js..."
        set_engine "threejs"
        echo ""
        echo "ℹ️  Please restart your dev server:"
        echo "   npm run dev"
        ;;
    3)
        echo ""
        show_current
        ;;
    4)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run again."
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
