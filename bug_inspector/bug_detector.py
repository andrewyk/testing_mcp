"""
Bug detection utilities for analyzing code files and identifying potential issues.
"""

import re
import ast
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Set, Tuple
from .bug_models import Bug, BugType, Severity


class BugDetector:
    """Main class for detecting bugs in code files."""
    
    def __init__(self):
        """Initialize the bug detector with pattern definitions."""
        self.patterns = self._initialize_patterns()
        self.supported_extensions = {'.py', '.js', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.rb', '.go'}
    
    def _initialize_patterns(self) -> Dict[str, Any]:
        """Initialize bug detection patterns."""
        return {
            'python': {
                'syntax_patterns': [
                    # Common syntax issues
                    (r'^\s*print\s+[^(]', BugType.SYNTAX_ERROR, "Missing parentheses in print statement"),
                    (r'if\s+.*[^:]\s*$', BugType.SYNTAX_ERROR, "Missing colon in if statement"),
                    (r'def\s+\w+\(.*\)[^:]\s*$', BugType.SYNTAX_ERROR, "Missing colon in function definition"),
                    (r'class\s+\w+.*[^:]\s*$', BugType.SYNTAX_ERROR, "Missing colon in class definition"),
                ],
                'logic_patterns': [
                    # Potential logic errors
                    (r'if\s+.*=\s+.*:', BugType.LOGIC_ERROR, "Assignment in if condition (should be ==?)"),
                    (r'\.get\(\s*[\'"][^\'"]*[\'"]\s*\)\s*==\s*None', BugType.LOGIC_ERROR, "Using == None instead of 'is None'"),
                    (r'len\s*\(\s*\w+\s*\)\s*==\s*0', BugType.CODE_QUALITY, "Use 'not list' instead of 'len(list) == 0'"),
                    (r'except\s*:', BugType.LOGIC_ERROR, "Bare except clause - should specify exception type"),
                ],
                'security_patterns': [
                    # Security vulnerabilities
                    (r'eval\s*\(', BugType.SECURITY_VULNERABILITY, "Use of eval() can be dangerous"),
                    (r'exec\s*\(', BugType.SECURITY_VULNERABILITY, "Use of exec() can be dangerous"),
                    (r'subprocess\.call\s*\(.*shell\s*=\s*True', BugType.SECURITY_VULNERABILITY, "Shell injection vulnerability"),
                    (r'pickle\.loads?\s*\(', BugType.SECURITY_VULNERABILITY, "Pickle deserialization can be unsafe"),
                ],
                'performance_patterns': [
                    # Performance issues
                    (r'for\s+\w+\s+in\s+range\s*\(\s*len\s*\(', BugType.PERFORMANCE_ISSUE, "Use enumerate() instead of range(len())"),
                    (r'\.keys\(\)\s*:\s*\n.*\[\s*\w+\s*\]', BugType.PERFORMANCE_ISSUE, "Use .items() instead of .keys() when accessing values"),
                ],
                'code_quality_patterns': [
                    # Code quality issues
                    (r'^\s*import\s+\*', BugType.CODE_QUALITY, "Avoid wildcard imports"),
                    (r'^\s*from\s+.*\s+import\s+\*', BugType.CODE_QUALITY, "Avoid wildcard imports"),
                    (r'^\s*#\s*TODO', BugType.CODE_QUALITY, "TODO comment found"),
                    (r'^\s*#\s*FIXME', BugType.CODE_QUALITY, "FIXME comment found"),
                    (r'^\s*#\s*HACK', BugType.CODE_QUALITY, "HACK comment found"),
                ]
            },
            'javascript': {
                'syntax_patterns': [
                    (r'if\s*\([^)]*\)\s*[^{].*[^;]\s*$', BugType.SYNTAX_ERROR, "Missing semicolon or braces"),
                    (r'function\s+\w+\s*\([^)]*\)\s*[^{]', BugType.SYNTAX_ERROR, "Missing opening brace in function"),
                ],
                'logic_patterns': [
                    (r'if\s*\([^)]*=\s*[^=]', BugType.LOGIC_ERROR, "Assignment in if condition"),
                    (r'==\s*null', BugType.CODE_QUALITY, "Use strict equality (===) instead of =="),
                    (r'!=\s*null', BugType.CODE_QUALITY, "Use strict inequality (!==) instead of !="),
                ],
                'security_patterns': [
                    (r'eval\s*\(', BugType.SECURITY_VULNERABILITY, "Use of eval() can be dangerous"),
                    (r'innerHTML\s*=', BugType.SECURITY_VULNERABILITY, "innerHTML assignment can lead to XSS"),
                    (r'document\.write\s*\(', BugType.SECURITY_VULNERABILITY, "document.write can be unsafe"),
                ]
            },
            'general': {
                'common_patterns': [
                    (r'password\s*=\s*[\'"][^\'"]+[\'"]', BugType.SECURITY_VULNERABILITY, "Hardcoded password"),
                    (r'api_key\s*=\s*[\'"][^\'"]+[\'"]', BugType.SECURITY_VULNERABILITY, "Hardcoded API key"),
                    (r'secret\s*=\s*[\'"][^\'"]+[\'"]', BugType.SECURITY_VULNERABILITY, "Hardcoded secret"),
                    (r'\.printStackTrace\(\)', BugType.SECURITY_VULNERABILITY, "Stack trace exposure"),
                    (r'console\.log\s*\(', BugType.CODE_QUALITY, "Debug statement left in code"),
                    (r'print\s*\(.*debug', BugType.CODE_QUALITY, "Debug print statement"),
                ]
            }
        }
    
    def scan_file(self, file_path: str) -> List[Bug]:
        """Scan a single file for bugs."""
        if not os.path.exists(file_path):
            return []
        
        bugs = []
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext not in self.supported_extensions:
            return bugs
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            # Create a bug for file read error
            bug = Bug(
                title=f"File read error: {file_path}",
                description=f"Could not read file: {str(e)}",
                bug_type=BugType.RUNTIME_ERROR,
                severity=Severity.HIGH,
                file_path=file_path
            )
            return [bug]
        
        # Detect syntax errors for Python files
        if file_ext == '.py':
            bugs.extend(self._check_python_syntax(file_path, content))
        
        # Pattern-based detection
        bugs.extend(self._pattern_based_detection(file_path, lines, file_ext))
        
        # Language-specific analysis
        if file_ext == '.py':
            bugs.extend(self._analyze_python_ast(file_path, content))
        
        return bugs
    
    def _check_python_syntax(self, file_path: str, content: str) -> List[Bug]:
        """Check Python files for syntax errors."""
        bugs = []
        try:
            ast.parse(content)
        except SyntaxError as e:
            bug = Bug(
                title=f"Syntax Error in {os.path.basename(file_path)}",
                description=f"Syntax error: {e.msg}",
                bug_type=BugType.SYNTAX_ERROR,
                severity=Severity.HIGH,
                file_path=file_path,
                line_number=e.lineno,
                column_number=e.offset,
                code_snippet=e.text.strip() if e.text else ""
            )
            bugs.append(bug)
        except Exception as e:
            bug = Bug(
                title=f"Parse Error in {os.path.basename(file_path)}",
                description=f"Could not parse file: {str(e)}",
                bug_type=BugType.SYNTAX_ERROR,
                severity=Severity.MEDIUM,
                file_path=file_path
            )
            bugs.append(bug)
        
        return bugs
    
    def _pattern_based_detection(self, file_path: str, lines: List[str], file_ext: str) -> List[Bug]:
        """Detect bugs using regex patterns."""
        bugs = []
        
        # Determine language patterns to use
        lang_patterns = []
        if file_ext == '.py':
            lang_patterns.extend(self.patterns['python'].values())
        elif file_ext == '.js':
            lang_patterns.extend(self.patterns['javascript'].values())
        
        # Always include general patterns
        lang_patterns.append(self.patterns['general']['common_patterns'])
        
        for line_num, line in enumerate(lines, 1):
            for pattern_group in lang_patterns:
                for pattern, bug_type, description in pattern_group:
                    if re.search(pattern, line, re.IGNORECASE):
                        severity = self._determine_severity(bug_type)
                        bug = Bug(
                            title=f"{bug_type.value.replace('_', ' ').title()} detected",
                            description=description,
                            bug_type=bug_type,
                            severity=severity,
                            file_path=file_path,
                            line_number=line_num,
                            code_snippet=line.strip()
                        )
                        bugs.append(bug)
        
        return bugs
    
    def _analyze_python_ast(self, file_path: str, content: str) -> List[Bug]:
        """Analyze Python AST for additional bug patterns."""
        bugs = []
        
        try:
            tree = ast.parse(content)
            
            # Find unused imports and variables
            visitor = PythonASTVisitor(file_path)
            visitor.visit(tree)
            bugs.extend(visitor.bugs)
            
        except (SyntaxError, TypeError):
            # Already handled in syntax check
            pass
        
        return bugs
    
    def _determine_severity(self, bug_type: BugType) -> Severity:
        """Determine severity based on bug type."""
        severity_mapping = {
            BugType.SYNTAX_ERROR: Severity.HIGH,
            BugType.SECURITY_VULNERABILITY: Severity.CRITICAL,
            BugType.RUNTIME_ERROR: Severity.HIGH,
            BugType.LOGIC_ERROR: Severity.MEDIUM,
            BugType.PERFORMANCE_ISSUE: Severity.LOW,
            BugType.CODE_QUALITY: Severity.LOW,
            BugType.MEMORY_LEAK: Severity.HIGH,
            BugType.NULL_POINTER: Severity.HIGH,
            BugType.UNHANDLED_EXCEPTION: Severity.MEDIUM,
            BugType.DEPRECATED_API: Severity.LOW,
            BugType.UNUSED_CODE: Severity.LOW,
            BugType.DUPLICATE_CODE: Severity.LOW,
        }
        return severity_mapping.get(bug_type, Severity.MEDIUM)
    
    def scan_directory(self, directory_path: str, recursive: bool = True) -> List[Bug]:
        """Scan all supported files in a directory."""
        bugs = []
        path = Path(directory_path)
        
        if not path.exists():
            return bugs
        
        if recursive:
            pattern = "**/*"
        else:
            pattern = "*"
        
        for file_path in path.glob(pattern):
            if file_path.is_file() and file_path.suffix in self.supported_extensions:
                file_bugs = self.scan_file(str(file_path))
                bugs.extend(file_bugs)
        
        return bugs


class PythonASTVisitor(ast.NodeVisitor):
    """AST visitor for detecting Python-specific bugs."""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.bugs = []
        self.imports = set()
        self.used_names = set()
        self.defined_names = set()
        self.functions = []
    
    def visit_Import(self, node):
        """Visit import statements."""
        for alias in node.names:
            name = alias.asname if alias.asname else alias.name
            self.imports.add(name)
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node):
        """Visit from-import statements."""
        for alias in node.names:
            name = alias.asname if alias.asname else alias.name
            self.imports.add(name)
        self.generic_visit(node)
    
    def visit_Name(self, node):
        """Visit name nodes."""
        if isinstance(node.ctx, ast.Load):
            self.used_names.add(node.id)
        elif isinstance(node.ctx, ast.Store):
            self.defined_names.add(node.id)
        self.generic_visit(node)
    
    def visit_FunctionDef(self, node):
        """Visit function definitions."""
        self.functions.append({
            'name': node.name,
            'lineno': node.lineno,
            'args': [arg.arg for arg in node.args.args],
            'has_docstring': ast.get_docstring(node) is not None
        })
        
        # Check for functions without docstrings
        if not ast.get_docstring(node) and not node.name.startswith('_'):
            bug = Bug(
                title=f"Missing docstring in function '{node.name}'",
                description="Public function lacks documentation",
                bug_type=BugType.CODE_QUALITY,
                severity=Severity.LOW,
                file_path=self.file_path,
                line_number=node.lineno,
                code_snippet=f"def {node.name}(...):"
            )
            self.bugs.append(bug)
        
        self.generic_visit(node)
    
    def visit_Try(self, node):
        """Visit try statements."""
        # Check for bare except clauses
        for handler in node.handlers:
            if handler.type is None:
                bug = Bug(
                    title="Bare except clause",
                    description="Except clause should specify exception type",
                    bug_type=BugType.LOGIC_ERROR,
                    severity=Severity.MEDIUM,
                    file_path=self.file_path,
                    line_number=handler.lineno,
                    code_snippet="except:"
                )
                self.bugs.append(bug)
        
        self.generic_visit(node)
    
    def visit_Call(self, node):
        """Visit function calls."""
        # Check for potential issues in function calls
        if isinstance(node.func, ast.Name):
            if node.func.id == 'eval':
                bug = Bug(
                    title="Dangerous use of eval()",
                    description="eval() can execute arbitrary code",
                    bug_type=BugType.SECURITY_VULNERABILITY,
                    severity=Severity.CRITICAL,
                    file_path=self.file_path,
                    line_number=node.lineno,
                    code_snippet="eval(...)"
                )
                self.bugs.append(bug)
        
        self.generic_visit(node)