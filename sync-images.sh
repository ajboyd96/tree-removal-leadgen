#!/bin/bash

# Tree Removal Website - Image Sync Script
# This script copies images from Desktop folder to project and deploys

echo "🖼️ Syncing images from Desktop to website..."

# Copy all images from Desktop folder
cp ~/Desktop/tree-removal-images/* "/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork/tree-removal-project/images/" 2>/dev/null

# Check if we have images
if [ "$(ls -A ~/Desktop/tree-removal-images/ 2>/dev/null)" ]; then
    echo "✅ Images found and copied:"
    ls -la "/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork/tree-removal-project/images/"
    
    # Add to git
    cd "/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork/tree-removal-project"
    git add images/
    
    # Commit with timestamp
    git commit -m "Update website images - $(date '+%Y-%m-%d %H:%M')"
    
    # Push to deploy
    git push netlify-repo main
    
    echo "🚀 Images deployed to website!"
    echo "🌐 Your website will update in 1-2 minutes"
else
    echo "📁 No images found in ~/Desktop/tree-removal-images/"
    echo "💡 Add images to the folder and run this script again"
fi