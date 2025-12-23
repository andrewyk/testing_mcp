#!/usr/bin/env python3
"""
Test script for the Bug Inspector system.
This script demonstrates the functionality and validates the implementation.
"""

import os
import sys
import tempfile
import shutil
from pathlib import Path

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bug_inspector import BugDetector, BugTracker, BugReporter, Bug, BugType, Severity, BugStatus


def test_bug_models():
    """Test the Bug data models."""
    print("Testing Bug Models...")
    
    # Create a test bug
    bug = Bug(
        title="Test Bug",
        description="This is a test bug for validation",
        bug_type=BugType.LOGIC_ERROR,
        severity=Severity.HIGH,
        file_path="/test/file.py",
        line_number=10
    )
    
    # Test serialization
    bug_dict = bug.to_dict()
    reconstructed_bug = Bug.from_dict(bug_dict)
    
    assert bug.id == reconstructed_bug.id
    assert bug.title == reconstructed_bug.title
    assert bug.bug_type == reconstructed_bug.bug_type
    
    # Test status updates
    bug.update_status(BugStatus.FIXED, "test_user")
    assert bug.status == BugStatus.FIXED
    assert bug.assigned_to == "test_user"
    
    # Test tags
    bug.add_tag("urgent")
    bug.add_tag("frontend")
    assert "urgent" in bug.tags
    assert "frontend" in bug.tags
    
    bug.remove_tag("urgent")
    assert "urgent" not in bug.tags
    
    print("✅ Bug Models tests passed")


def test_bug_detector():
    """Test the Bug Detector functionality."""
    print("Testing Bug Detector...")
    
    detector = BugDetector()
    
    # Test on sample buggy file
    sample_file = os.path.join("sample_code", "buggy_python.py")
    if os.path.exists(sample_file):
        bugs = detector.scan_file(sample_file)
        print(f"  Detected {len(bugs)} bugs in {sample_file}")
        
        # Check for specific bug types
        bug_types = [bug.bug_type for bug in bugs]
        assert BugType.SECURITY_VULNERABILITY in bug_types
        assert BugType.SYNTAX_ERROR in bug_types
        
        # Print some detected bugs
        for bug in bugs[:5]:
            print(f"    {bug.severity.value}: {bug.title} (line {bug.line_number})")
    
    # Test on clean file
    clean_file = os.path.join("sample_code", "clean_python.py")
    if os.path.exists(clean_file):
        clean_bugs = detector.scan_file(clean_file)
        print(f"  Detected {len(clean_bugs)} bugs in {clean_file}")
        
        # Clean file should have minimal bugs
        critical_bugs = [b for b in clean_bugs if b.severity == Severity.CRITICAL]
        assert len(critical_bugs) == 0
    
    # Test directory scanning
    if os.path.exists("sample_code"):
        all_bugs = detector.scan_directory("sample_code")
        print(f"  Detected {len(all_bugs)} total bugs in sample_code directory")
    
    print("✅ Bug Detector tests passed")


