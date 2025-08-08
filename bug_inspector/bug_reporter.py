"""
Bug reporting and visualization utilities.
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from .bug_models import Bug, BugType, Severity, BugStatus
from .bug_tracker import BugTracker


class BugReporter:
    """Generate reports and visualizations for bugs."""
    
    def __init__(self, tracker: BugTracker):
        """Initialize the reporter with a bug tracker."""
        self.tracker = tracker
    
    def generate_summary_report(self) -> str:
        """Generate a comprehensive summary report."""
        stats = self.tracker.get_statistics()
        
        report = []
        report.append("=" * 60)
        report.append("BUG INSPECTION SUMMARY REPORT")
        report.append("=" * 60)
        report.append(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Total Bugs: {stats['total_bugs']}")
        report.append("")
        
        # Status breakdown
        report.append("STATUS BREAKDOWN:")
        report.append("-" * 20)
        for status, count in stats['by_status'].items():
            if count > 0:
                percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
                report.append(f"  {status.upper().replace('_', ' '):<15}: {count:>3} ({percentage:>5.1f}%)")
        report.append("")
        
        # Severity breakdown
        report.append("SEVERITY BREAKDOWN:")
        report.append("-" * 20)
        for severity, count in stats['by_severity'].items():
            if count > 0:
                percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
                report.append(f"  {severity.upper():<15}: {count:>3} ({percentage:>5.1f}%)")
        report.append("")
        
        # Bug type breakdown
        report.append("BUG TYPE BREAKDOWN:")
        report.append("-" * 20)
        for bug_type, count in stats['by_type'].items():
            if count > 0:
                percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
                display_name = bug_type.replace('_', ' ').title()
                report.append(f"  {display_name:<20}: {count:>3} ({percentage:>5.1f}%)")
        report.append("")
        
        # Top files with bugs
        if stats['by_file']:
            report.append("TOP FILES WITH BUGS:")
            report.append("-" * 20)
            for file_name, count in list(stats['by_file'].items())[:5]:
                report.append(f"  {file_name:<30}: {count:>3} bugs")
            report.append("")
        
        # Critical and high priority bugs
        critical_bugs = self.tracker.list_bugs({'severity': Severity.CRITICAL})
        high_bugs = self.tracker.list_bugs({'severity': Severity.HIGH})
        
        if critical_bugs:
            report.append("CRITICAL BUGS:")
            report.append("-" * 20)
            for bug in critical_bugs[:5]:
                status_icon = "🔴" if bug.status == BugStatus.OPEN else "🟡"
                report.append(f"  {status_icon} {bug.title[:50]}")
                if bug.file_path:
                    report.append(f"    📁 {os.path.basename(bug.file_path)}:{bug.line_number or '?'}")
            report.append("")
        
        if high_bugs:
            report.append("HIGH PRIORITY BUGS:")
            report.append("-" * 20)
            for bug in high_bugs[:5]:
                status_icon = "🟠" if bug.status == BugStatus.OPEN else "🟡"
                report.append(f"  {status_icon} {bug.title[:50]}")
                if bug.file_path:
                    report.append(f"    📁 {os.path.basename(bug.file_path)}:{bug.line_number or '?'}")
            report.append("")
        
        # Recommendations
        report.append("RECOMMENDATIONS:")
        report.append("-" * 20)
        
        open_critical = len([b for b in critical_bugs if b.status == BugStatus.OPEN])
        open_high = len([b for b in high_bugs if b.status == BugStatus.OPEN])
        
        if open_critical > 0:
            report.append(f"  🚨 {open_critical} CRITICAL bugs need immediate attention!")
        if open_high > 0:
            report.append(f"  ⚠️  {open_high} HIGH priority bugs should be addressed soon.")
        
        if stats['average_age_days'] > 30:
            report.append(f"  📅 Average bug age is {stats['average_age_days']:.1f} days - consider bug triage.")
        
        security_bugs = self.tracker.list_bugs({'bug_type': BugType.SECURITY_VULNERABILITY})
        if security_bugs:
            open_security = len([b for b in security_bugs if b.status == BugStatus.OPEN])
            if open_security > 0:
                report.append(f"  🔒 {open_security} security vulnerabilities require urgent review!")
        
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def generate_detailed_report(self, include_closed: bool = False) -> str:
        """Generate a detailed bug report."""
        filters = {} if include_closed else {'status': BugStatus.OPEN}
        bugs = self.tracker.list_bugs(filters)
        
        if not bugs:
            return "No bugs found matching the criteria."
        
        # Sort bugs by severity and creation date
        severity_order = {
            Severity.CRITICAL: 0,
            Severity.HIGH: 1,
            Severity.MEDIUM: 2,
            Severity.LOW: 3,
            Severity.INFO: 4
        }
        
        bugs.sort(key=lambda b: (severity_order[b.severity], b.created_at), reverse=True)
        
        report = []
        report.append("=" * 80)
        report.append("DETAILED BUG REPORT")
        report.append("=" * 80)
        report.append(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Total bugs: {len(bugs)}")
        report.append("")
        
        for bug in bugs:
            report.append("-" * 80)
            
            # Bug header
            severity_icon = {
                Severity.CRITICAL: "🔴",
                Severity.HIGH: "🟠", 
                Severity.MEDIUM: "🟡",
                Severity.LOW: "🟢",
                Severity.INFO: "🔵"
            }.get(bug.severity, "⚪")
            
            status_icon = {
                BugStatus.OPEN: "🔓",
                BugStatus.IN_PROGRESS: "🔄",
                BugStatus.FIXED: "✅",
                BugStatus.CLOSED: "🔒",
                BugStatus.WONT_FIX: "❌",
                BugStatus.DUPLICATE: "🔁"
            }.get(bug.status, "❓")
            
            report.append(f"{severity_icon} {status_icon} [{bug.id[:8]}] {bug.title}")
            report.append("")
            
            # Bug details
            report.append(f"Type: {bug.bug_type.value.replace('_', ' ').title()}")
            report.append(f"Severity: {bug.severity.value.title()}")
            report.append(f"Status: {bug.status.value.replace('_', ' ').title()}")
            report.append(f"Created: {bug.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
            report.append(f"Updated: {bug.updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
            
            if bug.assigned_to:
                report.append(f"Assigned to: {bug.assigned_to}")
            
            if bug.file_path:
                location = f"{bug.file_path}"
                if bug.line_number:
                    location += f":{bug.line_number}"
                if bug.column_number:
                    location += f":{bug.column_number}"
                report.append(f"Location: {location}")
            
            if bug.tags:
                report.append(f"Tags: {', '.join(bug.tags)}")
            
            report.append("")
            report.append("Description:")
            report.append(f"  {bug.description}")
            
            if bug.code_snippet:
                report.append("")
                report.append("Code snippet:")
                report.append(f"  > {bug.code_snippet}")
            
            report.append("")
        
        report.append("=" * 80)
        return "\n".join(report)
    
    def generate_file_report(self, file_path: str) -> str:
        """Generate a report for a specific file."""
        bugs = self.tracker.get_bugs_by_file(file_path)
        
        if not bugs:
            return f"No bugs found in file: {file_path}"
        
        # Sort by line number
        bugs.sort(key=lambda b: b.line_number or 0)
        
        report = []
        report.append("=" * 80)
        report.append(f"BUG REPORT FOR: {file_path}")
        report.append("=" * 80)
        report.append(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Total bugs in file: {len(bugs)}")
        report.append("")
        
        for bug in bugs:
            severity_icon = {
                Severity.CRITICAL: "🔴",
                Severity.HIGH: "🟠",
                Severity.MEDIUM: "🟡", 
                Severity.LOW: "🟢",
                Severity.INFO: "🔵"
            }.get(bug.severity, "⚪")
            
            line_info = f"Line {bug.line_number}" if bug.line_number else "Unknown line"
            report.append(f"{severity_icon} {line_info}: {bug.title}")
            report.append(f"   Type: {bug.bug_type.value.replace('_', ' ')}")
            report.append(f"   Status: {bug.status.value}")
            report.append(f"   Description: {bug.description}")
            
            if bug.code_snippet:
                report.append(f"   Code: {bug.code_snippet}")
            
            report.append("")
        
        return "\n".join(report)
    
    def export_html_report(self, output_path: str, include_closed: bool = False) -> bool:
        """Export bugs as an HTML report."""
        try:
            filters = {} if include_closed else {'status': BugStatus.OPEN}
            bugs = self.tracker.list_bugs(filters)
            stats = self.tracker.get_statistics()
            
            html_template = """<!DOCTYPE html>
