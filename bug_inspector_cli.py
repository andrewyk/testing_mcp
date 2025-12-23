#!/usr/bin/env python3
"""
Command Line Interface for the Bug Inspector system.
"""

import argparse
import sys
import os
from pathlib import Path

# Add the current directory to the path so we can import bug_inspector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bug_inspector import BugDetector, BugTracker, BugReporter, Severity, BugStatus, BugType


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Bug Inspector - Comprehensive bug detection and tracking system",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s scan file.py                    # Scan a single file
  %(prog)s scan /path/to/project --recursive  # Scan entire project
  %(prog)s list                           # List all bugs
  %(prog)s list --status open --severity critical  # List open critical bugs
  %(prog)s report --summary               # Generate summary report
  %(prog)s report --html bugs.html        # Generate HTML report
  %(prog)s close BUG_ID                   # Close a bug
  %(prog)s assign BUG_ID john.doe         # Assign bug to someone
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Scan command
    scan_parser = subparsers.add_parser('scan', help='Scan files or directories for bugs')
    scan_parser.add_argument('path', help='File or directory path to scan')
    scan_parser.add_argument('--recursive', '-r', action='store_true',
                           help='Scan directories recursively')
    scan_parser.add_argument('--output', '-o', help='Save bugs to file (JSON format)')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List bugs with optional filtering')
    list_parser.add_argument('--status', choices=['open', 'in_progress', 'fixed', 'closed', 'wont_fix', 'duplicate'],
                           help='Filter by status')
    list_parser.add_argument('--severity', choices=['critical', 'high', 'medium', 'low', 'info'],
                           help='Filter by severity')
    list_parser.add_argument('--type', choices=[t.value for t in BugType],
                           help='Filter by bug type')
    list_parser.add_argument('--file', help='Filter by file path (partial match)')
    list_parser.add_argument('--assigned', help='Filter by assignee')
    list_parser.add_argument('--limit', type=int, default=50, help='Maximum number of bugs to show')
    
    # Search command
    search_parser = subparsers.add_parser('search', help='Search bugs by text')
    search_parser.add_argument('query', help='Search query')
    search_parser.add_argument('--fields', nargs='+', default=['title', 'description', 'file_path'],
                             help='Fields to search in')
    
    # Show command
    show_parser = subparsers.add_parser('show', help='Show detailed information about a bug')
    show_parser.add_argument('bug_id', help='Bug ID to show')
    
    # Report command
    report_parser = subparsers.add_parser('report', help='Generate reports')
    report_group = report_parser.add_mutually_exclusive_group(required=True)
    report_group.add_argument('--summary', action='store_true', help='Generate summary report')
    report_group.add_argument('--detailed', action='store_true', help='Generate detailed report')
    report_group.add_argument('--file', help='Generate report for specific file')
    report_group.add_argument('--html', help='Generate HTML report (specify output file)')
    report_parser.add_argument('--include-closed', action='store_true',
                             help='Include closed bugs in report')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update bug properties')
    update_parser.add_argument('bug_id', help='Bug ID to update')
    update_parser.add_argument('--status', choices=['open', 'in_progress', 'fixed', 'closed', 'wont_fix', 'duplicate'],
                             help='Update status')
    update_parser.add_argument('--severity', choices=['critical', 'high', 'medium', 'low', 'info'],
                             help='Update severity')
    update_parser.add_argument('--assigned-to', help='Assign to person')
    update_parser.add_argument('--title', help='Update title')
    update_parser.add_argument('--description', help='Update description')
    
    # Close command
    close_parser = subparsers.add_parser('close', help='Close a bug')
    close_parser.add_argument('bug_id', help='Bug ID to close')
    close_parser.add_argument('--assigned-to', help='Person who closed the bug')
    
    # Assign command
    assign_parser = subparsers.add_parser('assign', help='Assign a bug to someone')
    assign_parser.add_argument('bug_id', help='Bug ID to assign')
    assign_parser.add_argument('assignee', help='Person to assign the bug to')
    
    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show bug statistics')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export bugs to file')
    export_parser.add_argument('output_file', help='Output file path')
    export_parser.add_argument('--format', choices=['json', 'csv'], default='json',
                             help='Export format')
    
    # Import command
    import_parser = subparsers.add_parser('import', help='Import bugs from file')
    import_parser.add_argument('input_file', help='Input file path')
    import_parser.add_argument('--merge', action='store_true',
                             help='Merge with existing bugs')
    
    # Global arguments
    parser.add_argument('--storage', default='bugs.json',
                       help='Bug storage file path (default: bugs.json)')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Verbose output')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Initialize components
    tracker = BugTracker(args.storage)
    detector = BugDetector()
    reporter = BugReporter(tracker)
    
    try:
        if args.command == 'scan':
            return cmd_scan(detector, tracker, args)
        elif args.command == 'list':
            return cmd_list(tracker, args)
        elif args.command == 'search':
            return cmd_search(tracker, args)
        elif args.command == 'show':
            return cmd_show(tracker, args)
        elif args.command == 'report':
            return cmd_report(reporter, args)
        elif args.command == 'update':
            return cmd_update(tracker, args)
        elif args.command == 'close':
            return cmd_close(tracker, args)
        elif args.command == 'assign':
            return cmd_assign(tracker, args)
        elif args.command == 'stats':
            return cmd_stats(tracker, args)
        elif args.command == 'export':
            return cmd_export(tracker, args)
        elif args.command == 'import':
            return cmd_import(tracker, args)
        else:
            print(f"Unknown command: {args.command}")
            return 1
    
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1