def test_bug_tracker():
    """Test the Bug Tracker functionality."""
    print("Testing Bug Tracker...")
    
    # Create a temporary storage file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.json') as tmp_file:
        tracker = BugTracker(tmp_file.name)
    
    try:
        # Test adding bugs
        bug1 = Bug(
            title="Critical Security Issue",
            description="SQL injection vulnerability",
            bug_type=BugType.SECURITY_VULNERABILITY,
            severity=Severity.CRITICAL,
            file_path="app.py",
            line_number=45
        )
        
        bug2 = Bug(
            title="Logic Error",
            description="Incorrect condition check",
            bug_type=BugType.LOGIC_ERROR,
            severity=Severity.MEDIUM,
            file_path="utils.py",
            line_number=12
        )
        
        # Add bugs
        id1 = tracker.add_bug(bug1)
        id2 = tracker.add_bug(bug2)
        
        assert len(tracker) == 2
        assert id1 in tracker
        assert id2 in tracker
        
        # Test retrieval
        retrieved_bug = tracker.get_bug(id1)
        assert retrieved_bug.title == "Critical Security Issue"
        
        # Test filtering
        critical_bugs = tracker.list_bugs({'severity': Severity.CRITICAL})
        assert len(critical_bugs) == 1
        assert critical_bugs[0].id == id1
        
        # Test search
        search_results = tracker.search_bugs("security")
        assert len(search_results) == 1
        
        # Test updates
        tracker.update_bug(id1, status=BugStatus.IN_PROGRESS, assigned_to="developer1")
        updated_bug = tracker.get_bug(id1)
        assert updated_bug.status == BugStatus.IN_PROGRESS
        assert updated_bug.assigned_to == "developer1"
        
        # Test statistics
        stats = tracker.get_statistics()
        assert stats['total_bugs'] == 2
        assert stats['by_severity']['critical'] == 1
        assert stats['by_severity']['medium'] == 1
        
        # Test bulk operations
        tracker.bulk_update_status([id1, id2], BugStatus.CLOSED)
        assert tracker.get_bug(id1).status == BugStatus.CLOSED
        assert tracker.get_bug(id2).status == BugStatus.CLOSED
        
        # Test export/import
        export_file = tmp_file.name + "_export.json"
        assert tracker.export_bugs(export_file)
        
        # Create new tracker and import
        tracker2 = BugTracker(tmp_file.name + "_new.json")
        imported_count = tracker2.import_bugs(export_file)
        assert imported_count == 2
        assert len(tracker2) == 2
        
        # Cleanup
        os.unlink(export_file)
        os.unlink(tmp_file.name + "_new.json")
        
    finally:
        # Cleanup
        if os.path.exists(tmp_file.name):
            os.unlink(tmp_file.name)
    
    print("✅ Bug Tracker tests passed")


def test_bug_reporter():
    """Test the Bug Reporter functionality."""
    print("Testing Bug Reporter...")
    
    # Create tracker with test data
    with tempfile.NamedTemporaryFile(delete=False, suffix='.json') as tmp_file:
        tracker = BugTracker(tmp_file.name)
    
    try:
        reporter = BugReporter(tracker)
        
        # Add test bugs
        bugs = [
            Bug(
                title="Critical Security Bug",
                description="Buffer overflow",
                bug_type=BugType.SECURITY_VULNERABILITY,
                severity=Severity.CRITICAL,
                file_path="main.c",
                line_number=23
            ),
            Bug(
                title="Logic Error",
                description="Incorrect loop condition",
                bug_type=BugType.LOGIC_ERROR,
                severity=Severity.HIGH,
                file_path="logic.py",
                line_number=15
            ),
            Bug(
                title="Code Quality Issue",
                description="Unused variable",
                bug_type=BugType.CODE_QUALITY,
                severity=Severity.LOW,
                file_path="utils.py",
                line_number=8
            )
        ]
        
        for bug in bugs:
            tracker.add_bug(bug)
        
        # Test summary report
        summary = reporter.generate_summary_report()
        assert "BUG INSPECTION SUMMARY REPORT" in summary
        assert "CRITICAL" in summary
        assert "3" in summary  # Total bugs
        
        # Test detailed report
        detailed = reporter.generate_detailed_report()
        assert "DETAILED BUG REPORT" in detailed
        assert "Critical Security Bug" in detailed
        
        # Test file report
        file_report = reporter.generate_file_report("logic.py")
        assert "logic.py" in file_report
        assert "Logic Error" in file_report
        
        # Test HTML export
        html_file = tmp_file.name + ".html"
        assert reporter.export_html_report(html_file)
        assert os.path.exists(html_file)
        
        with open(html_file, 'r') as f:
            html_content = f.read()
            assert "Bug Inspection Report" in html_content
            assert "Critical Security Bug" in html_content
        
        os.unlink(html_file)
        
        # Test metrics
        metrics = reporter.generate_metrics_summary()
        assert metrics['total_bugs'] == 3
        assert metrics['critical_open'] == 1
        assert 'top_bug_types' in metrics
        
    finally:
        if os.path.exists(tmp_file.name):
            os.unlink(tmp_file.name)
    
    print("✅ Bug Reporter tests passed")


