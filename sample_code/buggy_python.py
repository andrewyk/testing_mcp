"""
Sample Python file with various intentional bugs for testing bug detection.
"""

import os
import sys
from subprocess import call
import pickle

# Security vulnerability - hardcoded password
password = "admin123"
api_key = "sk-1234567890abcdef"

def unsafe_function(user_input):
    """Function with security vulnerabilities."""
    # Dangerous use of eval
    result = eval(user_input)
    
    # Shell injection vulnerability
    call(f"ls {user_input}", shell=True)
    
    return result

def logic_errors_demo():
    """Function demonstrating logic errors."""
    data = {'key': 'value'}
    
    # Assignment in if condition
    if data = None:
        print("Data is None")
    
    # Using == None instead of is None
    if data.get('key') == None:
        print("Key not found")
    
    # Checking length instead of truthiness
    my_list = []
    if len(my_list) == 0:
        print("List is empty")

def exception_handling_issues():
    """Function with poor exception handling."""
    try:
        result = 10 / 0
    except:  # Bare except clause
        print("Something went wrong")
    
    # Unhandled exception potential
    file_data = open('/nonexistent/file.txt').read()

def performance_issues():
    """Function with performance problems."""
    data = {'a': 1, 'b': 2, 'c': 3}
    
    # Inefficient iteration
    for key in data.keys():
        print(f"{key}: {data[key]}")
    
    # Using range(len()) instead of enumerate
    items = ['a', 'b', 'c']
    for i in range(len(items)):
        print(f"{i}: {items[i]}")

# Code quality issues
from os import *  # Wildcard import
import sys  # Unused import

def missing_docstring_function(x, y):
    return x + y

# TODO: Fix this function
def incomplete_function():
    # FIXME: This is a hack
    # HACK: Temporary solution
    pass

def syntax_error_example()  # Missing colon
    print "This should use parentheses"  # Python 2 syntax
    
class MissingColon  # Missing colon in class definition
    pass

# Debug statements left in code
print("Debug: Starting application")
console.log("This is JavaScript in Python file")

# Pickle security issue
def load_user_data(data):
    return pickle.loads(data)

# Memory leak potential
global_cache = {}

def cache_data(key, value):
    global_cache[key] = value  # Never cleaned up

if __name__ == "__main__":
    # More issues
    user_input = input("Enter command: ")
    exec(user_input)  # Another security vulnerability