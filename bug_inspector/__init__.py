"""
Bug Inspector - A comprehensive bug detection and tracking system.

This package provides tools for identifying, cataloging, and managing bugs
in codebases with automated detection capabilities and detailed reporting.
"""

from .bug_models import Bug, BugType, Severity, BugStatus
from .bug_detector import BugDetector
from .bug_tracker import BugTracker
from .bug_reporter import BugReporter

__version__ = "1.0.0"
__author__ = "Bug Inspector Team"

__all__ = [
    "Bug",
    "BugType", 
    "Severity",
    "BugStatus",
    "BugDetector",
    "BugTracker", 
    "BugReporter"
]