def test_integration():
    """Test end-to-end integration."""
    print("Testing Integration...")
    
    # Create temporary directory for testing
    with tempfile.TemporaryDirectory() as temp_dir:
        test_storage = os.path.join(temp_dir, "test_bugs.json")
        
        # Initialize components
        detector = BugDetector()
        tracker = BugTracker(test_storage)
        reporter = BugReporter(tracker)
        
        # Scan sample files and add to tracker
        if os.path.exists("sample_code"):
            bugs = detector.scan_directory("sample_code")
            for bug in bugs:
                tracker.add_bug(bug)
            
            print(f"  Integrated scan found {len(bugs)} bugs")
            
            # Generate reports
            summary = reporter.generate_summary_report()
            assert len(summary) > 100  # Should be a substantial report
            
            # Test filtering and management
            critical_bugs = tracker.list_bugs({'severity': Severity.CRITICAL})
            if critical_bugs:
                # Assign and close a critical bug
                bug_id = critical_bugs[0].id
                tracker.assign_bug(bug_id, "security_team")
                tracker.close_bug(bug_id, "security_team")
                
                updated_bug = tracker.get_bug(bug_id)
                assert updated_bug.status == BugStatus.CLOSED
                assert updated_bug.assigned_to == "security_team"
        
        print("✅ Integration tests passed")


def demo_functionality():
    """Demonstrate the bug inspector functionality."""
    print("\n" + "="*60)
    print("BUG INSPECTOR DEMONSTRATION")
    print("="*60)
    
    # Create demo tracker
    tracker = BugTracker("demo_bugs.json")
    detector = BugDetector()
    reporter = BugReporter(tracker)
    
    print("\n1. Scanning sample code files...")
    
    # Scan the sample files
    if os.path.exists("sample_code"):
        bugs = detector.scan_directory("sample_code")
        print(f"   Found {len(bugs)} potential bugs")
        
        # Add to tracker
        for bug in bugs:
            tracker.add_bug(bug)
        
        print(f"   Added {len(bugs)} bugs to tracking system")
    
    print("\n2. Generating summary report...")
    summary = reporter.generate_summary_report()
    print(summary)
    
    print("\n3. Bug statistics:")
    stats = tracker.get_statistics()
    print(f"   Total bugs: {stats['total_bugs']}")
    print(f"   Critical bugs: {stats['by_severity'].get('critical', 0)}")
    print(f"   High priority bugs: {stats['by_severity'].get('high', 0)}")
    print(f"   Average age: {stats['average_age_days']:.1f} days")
    
    print("\n4. Most problematic files:")
    for file_name, count in list(stats['by_file'].items())[:3]:
        print(f"   {file_name}: {count} bugs")
    
    print("\n5. Exporting HTML report...")
    if reporter.export_html_report("bug_report.html"):
        print("   ✅ HTML report generated: bug_report.html")
    
    print("\n6. Exporting JSON data...")
    if tracker.export_bugs("bug_data.json"):
        print("   ✅ Bug data exported: bug_data.json")
    
    print("\n" + "="*60)
    print("DEMONSTRATION COMPLETE")
    print("="*60)
    print("\nFiles generated:")
    print("  - bug_report.html (Visual bug report)")
    print("  - bug_data.json (Raw bug data)")
    print("  - demo_bugs.json (Bug tracker storage)")


def main():
    """Run all tests and demonstration."""
    print("Starting Bug Inspector Tests...")
    print("="*50)
    
    try:
        # Run tests
        test_bug_models()
        test_bug_detector()
        test_bug_tracker()
        test_bug_reporter()
        test_integration()
        
        print("\n✅ All tests passed!")
        
        # Run demonstration
        demo_functionality()
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())