# testing_mcp
Testing repository for MCP

📐
🔴

## Bug Inspector System

This repository now includes a comprehensive **Bug Inspector** system for detecting, tracking, and managing bugs in codebases.

### Features
- 🔍 **Automated Bug Detection** - Scans code files for syntax errors, logic issues, security vulnerabilities, and code quality problems
- 📊 **Bug Tracking & Management** - Complete lifecycle management with status tracking, assignment, and tagging
- 📈 **Rich Reporting** - Summary reports, detailed listings, HTML exports, and analytics
- 🖥️ **Command Line Interface** - Powerful CLI with 11 commands for complete bug management workflow
- 🔧 **Multi-language Support** - Python, JavaScript, Java, C/C++, and more

### Quick Start

```bash
# Scan files for bugs
./bug_inspector_cli.py scan sample_code/ --recursive

# List all bugs
./bug_inspector_cli.py list

# Generate summary report
./bug_inspector_cli.py report --summary

# Generate HTML report
./bug_inspector_cli.py report --html bugs.html

# Show statistics
./bug_inspector_cli.py stats
```

### Sample Detection Results
The system successfully detects 53 bugs across the sample code files:
- **10 Critical** security vulnerabilities (hardcoded passwords, eval usage, XSS risks)
- **17 High** priority syntax and logic errors
- **26 Medium/Low** code quality and performance issues

### Documentation
See [BUG_INSPECTOR_README.md](BUG_INSPECTOR_README.md) for complete documentation, API reference, and usage examples.

### Testing
Run the comprehensive test suite:
```bash
./test_bug_inspector.py
```