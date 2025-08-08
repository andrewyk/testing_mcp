"""
Bug tracking and management system.
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Optional, Set, Callable, Any
from pathlib import Path
from .bug_models import Bug, BugType, Severity, BugStatus


class BugTracker:
    """Main class for tracking and managing bugs."""
    
    def __init__(self, storage_path: str = "bugs.json"):
        """Initialize the bug tracker."""
        self.storage_path = storage_path
        self.bugs: Dict[str, Bug] = {}
        self.load_bugs()
    
    def add_bug(self, bug: Bug) -> str:
        """Add a new bug to the tracker."""
        self.bugs[bug.id] = bug
        self.save_bugs()
        return bug.id
    
    def get_bug(self, bug_id: str) -> Optional[Bug]:
        """Get a bug by ID."""
        return self.bugs.get(bug_id)
    
    def update_bug(self, bug_id: str, **kwargs) -> bool:
        """Update bug properties."""
        if bug_id not in self.bugs:
            return False
        
        bug = self.bugs[bug_id]
        
        # Update allowed fields
        allowed_fields = {
            'title', 'description', 'severity', 'status', 
            'assigned_to', 'tags', 'metadata'
        }
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                if field == 'severity' and isinstance(value, str):
                    value = Severity(value)
                elif field == 'status' and isinstance(value, str):
                    value = BugStatus(value)
                
                setattr(bug, field, value)
        
        bug.updated_at = datetime.now()
        self.save_bugs()
        return True
    
    def remove_bug(self, bug_id: str) -> bool:
        """Remove a bug from the tracker."""
        if bug_id in self.bugs:
            del self.bugs[bug_id]
            self.save_bugs()
            return True
        return False
    
    def list_bugs(self, filters: Optional[Dict[str, Any]] = None) -> List[Bug]:
        """List bugs with optional filtering."""
        bugs = list(self.bugs.values())
        
        if not filters:
            return bugs
        
        filtered_bugs = []
        for bug in bugs:
            match = True
            
            for key, value in filters.items():
                if key == 'status' and bug.status != value:
                    match = False
                    break
                elif key == 'severity' and bug.severity != value:
                    match = False
                    break
                elif key == 'bug_type' and bug.bug_type != value:
                    match = False
                    break
                elif key == 'assigned_to' and bug.assigned_to != value:
                    match = False
                    break
                elif key == 'file_path' and value not in bug.file_path:
                    match = False
                    break
                elif key == 'tags' and not any(tag in bug.tags for tag in value):
                    match = False
                    break
            
            if match:
                filtered_bugs.append(bug)
        
        return filtered_bugs
    
    def search_bugs(self, query: str, fields: Optional[List[str]] = None) -> List[Bug]:
        """Search bugs by text in specified fields."""
        if fields is None:
            fields = ['title', 'description', 'file_path']
        
        query_lower = query.lower()
        results = []
        
        for bug in self.bugs.values():
            for field in fields:
                field_value = getattr(bug, field, '')
                if isinstance(field_value, str) and query_lower in field_value.lower():
                    results.append(bug)
                    break
        
        return results
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get bug statistics."""
        total_bugs = len(self.bugs)
        
        if total_bugs == 0:
            return {
                'total_bugs': 0,
                'by_status': {},
                'by_severity': {},
                'by_type': {},
                'by_file': {},
                'average_age_days': 0
            }
        
        # Count by status
        status_counts = {}
        for status in BugStatus:
            status_counts[status.value] = 0
        
        # Count by severity
        severity_counts = {}
        for severity in Severity:
            severity_counts[severity.value] = 0
        
        # Count by type
        type_counts = {}
        for bug_type in BugType:
            type_counts[bug_type.value] = 0
        
        # Count by file
        file_counts = {}
        
        # Calculate average age
        total_age_days = 0
        now = datetime.now()
        
        for bug in self.bugs.values():
            # Status counts
            status_counts[bug.status.value] += 1
            
            # Severity counts
            severity_counts[bug.severity.value] += 1
            
            # Type counts
            type_counts[bug.bug_type.value] += 1
            
            # File counts
            if bug.file_path:
                file_name = os.path.basename(bug.file_path)
                file_counts[file_name] = file_counts.get(file_name, 0) + 1
            
            # Age calculation
            age_days = (now - bug.created_at).days
            total_age_days += age_days
        
        return {
            'total_bugs': total_bugs,
            'by_status': status_counts,
            'by_severity': severity_counts,
            'by_type': type_counts,
            'by_file': dict(sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:10]),
            'average_age_days': total_age_days / total_bugs if total_bugs > 0 else 0
        }
    
    def get_open_critical_bugs(self) -> List[Bug]:
        """Get all open critical bugs."""
        return self.list_bugs({
            'status': BugStatus.OPEN,
            'severity': Severity.CRITICAL
        })
    
    def get_bugs_by_file(self, file_path: str) -> List[Bug]:
        """Get all bugs for a specific file."""
        return [bug for bug in self.bugs.values() if bug.file_path == file_path]
    
    def close_bug(self, bug_id: str, assigned_to: Optional[str] = None) -> bool:
        """Close a bug."""
        return self.update_bug(bug_id, status=BugStatus.CLOSED, assigned_to=assigned_to)
    
    def reopen_bug(self, bug_id: str) -> bool:
        """Reopen a closed bug."""
        return self.update_bug(bug_id, status=BugStatus.OPEN)
    
    def assign_bug(self, bug_id: str, assignee: str) -> bool:
        """Assign a bug to someone."""
        return self.update_bug(bug_id, assigned_to=assignee, status=BugStatus.IN_PROGRESS)
    
    def bulk_update_status(self, bug_ids: List[str], new_status: BugStatus) -> int:
        """Update status for multiple bugs."""
        updated_count = 0
        
        for bug_id in bug_ids:
            if self.update_bug(bug_id, status=new_status):
                updated_count += 1
        
        return updated_count
    
    def export_bugs(self, output_path: str, format_type: str = 'json') -> bool:
        """Export bugs to a file."""
        try:
            if format_type.lower() == 'json':
                data = [bug.to_dict() for bug in self.bugs.values()]
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, default=str)
            
            elif format_type.lower() == 'csv':
                import csv
                
                with open(output_path, 'w', newline='', encoding='utf-8') as f:
                    if not self.bugs:
                        return True
                    
                    # Get field names from the first bug
                    first_bug = next(iter(self.bugs.values()))
                    fieldnames = list(first_bug.to_dict().keys())
                    
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    
                    for bug in self.bugs.values():
                        writer.writerow(bug.to_dict())
            
            return True
            
        except Exception as e:
            print(f"Error exporting bugs: {e}")
            return False
    
    def import_bugs(self, input_path: str, merge: bool = True) -> int:
        """Import bugs from a file."""
        if not os.path.exists(input_path):
            return 0
        
        try:
            with open(input_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            imported_count = 0
            
            for bug_data in data:
                bug = Bug.from_dict(bug_data)
                
                # Check if bug already exists
                if merge and bug.id in self.bugs:
                    # Update existing bug
                    existing_bug = self.bugs[bug.id]
                    if bug.updated_at > existing_bug.updated_at:
                        self.bugs[bug.id] = bug
                        imported_count += 1
                else:
                    # Add new bug
                    self.bugs[bug.id] = bug
                    imported_count += 1
            
            self.save_bugs()
            return imported_count
            
        except Exception as e:
            print(f"Error importing bugs: {e}")
            return 0
    
    def save_bugs(self):
        """Save bugs to storage."""
        try:
            data = [bug.to_dict() for bug in self.bugs.values()]
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving bugs: {e}")
    
    def load_bugs(self):
        """Load bugs from storage."""
        if not os.path.exists(self.storage_path):
            return
        
        try:
            with open(self.storage_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.bugs = {}
            for bug_data in data:
                bug = Bug.from_dict(bug_data)
                self.bugs[bug.id] = bug
                
        except Exception as e:
            print(f"Error loading bugs: {e}")
            self.bugs = {}
    
    def clear_all_bugs(self):
        """Clear all bugs (use with caution)."""
        self.bugs = {}
        self.save_bugs()
    
    def get_bug_trend(self, days: int = 30) -> Dict[str, List[int]]:
        """Get bug creation trend over the last N days."""
        from collections import defaultdict
        from datetime import timedelta
        
        now = datetime.now()
        daily_counts = defaultdict(lambda: defaultdict(int))
        
        for bug in self.bugs.values():
            days_ago = (now - bug.created_at).days
            if days_ago <= days:
                date_str = bug.created_at.strftime('%Y-%m-%d')
                daily_counts[date_str]['total'] += 1
                daily_counts[date_str][bug.severity.value] += 1
        
        # Fill in missing days with zeros
        result = {
            'dates': [],
            'total': [],
            'critical': [],
            'high': [],
            'medium': [],
            'low': [],
            'info': []
        }
        
        for i in range(days, -1, -1):
            date = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            
            result['dates'].append(date_str)
            result['total'].append(daily_counts[date_str]['total'])
            result['critical'].append(daily_counts[date_str]['critical'])
            result['high'].append(daily_counts[date_str]['high'])
            result['medium'].append(daily_counts[date_str]['medium'])
            result['low'].append(daily_counts[date_str]['low'])
            result['info'].append(daily_counts[date_str]['info'])
        
        return result
    
    def __len__(self) -> int:
        """Return number of bugs."""
        return len(self.bugs)
    
    def __contains__(self, bug_id: str) -> bool:
        """Check if bug exists."""
        return bug_id in self.bugs
    
    def __iter__(self):
        """Iterate over bugs."""
        return iter(self.bugs.values())