<html>
<head>
    <title>Bug Inspection Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .header {{ background-color: #f0f0f0; padding: 20px; border-radius: 5px; }}
        .stats {{ display: flex; justify-content: space-around; margin: 20px 0; }}
        .stat-box {{ background-color: #e8f4fd; padding: 15px; border-radius: 5px; text-align: center; }}
        .bug {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }}
        .critical {{ border-left: 5px solid #ff0000; }}
        .high {{ border-left: 5px solid #ff8800; }}
        .medium {{ border-left: 5px solid #ffaa00; }}
        .low {{ border-left: 5px solid #00aa00; }}
        .info {{ border-left: 5px solid #0088ff; }}
        .bug-title {{ font-weight: bold; font-size: 1.1em; }}
        .bug-meta {{ color: #666; font-size: 0.9em; margin: 5px 0; }}
        .code-snippet {{ background-color: #f5f5f5; padding: 10px; font-family: monospace; border-radius: 3px; }}
        .tags {{ margin-top: 10px; }}
        .tag {{ background-color: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🐛 Bug Inspection Report</h1>
        <p>Generated on: {timestamp}</p>
        <p>Total bugs: {total_bugs}</p>
    </div>
    
    <div class="stats">
        <div class="stat-box">
            <h3>🔴 Critical</h3>
            <div>{critical_count}</div>
        </div>
        <div class="stat-box">
            <h3>🟠 High</h3>
            <div>{high_count}</div>
        </div>
        <div class="stat-box">
            <h3>🟡 Medium</h3>
            <div>{medium_count}</div>
        </div>
        <div class="stat-box">
            <h3>🟢 Low</h3>
            <div>{low_count}</div>
        </div>
    </div>
    
    <h2>Bug Details</h2>
    {bug_list}
</body>
</html>"""
            
            # Generate bug list HTML
            bug_html = []
            
            # Sort bugs by severity
            severity_order = {
                Severity.CRITICAL: 0,
                Severity.HIGH: 1,
                Severity.MEDIUM: 2,
                Severity.LOW: 3,
                Severity.INFO: 4
            }
            
            bugs.sort(key=lambda b: (severity_order[b.severity], b.created_at), reverse=True)
            
            for bug in bugs:
                severity_class = bug.severity.value
                
                tags_html = ""
                if bug.tags:
                    tags_html = '<div class="tags">' + ''.join([f'<span class="tag">{tag}</span>' for tag in bug.tags]) + '</div>'
                
                code_html = ""
                if bug.code_snippet:
                    code_html = f'<div class="code-snippet">{bug.code_snippet}</div>'
                
                location = ""
                if bug.file_path:
                    location = f"{os.path.basename(bug.file_path)}"
                    if bug.line_number:
                        location += f":{bug.line_number}"
                
                bug_html.append(f"""
                <div class="bug {severity_class}">
                    <div class="bug-title">{bug.title}</div>
                    <div class="bug-meta">
                        <strong>Type:</strong> {bug.bug_type.value.replace('_', ' ').title()} |
                        <strong>Severity:</strong> {bug.severity.value.title()} |
                        <strong>Status:</strong> {bug.status.value.replace('_', ' ').title()}
                        {f'| <strong>Location:</strong> {location}' if location else ''}
                    </div>
                    <div class="bug-meta">
                        <strong>Created:</strong> {bug.created_at.strftime('%Y-%m-%d %H:%M')} |
                        <strong>Updated:</strong> {bug.updated_at.strftime('%Y-%m-%d %H:%M')}
                        {f'| <strong>Assigned to:</strong> {bug.assigned_to}' if bug.assigned_to else ''}
                    </div>
                    <p>{bug.description}</p>
                    {code_html}
                    {tags_html}
                </div>
                """)
            
            # Fill template
            html_content = html_template.format(
                timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                total_bugs=len(bugs),
                critical_count=stats['by_severity'].get('critical', 0),
                high_count=stats['by_severity'].get('high', 0),
                medium_count=stats['by_severity'].get('medium', 0),
                low_count=stats['by_severity'].get('low', 0),
                bug_list=''.join(bug_html)
            )
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            return True
            
        except Exception as e:
            print(f"Error generating HTML report: {e}")
            return False
    
    def generate_metrics_summary(self) -> Dict[str, Any]:
        """Generate metrics for dashboard or API consumption."""
        stats = self.tracker.get_statistics()
        
        # Calculate additional metrics
        total_bugs = stats['total_bugs']
        open_bugs = stats['by_status'].get('open', 0)
        closed_bugs = stats['by_status'].get('closed', 0) + stats['by_status'].get('fixed', 0)
        
        resolution_rate = (closed_bugs / total_bugs * 100) if total_bugs > 0 else 0
        
        critical_open = len(self.tracker.list_bugs({
            'severity': Severity.CRITICAL, 
            'status': BugStatus.OPEN
        }))
        
        high_open = len(self.tracker.list_bugs({
            'severity': Severity.HIGH,
            'status': BugStatus.OPEN
        }))
        
        return {
            'total_bugs': total_bugs,
            'open_bugs': open_bugs,
            'closed_bugs': closed_bugs,
            'resolution_rate': round(resolution_rate, 1),
            'critical_open': critical_open,
            'high_open': high_open,
            'average_age_days': round(stats['average_age_days'], 1),
            'top_bug_types': dict(list(sorted(
                [(k, v) for k, v in stats['by_type'].items() if v > 0],
                key=lambda x: x[1], reverse=True
            ))[:5]),
            'files_with_most_bugs': stats['by_file']
        }