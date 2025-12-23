#!/usr/bin/env python3
"""
Skills Tracker - A system for tracking and comparing 1p vs MCP skills usage

This module provides functionality to:
- Track usage of first-party (1p) and MCP skills
- Record performance metrics and comparisons
- Generate reports and analytics
- Monitor skill effectiveness over time
"""

import json
import datetime
import os
import uuid
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class SkillType(Enum):
    """Enumeration of skill types."""
    FIRST_PARTY = "1p"
    MCP = "mcp"


@dataclass
class SkillUsage:
    """Data class representing a single skill usage event."""
    id: str
    skill_name: str
    skill_type: SkillType
    timestamp: str
    duration_ms: float
    success: bool
    input_size: int
    output_size: int
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class SkillsTracker:
    """Main class for tracking and analyzing skill usage."""
    
    def __init__(self, data_file: str = "skills_data.json", config_file: str = "config/skills_config.json"):
        """
        Initialize the SkillsTracker.
        
        Args:
            data_file: Path to the JSON file storing usage data
            config_file: Path to the configuration file
        """
        self.data_file = data_file
        self.config_file = config_file
        self.usage_data: List[SkillUsage] = []
        self.config = self._load_config()
        self._load_data()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file."""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {
            "retention_days": 30,
            "enable_detailed_logging": True,
            "performance_thresholds": {
                "slow_threshold_ms": 1000,
                "error_rate_threshold": 0.1
            }
        }
    
    def _load_data(self) -> None:
        """Load existing usage data from file."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    self.usage_data = [
                        SkillUsage(
                            id=item['id'],
                            skill_name=item['skill_name'],
                            skill_type=SkillType(item['skill_type']),
                            timestamp=item['timestamp'],
                            duration_ms=item['duration_ms'],
                            success=item['success'],
                            input_size=item['input_size'],
                            output_size=item['output_size'],
                            error_message=item.get('error_message'),
                            metadata=item.get('metadata')
                        )
                        for item in data
                    ]
            except (json.JSONDecodeError, KeyError) as e:
                print(f"Error loading data: {e}. Starting with empty dataset.")
                self.usage_data = []
    
    def _save_data(self) -> None:
        """Save usage data to file."""
        data = [asdict(usage) for usage in self.usage_data]
        # Convert enum to string for JSON serialization
        for item in data:
            item['skill_type'] = item['skill_type'].value
        
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def record_usage(
        self,
        skill_name: str,
        skill_type: SkillType,
        duration_ms: float,
        success: bool,
        input_size: int = 0,
        output_size: int = 0,
        error_message: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Record a skill usage event.
        
        Args:
            skill_name: Name of the skill used
            skill_type: Type of skill (1p or MCP)
            duration_ms: Duration of execution in milliseconds
            success: Whether the skill execution was successful
            input_size: Size of input data
            output_size: Size of output data
            error_message: Error message if execution failed
            metadata: Additional metadata for the usage event
            
        Returns:
            ID of the recorded usage event
        """
        usage_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now().isoformat()
        
        usage = SkillUsage(
            id=usage_id,
            skill_name=skill_name,
            skill_type=skill_type,
            timestamp=timestamp,
            duration_ms=duration_ms,
            success=success,
            input_size=input_size,
            output_size=output_size,
            error_message=error_message,
            metadata=metadata or {}
        )
        
        self.usage_data.append(usage)
        self._save_data()
        return usage_id
    
    def get_usage_stats(self, days: int = 7) -> Dict[str, Any]:
        """
        Get usage statistics for the specified number of days.
        
        Args:
            days: Number of days to look back for statistics
            
        Returns:
            Dictionary containing usage statistics
        """
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        recent_data = [
            usage for usage in self.usage_data
            if datetime.datetime.fromisoformat(usage.timestamp) >= cutoff_date
        ]
        
        stats = {
            "total_usages": len(recent_data),
            "1p_usages": len([u for u in recent_data if u.skill_type == SkillType.FIRST_PARTY]),
            "mcp_usages": len([u for u in recent_data if u.skill_type == SkillType.MCP]),
            "success_rate": sum(1 for u in recent_data if u.success) / len(recent_data) if recent_data else 0,
            "avg_duration_ms": sum(u.duration_ms for u in recent_data) / len(recent_data) if recent_data else 0,
            "skills_breakdown": self._get_skills_breakdown(recent_data),
            "performance_comparison": self._compare_performance(recent_data)
        }
        
        return stats
    
    def _get_skills_breakdown(self, data: List[SkillUsage]) -> Dict[str, Dict[str, Any]]:
        """Get breakdown of usage by skill name and type."""
        breakdown = {}
        
        for usage in data:
            key = f"{usage.skill_name} ({usage.skill_type.value})"
            if key not in breakdown:
                breakdown[key] = {
                    "count": 0,
                    "success_rate": 0,
                    "avg_duration_ms": 0,
                    "total_duration_ms": 0
                }
            
            breakdown[key]["count"] += 1
            breakdown[key]["total_duration_ms"] += usage.duration_ms
            if usage.success:
                breakdown[key]["success_rate"] += 1
        
        # Calculate averages
        for skill_data in breakdown.values():
            skill_data["success_rate"] = skill_data["success_rate"] / skill_data["count"]
            skill_data["avg_duration_ms"] = skill_data["total_duration_ms"] / skill_data["count"]
            del skill_data["total_duration_ms"]
        
        return breakdown
    
    def _compare_performance(self, data: List[SkillUsage]) -> Dict[str, Any]:
        """Compare performance between 1p and MCP skills."""
        fp_data = [u for u in data if u.skill_type == SkillType.FIRST_PARTY]
        mcp_data = [u for u in data if u.skill_type == SkillType.MCP]
        
        comparison = {}
        
        if fp_data:
            comparison["1p"] = {
                "count": len(fp_data),
                "success_rate": sum(1 for u in fp_data if u.success) / len(fp_data),
                "avg_duration_ms": sum(u.duration_ms for u in fp_data) / len(fp_data),
                "avg_input_size": sum(u.input_size for u in fp_data) / len(fp_data),
                "avg_output_size": sum(u.output_size for u in fp_data) / len(fp_data)
            }
        
        if mcp_data:
            comparison["mcp"] = {
                "count": len(mcp_data),
                "success_rate": sum(1 for u in mcp_data if u.success) / len(mcp_data),
                "avg_duration_ms": sum(u.duration_ms for u in mcp_data) / len(mcp_data),
                "avg_input_size": sum(u.input_size for u in mcp_data) / len(mcp_data),
                "avg_output_size": sum(u.output_size for u in mcp_data) / len(mcp_data)
            }
        
        return comparison
    
    def generate_report(self, days: int = 7) -> str:
        """
        Generate a formatted report of skill usage statistics.
        
        Args:
            days: Number of days to include in the report
            
        Returns:
            Formatted report as a string
        """
        stats = self.get_usage_stats(days)
        
        # Calculate percentages safely
        fp_pct = (stats['1p_usages']/stats['total_usages']*100) if stats['total_usages'] > 0 else 0
        mcp_pct = (stats['mcp_usages']/stats['total_usages']*100) if stats['total_usages'] > 0 else 0
        
        report = f"""
Skills Usage Report (Last {days} days)
=======================================

Overall Statistics:
- Total Usages: {stats['total_usages']}
- 1p Skills: {stats['1p_usages']} ({fp_pct:.1f}%)
- MCP Skills: {stats['mcp_usages']} ({mcp_pct:.1f}%)
- Overall Success Rate: {stats['success_rate']:.2%}
- Average Duration: {stats['avg_duration_ms']:.2f}ms

Performance Comparison:
"""
        
        for skill_type, perf_data in stats['performance_comparison'].items():
            report += f"""
{skill_type.upper()} Skills:
- Count: {perf_data['count']}
- Success Rate: {perf_data['success_rate']:.2%}
- Avg Duration: {perf_data['avg_duration_ms']:.2f}ms
- Avg Input Size: {perf_data['avg_input_size']:.0f} bytes
- Avg Output Size: {perf_data['avg_output_size']:.0f} bytes
"""
        
        report += "\nSkills Breakdown:\n"
        for skill_name, skill_data in stats['skills_breakdown'].items():
            report += f"- {skill_name}: {skill_data['count']} uses, {skill_data['success_rate']:.2%} success, {skill_data['avg_duration_ms']:.2f}ms avg\n"
        
        return report


def main():
    """CLI interface for the skills tracker."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Skills Tracker CLI")
    parser.add_argument("command", choices=["record", "stats", "report"], help="Command to execute")
    parser.add_argument("--skill-name", help="Name of the skill")
    parser.add_argument("--skill-type", choices=["1p", "mcp"], help="Type of skill")
    parser.add_argument("--duration", type=float, help="Duration in milliseconds")
    parser.add_argument("--success", action="store_true", help="Mark as successful")
    parser.add_argument("--days", type=int, default=7, help="Number of days for stats/report")
    
    args = parser.parse_args()
    
    tracker = SkillsTracker()
    
    if args.command == "record":
        if not all([args.skill_name, args.skill_type, args.duration is not None]):
            print("Error: record command requires --skill-name, --skill-type, and --duration")
            return
        
        skill_type = SkillType.FIRST_PARTY if args.skill_type == "1p" else SkillType.MCP
        usage_id = tracker.record_usage(
            skill_name=args.skill_name,
            skill_type=skill_type,
            duration_ms=args.duration,
            success=args.success
        )
        print(f"Recorded usage with ID: {usage_id}")
    
    elif args.command == "stats":
        stats = tracker.get_usage_stats(args.days)
        print(json.dumps(stats, indent=2))
    
    elif args.command == "report":
        report = tracker.generate_report(args.days)
        print(report)


if __name__ == "__main__":
    main()