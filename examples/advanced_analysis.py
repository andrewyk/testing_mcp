#!/usr/bin/env python3
"""
Advanced Example: Performance Analysis and Comparison

This example demonstrates advanced features of the skills tracker including:
- Performance benchmarking between 1p and MCP skills
- Detailed analytics and trending
- Alert simulation
- Custom reporting
"""

import sys
import os
import time
import random
import statistics
from datetime import datetime, timedelta

# Add the parent directory to the path so we can import skills_tracker
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from skills_tracker import SkillsTracker, SkillType


class PerformanceAnalyzer:
    """Advanced performance analysis for skills comparison."""
    
    def __init__(self, tracker: SkillsTracker):
        self.tracker = tracker
    
    def benchmark_skill_types(self, iterations: int = 50) -> dict:
        """
        Run a controlled benchmark comparing 1p vs MCP skills.
        """
        print(f"🏁 Starting performance benchmark ({iterations} iterations each)")
        print("=" * 60)
        
        results = {
            "1p": {"durations": [], "successes": []},
            "mcp": {"durations": [], "successes": []}
        }
        
        # Benchmark 1p skills
        print("\n🔧 Benchmarking First-Party Skills...")
        for i in range(iterations):
            start = time.time()
            
            # Simulate consistent 1p performance
            duration = random.gauss(100, 20)  # Mean 100ms, std dev 20ms
            duration = max(50, duration)  # Minimum 50ms
            
            success = random.random() > 0.01  # 99% success rate
            
            self.tracker.record_usage(
                skill_name="benchmark_1p",
                skill_type=SkillType.FIRST_PARTY,
                duration_ms=duration,
                success=success,
                input_size=1000,
                output_size=2000,
                metadata={"benchmark": True, "iteration": i}
            )
            
            results["1p"]["durations"].append(duration)
            results["1p"]["successes"].append(success)
            
            if (i + 1) % 10 == 0:
                print(f"   Progress: {i + 1}/{iterations} iterations")
        
        # Benchmark MCP skills
        print("\n🌐 Benchmarking MCP Skills...")
        for i in range(iterations):
            start = time.time()
            
            # Simulate variable MCP performance
            if random.random() > 0.1:  # 90% normal performance
                duration = random.gauss(400, 100)  # Mean 400ms, std dev 100ms
            else:  # 10% slow responses (network issues, etc.)
                duration = random.gauss(2000, 500)  # Mean 2000ms, std dev 500ms
            
            duration = max(100, duration)  # Minimum 100ms
            success = random.random() > 0.05  # 95% success rate
            
            self.tracker.record_usage(
                skill_name="benchmark_mcp",
                skill_type=SkillType.MCP,
                duration_ms=duration,
                success=success,
                input_size=1000,
                output_size=2000,
                metadata={"benchmark": True, "iteration": i}
            )
            
            results["mcp"]["durations"].append(duration)
            results["mcp"]["successes"].append(success)
            
            if (i + 1) % 10 == 0:
                print(f"   Progress: {i + 1}/{iterations} iterations")
        
        return results
    
    def analyze_benchmark_results(self, results: dict) -> dict:
        """Analyze benchmark results and generate detailed statistics."""
        analysis = {}
        
        for skill_type, data in results.items():
            durations = data["durations"]
            successes = data["successes"]
            
            analysis[skill_type] = {
                "count": len(durations),
                "success_rate": sum(successes) / len(successes),
                "duration_stats": {
                    "mean": statistics.mean(durations),
                    "median": statistics.median(durations),
                    "std_dev": statistics.stdev(durations),
                    "min": min(durations),
                    "max": max(durations),
                    "p95": sorted(durations)[int(0.95 * len(durations))],
                    "p99": sorted(durations)[int(0.99 * len(durations))]
                }
            }
        
        return analysis
    
    def generate_comparison_report(self, analysis: dict) -> str:
        """Generate a detailed comparison report."""
        report = """
Performance Benchmark Analysis
==============================

"""
        
        for skill_type, stats in analysis.items():
            type_name = "First-Party (1p)" if skill_type == "1p" else "MCP"
            report += f"""
{type_name} Skills:
{'-' * (len(type_name) + 8)}
Success Rate: {stats['success_rate']:.2%}
Duration Statistics:
  Mean:     {stats['duration_stats']['mean']:.2f}ms
  Median:   {stats['duration_stats']['median']:.2f}ms
  Std Dev:  {stats['duration_stats']['std_dev']:.2f}ms
  Min:      {stats['duration_stats']['min']:.2f}ms
  Max:      {stats['duration_stats']['max']:.2f}ms
  95th %:   {stats['duration_stats']['p95']:.2f}ms
  99th %:   {stats['duration_stats']['p99']:.2f}ms

"""
        
        # Add comparison insights
        fp_mean = analysis["1p"]["duration_stats"]["mean"]
        mcp_mean = analysis["mcp"]["duration_stats"]["mean"]
        performance_ratio = mcp_mean / fp_mean
        
        fp_success = analysis["1p"]["success_rate"]
        mcp_success = analysis["mcp"]["success_rate"]
        
        report += f"""
Comparison Insights:
===================
Performance Ratio: MCP skills are {performance_ratio:.1f}x slower on average
Reliability Gap:   1p skills are {(fp_success - mcp_success) * 100:.1f}% more reliable
Variability:       MCP skills have {analysis['mcp']['duration_stats']['std_dev'] / analysis['1p']['duration_stats']['std_dev']:.1f}x more variable performance

Recommendations:
===============
"""
        
        if performance_ratio > 3:
            report += "- Consider using 1p skills for time-critical operations\n"
        
        if fp_success - mcp_success > 0.02:
            report += "- Implement fallback mechanisms for MCP skills\n"
        
        if analysis['mcp']['duration_stats']['std_dev'] > 500:
            report += "- Monitor MCP skill performance and implement timeout strategies\n"
        
        report += "- Use MCP skills for specialized functionality that justifies the performance trade-off\n"
        
        return report
    
    def simulate_monitoring_alerts(self) -> list:
        """Simulate monitoring alerts based on recent performance."""
        alerts = []
        stats = self.tracker.get_usage_stats(days=1)
        
        if stats["total_usages"] > 0:
            # Check success rate
            if stats["success_rate"] < 0.9:
                alerts.append({
                    "type": "SUCCESS_RATE_LOW",
                    "message": f"Overall success rate dropped to {stats['success_rate']:.2%}",
                    "severity": "WARNING"
                })
            
            # Check average duration
            if stats["avg_duration_ms"] > 1000:
                alerts.append({
                    "type": "HIGH_LATENCY", 
                    "message": f"Average duration increased to {stats['avg_duration_ms']:.0f}ms",
                    "severity": "INFO"
                })
            
            # Check for skill-specific issues
            for skill_name, skill_data in stats["skills_breakdown"].items():
                if skill_data["success_rate"] < 0.8:
                    alerts.append({
                        "type": "SKILL_DEGRADED",
                        "message": f"Skill '{skill_name}' success rate: {skill_data['success_rate']:.2%}",
                        "severity": "CRITICAL"
                    })
        
        return alerts