def cmd_scan(detector, tracker, args):
    """Handle scan command."""
    path = args.path
    
    if not os.path.exists(path):
        print(f"Error: Path does not exist: {path}")
        return 1
    
    print(f"Scanning {'recursively ' if args.recursive else ''}{path}...")
    
    if os.path.isfile(path):
        bugs = detector.scan_file(path)
    else:
        bugs = detector.scan_directory(path, recursive=args.recursive)
    
    print(f"Found {len(bugs)} bugs.")
    
    # Add bugs to tracker
    added_count = 0
    for bug in bugs:
        tracker.add_bug(bug)
        added_count += 1
        
        if args.verbose:
            print(f"  {bug.severity.value.upper()}: {bug.title}")
    
    print(f"Added {added_count} bugs to tracker.")
    
    # Save to output file if specified
    if args.output:
        if tracker.export_bugs(args.output):
            print(f"Bugs exported to {args.output}")
        else:
            print(f"Failed to export bugs to {args.output}")
            return 1
    
    return 0


def cmd_list(tracker, args):
    """Handle list command."""
    filters = {}
    
    if args.status:
        filters['status'] = BugStatus(args.status)
    if args.severity:
        filters['severity'] = Severity(args.severity)
    if args.type:
        filters['bug_type'] = BugType(args.type)
    if args.file:
        filters['file_path'] = args.file
    if args.assigned:
        filters['assigned_to'] = args.assigned
    
    bugs = tracker.list_bugs(filters)
    
    if not bugs:
        print("No bugs found matching the criteria.")
        return 0
    
    print(f"Found {len(bugs)} bugs:")
    print()
    
    # Sort by severity and creation date
    severity_order = {
        Severity.CRITICAL: 0,
        Severity.HIGH: 1,
        Severity.MEDIUM: 2,
        Severity.LOW: 3,
        Severity.INFO: 4
    }
    
    bugs.sort(key=lambda b: (severity_order[b.severity], b.created_at), reverse=True)
    
    for i, bug in enumerate(bugs[:args.limit], 1):
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
            BugStatus.CLOSED: "🔒"
        }.get(bug.status, "❓")
        
        location = ""
        if bug.file_path:
            location = f" ({os.path.basename(bug.file_path)}"
            if bug.line_number:
                location += f":{bug.line_number}"
            location += ")"
        
        print(f"{i:3d}. {severity_icon} {status_icon} [{bug.id[:8]}] {bug.title}{location}")
        
        if args.verbose:
            print(f"     {bug.description}")
            if bug.assigned_to:
                print(f"     Assigned to: {bug.assigned_to}")
    
    if len(bugs) > args.limit:
        print(f"\n... and {len(bugs) - args.limit} more bugs (use --limit to see more)")
    
    return 0


def cmd_search(tracker, args):
    """Handle search command."""
    bugs = tracker.search_bugs(args.query, args.fields)
    
    if not bugs:
        print(f"No bugs found matching '{args.query}'")
        return 0
    
    print(f"Found {len(bugs)} bugs matching '{args.query}':")
    print()
    
    for i, bug in enumerate(bugs, 1):
        severity_icon = {
            Severity.CRITICAL: "🔴",
            Severity.HIGH: "🟠",
            Severity.MEDIUM: "🟡",
            Severity.LOW: "🟢",
            Severity.INFO: "🔵"
        }.get(bug.severity, "⚪")
        
        location = ""
        if bug.file_path:
            location = f" ({os.path.basename(bug.file_path)}"
            if bug.line_number:
                location += f":{bug.line_number}"
            location += ")"
        
        print(f"{i:3d}. {severity_icon} [{bug.id[:8]}] {bug.title}{location}")
    
    return 0


