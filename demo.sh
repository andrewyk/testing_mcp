#!/bin/bash

# Demo script to showcase the Comprehensive Todo Application API
# This script demonstrates various API operations

API_URL="http://localhost:3001/api"

echo "🎯 Comprehensive Todo Application - API Demo"
echo "=============================================="
echo ""

# Check if server is running
echo "1️⃣  Checking server health..."
HEALTH=$(curl -s "${API_URL}/health")
if [ $? -eq 0 ]; then
    echo "✅ Server is running!"
    echo "$HEALTH" | python3 -m json.tool
    echo ""
else
    echo "❌ Server is not running. Please start it with: npm start"
    exit 1
fi

# Get dashboard stats
echo "2️⃣  Fetching dashboard statistics..."
curl -s "${API_URL}/dashboard/stats" | python3 -m json.tool
echo ""

# List all projects
echo "3️⃣  Listing all projects..."
curl -s "${API_URL}/projects" | python3 -m json.tool
echo ""

# Create a new project
echo "4️⃣  Creating a new project..."
NEW_PROJECT=$(curl -s -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Project",
    "description": "A project created by the demo script",
    "color": "#FF6B6B",
    "icon": "🚀"
  }')
echo "$NEW_PROJECT" | python3 -m json.tool
PROJECT_ID=$(echo "$NEW_PROJECT" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo ""

# Create some tasks
echo "5️⃣  Creating sample tasks..."

# Task 1: High priority
curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the new feature",
    "priority": "high",
    "status": "in_progress",
    "projectId": "'"$PROJECT_ID"'",
    "tags": ["documentation", "urgent"],
    "dueDate": "2025-12-15T17:00:00Z"
  }' | python3 -m json.tool
echo ""

# Task 2: Medium priority
curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull requests",
    "description": "Review pending PRs from team members",
    "priority": "medium",
    "status": "not_started",
    "projectId": "'"$PROJECT_ID"'",
    "tags": ["code-review", "team"]
  }' | python3 -m json.tool
echo ""

# Task 3: Low priority
curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Update dependencies",
    "description": "Check and update npm packages to latest versions",
    "priority": "low",
    "status": "not_started",
    "projectId": "'"$PROJECT_ID"'",
    "tags": ["maintenance", "dependencies"]
  }' | python3 -m json.tool
echo ""

# List all tasks
echo "6️⃣  Listing all tasks..."
curl -s "${API_URL}/tasks" | python3 -m json.tool
echo ""

# Filter tasks by priority
echo "7️⃣  Filtering high priority tasks..."
curl -s "${API_URL}/tasks?priority=high" | python3 -m json.tool
echo ""

# Filter tasks by project
echo "8️⃣  Filtering tasks for Demo Project..."
curl -s "${API_URL}/tasks?projectId=${PROJECT_ID}" | python3 -m json.tool
echo ""

# Get project statistics
echo "9️⃣  Getting project statistics..."
curl -s "${API_URL}/projects/${PROJECT_ID}/stats" | python3 -m json.tool
echo ""

# Search tasks
echo "🔟 Searching for tasks with 'review'..."
curl -s "${API_URL}/tasks?search=review" | python3 -m json.tool
echo ""

# Get updated dashboard stats
echo "1️⃣1️⃣  Updated dashboard statistics..."
curl -s "${API_URL}/dashboard/stats" | python3 -m json.tool
echo ""

echo "✨ Demo completed! You can now:"
echo "   - Open public/index.html to see the UI"
echo "   - Continue testing with: curl commands"
echo "   - Check the TODO_APP_README.md for more information"
echo ""