def run_advanced_example():
    """Run the advanced performance analysis example."""
    print("🚀 Starting Advanced Performance Analysis Example")
    print("=" * 60)
    
    # Initialize tracker and analyzer
    tracker = SkillsTracker()
    analyzer = PerformanceAnalyzer(tracker)
    
    # Run performance benchmark
    results = analyzer.benchmark_skill_types(iterations=30)
    
    # Analyze results
    print("\n📊 Analyzing benchmark results...")
    analysis = analyzer.analyze_benchmark_results(results)
    
    # Generate detailed report
    print("\n📈 Performance Analysis Report")
    print("=" * 60)
    report = analyzer.generate_comparison_report(analysis)
    print(report)
    
    # Simulate some real-world usage patterns
    print("\n🌍 Simulating real-world usage patterns...")
    print("-" * 50)
    
    # Simulate different usage scenarios
    scenarios = [
        ("Heavy 1p usage", 0.8, 0.2),  # 80% 1p, 20% MCP
        ("Balanced usage", 0.5, 0.5),   # 50% 1p, 50% MCP
        ("MCP-heavy usage", 0.3, 0.7),  # 30% 1p, 70% MCP
    ]
    
    for scenario_name, fp_prob, mcp_prob in scenarios:
        print(f"\n📋 Scenario: {scenario_name}")
        
        for _ in range(20):
            if random.random() < fp_prob:
                duration = random.gauss(100, 30)
                success = random.random() > 0.01
                tracker.record_usage(
                    skill_name=f"scenario_1p_{scenario_name.replace(' ', '_')}",
                    skill_type=SkillType.FIRST_PARTY,
                    duration_ms=max(50, duration),
                    success=success,
                    input_size=random.randint(500, 2000),
                    output_size=random.randint(1000, 4000)
                )
            
            if random.random() < mcp_prob:
                duration = random.gauss(500, 200)
                success = random.random() > 0.05
                tracker.record_usage(
                    skill_name=f"scenario_mcp_{scenario_name.replace(' ', '_')}",
                    skill_type=SkillType.MCP,
                    duration_ms=max(100, duration),
                    success=success,
                    input_size=random.randint(1000, 5000),
                    output_size=random.randint(2000, 10000)
                )
    
    # Check for alerts
    print("\n🚨 Monitoring Alert Simulation")
    print("=" * 40)
    alerts = analyzer.simulate_monitoring_alerts()
    
    if alerts:
        for alert in alerts:
            severity_emoji = {"INFO": "ℹ️", "WARNING": "⚠️", "CRITICAL": "🚨"}
            emoji = severity_emoji.get(alert["severity"], "📢")
            print(f"{emoji} [{alert['severity']}] {alert['type']}: {alert['message']}")
    else:
        print("✅ No alerts detected - system performing within normal parameters")
    
    # Final comprehensive report
    print("\n📋 Final Comprehensive Report")
    print("=" * 60)
    final_report = tracker.generate_report(days=1)
    print(final_report)
    
    print("\n✨ Advanced analysis completed!")
    print("📁 All data has been saved to 'skills_data.json'")
    print("🔍 You can run additional analysis using the CLI:")
    print("   python skills_tracker.py report --days 1")


if __name__ == "__main__":
    run_advanced_example()