def cmd_show(tracker, args):
    """Handle show command."""
    bug = tracker.get_bug(args.bug_id)
    
    if not bug:
        print(f"Bug not found: {args.bug_id}")
        return 1
    
    print("=" * 60)
    print(f"BUG DETAILS: {bug.title}")
    print("=" * 60)
    print(f"ID: {bug.id}")
    print(f"Type: {bug.bug_type.value.replace('_', ' ').title()}")
    print(f"Severity: {bug.severity.value.title()}")
    print(f"Status: {bug.status.value.replace('_', ' ').title()}")
    print(f"Created: {bug.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Updated: {bug.updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    if bug.assigned_to:
        print(f"Assigned to: {bug.assigned_to}")
    
    if bug.file_path:
        location = bug.file_path
        if bug.line_number:
            location += f":{bug.line_number}"
        if bug.column_number:
            location += f":{bug.column_number}"
        print(f"Location: {location}")
    
    if bug.tags:
        print(f"Tags: {', '.join(bug.tags)}")
    
    print()
    print("Description:")
    print(f"  {bug.description}")
    
    if bug.code_snippet:
        print()
        print("Code snippet:")
        print(f"  > {bug.code_snippet}")
    
    if bug.metadata:
        print()
        print("Metadata:")
        for key, value in bug.metadata.items():
            print(f"  {key}: {value}")
    
    return 0


def cmd_report(reporter, args):
    """Handle report command."""
    if args.summary:
        report = reporter.generate_summary_report()
        print(report)
    
    elif args.detailed:
        report = reporter.generate_detailed_report(args.include_closed)
        print(report)
    
    elif args.file:
        report = reporter.generate_file_report(args.file)
        print(report)
    
    elif args.html:
        if reporter.export_html_report(args.html, args.include_closed):
            print(f"HTML report generated: {args.html}")
        else:
            print(f"Failed to generate HTML report: {args.html}")
            return 1
    
    return 0


def cmd_update(tracker, args):
    """Handle update command."""
    bug = tracker.get_bug(args.bug_id)
    
    if not bug:
        print(f"Bug not found: {args.bug_id}")
        return 1
    
    updates = {}
    
    if args.status:
        updates['status'] = args.status
    if args.severity:
        updates['severity'] = args.severity
    if args.assigned_to:
        updates['assigned_to'] = args.assigned_to
    if args.title:
        updates['title'] = args.title
    if args.description:
        updates['description'] = args.description
    
    if not updates:
        print("No updates specified.")
        return 1
    
    if tracker.update_bug(args.bug_id, **updates):
        print(f"Bug {args.bug_id} updated successfully.")
        
        # Show what was updated
        for field, value in updates.items():
            print(f"  {field}: {value}")
    else:
        print(f"Failed to update bug: {args.bug_id}")
        return 1
    
    return 0


def cmd_close(tracker, args):
    """Handle close command."""
    if tracker.close_bug(args.bug_id, args.assigned_to):
        print(f"Bug {args.bug_id} closed successfully.")
    else:
        print(f"Failed to close bug: {args.bug_id}")
        return 1
    
    return 0


def cmd_assign(tracker, args):
    """Handle assign command."""
    if tracker.assign_bug(args.bug_id, args.assignee):
        print(f"Bug {args.bug_id} assigned to {args.assignee}.")
    else:
        print(f"Failed to assign bug: {args.bug_id}")
        return 1
    
    return 0


def cmd_stats(tracker, args):
    """Handle stats command."""
    stats = tracker.get_statistics()
    
    print("=" * 50)
    print("BUG STATISTICS")
    print("=" * 50)
    print(f"Total bugs: {stats['total_bugs']}")
    print(f"Average age: {stats['average_age_days']:.1f} days")
    print()
    
    print("By Status:")
    for status, count in stats['by_status'].items():
        if count > 0:
            percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
            print(f"  {status.replace('_', ' ').title():<15}: {count:>3} ({percentage:>5.1f}%)")
    print()
    
    print("By Severity:")
    for severity, count in stats['by_severity'].items():
        if count > 0:
            percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
            print(f"  {severity.title():<15}: {count:>3} ({percentage:>5.1f}%)")
    print()
    
    print("By Type:")
    for bug_type, count in stats['by_type'].items():
        if count > 0:
            percentage = (count / stats['total_bugs']) * 100 if stats['total_bugs'] > 0 else 0
            display_name = bug_type.replace('_', ' ').title()
            print(f"  {display_name:<20}: {count:>3} ({percentage:>5.1f}%)")
    print()
    
    if stats['by_file']:
        print("Top Files with Bugs:")
        for file_name, count in list(stats['by_file'].items())[:5]:
            print(f"  {file_name:<30}: {count:>3} bugs")
    
    return 0


def cmd_export(tracker, args):
    """Handle export command."""
    if tracker.export_bugs(args.output_file, args.format):
        print(f"Bugs exported to {args.output_file} ({args.format} format)")
    else:
        print(f"Failed to export bugs to {args.output_file}")
        return 1
    
    return 0


def cmd_import(tracker, args):
    """Handle import command."""
    count = tracker.import_bugs(args.input_file, args.merge)
    
    if count > 0:
        print(f"Imported {count} bugs from {args.input_file}")
    else:
        print(f"No bugs imported from {args.input_file}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())