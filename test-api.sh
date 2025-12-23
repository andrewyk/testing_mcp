#!/bin/bash

# Comprehensive API Test Script
# Tests all major endpoints and functionality

API_URL="http://localhost:3001/api"
PASSED=0
FAILED=0

echo "🧪 Running Comprehensive API Tests"
echo "===================================="
echo ""

# Helper function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_code="${5:-200}"
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_code" ]; then
        echo "✅ PASSED (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo "❌ FAILED (Expected HTTP $expected_code, got $http_code)"
        echo "   Response: $body"
        ((FAILED++))
        return 1
    fi
}

# Test 1: Health Check
test_endpoint "Health Check" "GET" "/health"

# Test 2: Get Dashboard Stats
test_endpoint "Dashboard Stats" "GET" "/dashboard/stats"

# Test 3: List Projects
test_endpoint "List Projects" "GET" "/projects"

# Test 4: List Tasks
test_endpoint "List Tasks" "GET" "/tasks"

# Test 5: Create Project
test_endpoint "Create Project" "POST" "/projects" \
    '{"name":"Test Project","color":"#FF0000","icon":"🧪"}' "201"

# Test 6: Create Task
test_endpoint "Create Task" "POST" "/tasks" \
    '{"title":"Test Task","priority":"high","status":"in_progress"}' "201"

# Test 7: Filter Tasks by Priority
test_endpoint "Filter by Priority" "GET" "/tasks?priority=high"

# Test 8: Search Tasks
test_endpoint "Search Tasks" "GET" "/tasks?search=Test"

# Test 9: Get Trash (should be empty initially)
test_endpoint "List Trash" "GET" "/trash"

# Test 10: Invalid Task Creation (missing title)
test_endpoint "Invalid Task Creation" "POST" "/tasks" \
    '{"description":"No title"}' "400"

# Results Summary
echo ""
echo "===================================="
echo "Test Results:"
echo "  ✅ Passed: $PASSED"
echo "  ❌ Failed: $FAILED"
echo "===================================="

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed"
    exit 1
fi
