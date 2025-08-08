"""
Core data models for the bug inspection system.
"""

from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any, List
import uuid


class BugType(Enum):
    """Enumeration of different bug types."""
    SYNTAX_ERROR = "syntax_error"
    LOGIC_ERROR = "logic_error"
    RUNTIME_ERROR = "runtime_error"
    SECURITY_VULNERABILITY = "security_vulnerability"
    PERFORMANCE_ISSUE = "performance_issue"
    CODE_QUALITY = "code_quality"
    MEMORY_LEAK = "memory_leak"
    NULL_POINTER = "null_pointer"
    UNHANDLED_EXCEPTION = "unhandled_exception"
    DEPRECATED_API = "deprecated_api"
    UNUSED_CODE = "unused_code"
    DUPLICATE_CODE = "duplicate_code"


class Severity(Enum):
    """Bug severity levels."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class BugStatus(Enum):
    """Bug status tracking."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    FIXED = "fixed"
    CLOSED = "closed"
    WONT_FIX = "wont_fix"
    DUPLICATE = "duplicate"


@dataclass
class Bug:
    """Represents a bug with all its metadata."""
    
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    bug_type: BugType = BugType.LOGIC_ERROR
    severity: Severity = Severity.MEDIUM
    status: BugStatus = BugStatus.OPEN
    file_path: str = ""
    line_number: Optional[int] = None
    column_number: Optional[int] = None
    code_snippet: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    assigned_to: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        """Ensure updated_at is set correctly."""
        if self.updated_at == self.created_at:
            self.updated_at = datetime.now()
    
    def update_status(self, new_status: BugStatus, assigned_to: Optional[str] = None):
        """Update bug status and timestamp."""
        self.status = new_status
        self.updated_at = datetime.now()
        if assigned_to:
            self.assigned_to = assigned_to
    
    def add_tag(self, tag: str):
        """Add a tag to the bug."""
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()
    
    def remove_tag(self, tag: str):
        """Remove a tag from the bug."""
        if tag in self.tags:
            self.tags.remove(tag)
            self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert bug to dictionary for serialization."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'bug_type': self.bug_type.value,
            'severity': self.severity.value,
            'status': self.status.value,
            'file_path': self.file_path,
            'line_number': self.line_number,
            'column_number': self.column_number,
            'code_snippet': self.code_snippet,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'assigned_to': self.assigned_to,
            'tags': self.tags,
            'metadata': self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Bug':
        """Create Bug instance from dictionary."""
        bug = cls()
        bug.id = data.get('id', bug.id)
        bug.title = data.get('title', '')
        bug.description = data.get('description', '')
        bug.bug_type = BugType(data.get('bug_type', BugType.LOGIC_ERROR.value))
        bug.severity = Severity(data.get('severity', Severity.MEDIUM.value))
        bug.status = BugStatus(data.get('status', BugStatus.OPEN.value))
        bug.file_path = data.get('file_path', '')
        bug.line_number = data.get('line_number')
        bug.column_number = data.get('column_number')
        bug.code_snippet = data.get('code_snippet', '')
        bug.created_at = datetime.fromisoformat(data.get('created_at', datetime.now().isoformat()))
        bug.updated_at = datetime.fromisoformat(data.get('updated_at', datetime.now().isoformat()))
        bug.assigned_to = data.get('assigned_to')
        bug.tags = data.get('tags', [])
        bug.metadata = data.get('metadata', {})
        return bug
    
    def __str__(self) -> str:
        """String representation of the bug."""
        return f"Bug {self.id[:8]}: {self.title} [{self.severity.value}/{self.status.value}]"
    
    def __repr__(self) -> str:
        """Detailed representation of the bug."""
        return (f"Bug(id='{self.id}', title='{self.title}', "
                f"type={self.bug_type.value}, severity={self.severity.value}, "
                f"status={self.status.value})")