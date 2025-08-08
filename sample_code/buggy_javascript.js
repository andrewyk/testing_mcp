// Sample JavaScript file with intentional bugs

var password = "secret123";  // Hardcoded password
var apiKey = "abc-def-123";

function vulnerableFunction(userInput) {
    // XSS vulnerability
    document.getElementById("output").innerHTML = userInput;
    
    // Dangerous eval usage
    var result = eval("(" + userInput + ")");
    
    // Using document.write
    document.write("<p>" + userInput + "</p>");
    
    return result;
}

function logicErrors() {
    var data = {key: "value"};
    
    // Assignment in if condition
    if (data = null) {
        console.log("Data is null");
    }
    
    // Using == instead of ===
    if (data.key == null) {
        console.log("Key is null");
    }
    
    // Type coercion issues
    if (data.key != undefined) {
        console.log("Key exists");
    }
}

function syntaxIssues() {
    // Missing semicolon
    var x = 5
    var y = 10
    
    // Missing braces
    if (x > y)
        console.log("x is greater")
        console.log("This might not execute as expected")
}

// Debug statements left in production
console.log("Debug: Loading module");

function missingErrorHandling() {
    // No error handling for potential failures
    var data = JSON.parse(localStorage.getItem("user_data"));
    var user = data.user.profile.name;  // Potential null reference
    
    return user.toUpperCase();
}

// Performance issues
function inefficientLoop() {
    var elements = document.getElementsByClassName("item");
    
    // Repeatedly accessing DOM in loop
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
        // This should cache elements.length
    }
}

// Security issues with innerHTML
function updateContent(content) {
    var container = document.getElementById("container");
    container.innerHTML = content;  // XSS vulnerability
}

// Missing function declarations
function incompleteFunction(param1, param2
    // Missing closing parenthesis and opening brace
    return param1 + param2;
}

// TODO: Implement proper validation
// FIXME: This is a temporary solution
function temporaryHack() {
    // HACK: Quick fix that needs proper implementation
    return true;
}