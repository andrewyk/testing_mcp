#!/usr/bin/env python3
"""
Skills Dashboard - Interactive CLI dashboard for skills tracking

Provides an interactive command-line interface to view and analyze
skill usage data with real-time updates and visualizations.
"""

import sys
import os
import time
import json
from datetime import datetime, timedelta

# Add the parent directory to the path so we can import skills_tracker
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from skills_tracker import SkillsTracker, SkillType


class SkillsDashboard:
    """Interactive dashboard for skills tracking data."""
    
    def __init__(self):
        self.tracker = SkillsTracker()
        self.running = True
    
    def clear_screen(self):
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_header(self):
        """Print the dashboard header."""
        print("🎯 Skills Tracking Dashboard")
        print("=" * 50)
        print(f"📅 Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 50)
    
    def print_menu(self):
        """Print the main menu options."""
        print("\n📋 Dashboard Options:")
        print("1. 📊 Live Statistics")
        print("2. 📈 Performance Comparison")
        print("3. 🏆 Top Skills")
        print("4. 📅 Historical Trends")
        print("5. 🚨 Recent Alerts")
        print("6. 🔄 Refresh Data")
        print("7. 📝 Add Test Data")
        print("8. 🚪 Exit")
        print("-" * 30)
    
    def show_live_statistics(self):
        """Display live statistics for the last 24 hours."""
        print("\n📊 Live Statistics (Last 24 Hours)")
        print("-" * 40)
        
        stats = self.tracker.get_usage_stats(days=1)
        
        if stats["total_usages"] == 0:
            print("❌ No usage data found for the last 24 hours")
            print("💡 Try adding some test data (option 7)")
            return
        
        # Overall stats
        print(f"Total Skills Used: {stats['total_usages']}")
        print(f"Success Rate: {stats['success_rate']:.2%}")
        print(f"Average Duration: {stats['avg_duration_ms']:.1f}ms")
        
        # Breakdown by type
        total = stats['total_usages']
        fp_pct = (stats['1p_usages'] / total * 100) if total > 0 else 0
        mcp_pct = (stats['mcp_usages'] / total * 100) if total > 0 else 0
        
        print(f"\n🔧 1p Skills: {stats['1p_usages']} ({fp_pct:.1f}%)")
        print(f"🌐 MCP Skills: {stats['mcp_usages']} ({mcp_pct:.1f}%)")
        
        # Visual bar chart
        self.print_usage_bar_chart(stats['1p_usages'], stats['mcp_usages'])
    
    def print_usage_bar_chart(self, fp_count: int, mcp_count: int):
        """Print a simple ASCII bar chart of usage."""
        total = fp_count + mcp_count
        if total == 0:
            return
        
        max_width = 30
        fp_width = int((fp_count / total) * max_width)
        mcp_width = int((mcp_count / total) * max_width)
        
        print(f"\n📊 Usage Distribution:")
        print(f"1p  {'█' * fp_width}{'░' * (max_width - fp_width)} {fp_count}")
        print(f"MCP {'█' * mcp_width}{'░' * (max_width - mcp_width)} {mcp_count}")
    
    def show_performance_comparison(self):
        """Show detailed performance comparison between skill types."""
        print("\n📈 Performance Comparison")
        print("-" * 40)
        
        stats = self.tracker.get_usage_stats(days=7)
        comparison = stats.get("performance_comparison", {})
        
        if not comparison:
            print("❌ No performance data available")
            return
        
        # Display comparison table
        print(f"{'Metric':<20} {'1p Skills':<15} {'MCP Skills':<15} {'Ratio':<10}")
        print("-" * 65)
        
        if "1p" in comparison and "mcp" in comparison:
            fp_data = comparison["1p"]
            mcp_data = comparison["mcp"]
            
            # Success rate
            fp_success = fp_data["success_rate"] * 100
            mcp_success = mcp_data["success_rate"] * 100
            success_ratio = fp_success / mcp_success if mcp_success > 0 else 0
            print(f"{'Success Rate':<20} {fp_success:<14.1f}% {mcp_success:<14.1f}% {success_ratio:<9.2f}x")
            
            # Duration
            fp_duration = fp_data["avg_duration_ms"]
            mcp_duration = mcp_data["avg_duration_ms"]
            duration_ratio = mcp_duration / fp_duration if fp_duration > 0 else 0
            print(f"{'Avg Duration':<20} {fp_duration:<14.1f}ms {mcp_duration:<14.1f}ms {duration_ratio:<9.2f}x")
            
            # Data sizes
            fp_input = fp_data["avg_input_size"]
            mcp_input = mcp_data["avg_input_size"]
            input_ratio = mcp_input / fp_input if fp_input > 0 else 0
            print(f"{'Avg Input Size':<20} {fp_input:<14.0f}B  {mcp_input:<14.0f}B  {input_ratio:<9.2f}x")
    
    def show_top_skills(self):
        """Show the most frequently used skills."""
        print("\n🏆 Top Skills (Last 7 Days)")
        print("-" * 40)
        
        stats = self.tracker.get_usage_stats(days=7)
        breakdown = stats.get("skills_breakdown", {})
        
        if not breakdown:
            print("❌ No skills data available")
            return
        
        # Sort by usage count
        sorted_skills = sorted(breakdown.items(), key=lambda x: x[1]["count"], reverse=True)
        
        print(f"{'Rank':<5} {'Skill Name':<25} {'Uses':<8} {'Success':<9} {'Avg Time':<10}")
        print("-" * 65)
        
        for i, (skill_name, data) in enumerate(sorted_skills[:10], 1):
            success_pct = data["success_rate"] * 100
            avg_time = data["avg_duration_ms"]
            print(f"{i:<5} {skill_name:<25} {data['count']:<8} {success_pct:<8.1f}% {avg_time:<9.1f}ms")
    
    def show_historical_trends(self):
        """Show historical trends over different time periods."""
        print("\n📅 Historical Trends")
        print("-" * 40)
        
        periods = [1, 3, 7, 14, 30]
        
        print(f"{'Period':<12} {'Total Uses':<12} {'1p %':<8} {'MCP %':<8} {'Success %':<10}")
        print("-" * 55)
        
        for days in periods:
            stats = self.tracker.get_usage_stats(days=days)
            total = stats["total_usages"]
            
            if total > 0:
                fp_pct = (stats["1p_usages"] / total) * 100
                mcp_pct = (stats["mcp_usages"] / total) * 100
                success_pct = stats["success_rate"] * 100
                
                period_name = f"{days} day{'s' if days != 1 else ''}"
                print(f"{period_name:<12} {total:<12} {fp_pct:<7.1f}% {mcp_pct:<7.1f}% {success_pct:<9.1f}%")
            else:
                period_name = f"{days} day{'s' if days != 1 else ''}"
                print(f"{period_name:<12} {'0':<12} {'-':<7} {'-':<7} {'-':<9}")
    
    def show_recent_alerts(self):
        """Show simulated alerts based on recent performance."""
        print("\n🚨 Recent Performance Alerts")
        print("-" * 40)
        
        stats = self.tracker.get_usage_stats(days=1)
        alerts = []
        
        # Check for various alert conditions
        if stats["total_usages"] > 0:
            if stats["success_rate"] < 0.9:
                alerts.append(f"⚠️  LOW SUCCESS RATE: {stats['success_rate']:.2%} (threshold: 90%)")
            
            if stats["avg_duration_ms"] > 1000:
                alerts.append(f"🐌 HIGH LATENCY: {stats['avg_duration_ms']:.0f}ms (threshold: 1000ms)")
            
            # Check individual skills
            for skill_name, skill_data in stats["skills_breakdown"].items():
                if skill_data["success_rate"] < 0.8:
                    alerts.append(f"🚨 SKILL DEGRADED: {skill_name} - {skill_data['success_rate']:.2%} success")
                
                if skill_data["avg_duration_ms"] > 2000:
                    alerts.append(f"⏰ SLOW SKILL: {skill_name} - {skill_data['avg_duration_ms']:.0f}ms avg")
        
        if alerts:
            for alert in alerts:
                print(alert)
        else:
            print("✅ No alerts - All systems performing normally")
    
    def add_test_data(self):
        """Add some test data for demonstration purposes."""
        print("\n📝 Adding Test Data...")
        print("-" * 30)
        
        import random
        
        # Add some 1p skill usage
        for _ in range(5):
            self.tracker.record_usage(
                skill_name=random.choice(["file_ops", "text_proc", "data_analysis"]),
                skill_type=SkillType.FIRST_PARTY,
                duration_ms=random.uniform(50, 200),
                success=random.random() > 0.02,
                input_size=random.randint(100, 1000),
                output_size=random.randint(200, 2000)
            )
        
        # Add some MCP skill usage
        for _ in range(3):
            self.tracker.record_usage(
                skill_name=random.choice(["database_query", "api_integration", "cloud_storage"]),
                skill_type=SkillType.MCP,
                duration_ms=random.uniform(200, 800),
                success=random.random() > 0.05,
                input_size=random.randint(500, 3000),
                output_size=random.randint(1000, 5000)
            )
        
        print("✅ Test data added successfully!")
    
    def run(self):
        """Run the main dashboard loop."""
        while self.running:
            self.clear_screen()
            self.print_header()
            self.print_menu()
            
            try:
                choice = input("🎯 Select an option (1-8): ").strip()
                
                if choice == "1":
                    self.show_live_statistics()
                elif choice == "2":
                    self.show_performance_comparison()
                elif choice == "3":
                    self.show_top_skills()
                elif choice == "4":
                    self.show_historical_trends()
                elif choice == "5":
                    self.show_recent_alerts()
                elif choice == "6":
                    print("\n🔄 Data refreshed!")
                elif choice == "7":
                    self.add_test_data()
                elif choice == "8":
                    print("\n👋 Goodbye!")
                    self.running = False
                    continue
                else:
                    print("\n❌ Invalid option. Please select 1-8.")
                
                if self.running:
                    input("\n⏸️  Press Enter to continue...")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Dashboard interrupted. Goodbye!")
                self.running = False
            except Exception as e:
                print(f"\n❌ Error: {e}")
                input("\n⏸️  Press Enter to continue...")


def main():
    """Main entry point for the dashboard."""
    print("🚀 Starting Skills Tracking Dashboard...")
    time.sleep(1)
    
    dashboard = SkillsDashboard()
    dashboard.run()


if __name__ == "__main__":
    main()