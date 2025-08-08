#!/usr/bin/env python3
"""
Basic Example: Recording and Tracking Skill Usage

This example demonstrates how to use the skills tracker to record
usage of both 1p and MCP skills and generate basic reports.
"""

import sys
import os
import time
import random

# Add the parent directory to the path so we can import skills_tracker
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from skills_tracker import SkillsTracker, SkillType


def simulate_1p_skill_usage(tracker: SkillsTracker, skill_name: str) -> float:
    """
    Simulate usage of a first-party skill.
    1p skills typically have faster, more predictable performance.
    """
    print(f"🔧 Executing 1p skill: {skill_name}")
    
    start_time = time.time()
    
    # Simulate some work (1p skills are generally faster)
    duration_ms = random.uniform(50, 200)  # 50-200ms typical for 1p
    time.sleep(duration_ms / 1000)  # Convert to seconds for sleep
    
    # 1p skills have high success rate
    success = random.random() > 0.02  # 98% success rate
    
    # Record the usage
    usage_id = tracker.record_usage(
        skill_name=skill_name,
        skill_type=SkillType.FIRST_PARTY,
        duration_ms=duration_ms,
        success=success,
        input_size=random.randint(100, 1000),
        output_size=random.randint(200, 2000),
        metadata={
            "execution_context": "local",
            "resource_usage": "low"
        }
    )
    
    end_time = time.time()
    actual_duration = (end_time - start_time) * 1000
    
    print(f"   ✅ Completed in {actual_duration:.1f}ms (Success: {success})")
    return actual_duration


def simulate_mcp_skill_usage(tracker: SkillsTracker, skill_name: str) -> float:
    """
    Simulate usage of an MCP skill.
    MCP skills typically have more variable performance due to external dependencies.
    """
    print(f"🌐 Executing MCP skill: {skill_name}")
    
    start_time = time.time()
    
    # Simulate network latency and external system processing
    base_latency = random.uniform(100, 500)  # Network latency
    processing_time = random.uniform(200, 1500)  # External system processing
    duration_ms = base_latency + processing_time
    
    time.sleep(duration_ms / 1000)  # Convert to seconds for sleep
    
    # MCP skills have variable success rates depending on external systems
    success = random.random() > 0.05  # 95% success rate (lower than 1p)
    
    error_message = None
    if not success:
        error_message = random.choice([
            "Connection timeout",
            "External service unavailable", 
            "Authentication failed",
            "Rate limit exceeded"
        ])
    
    # Record the usage
    usage_id = tracker.record_usage(
        skill_name=skill_name,
        skill_type=SkillType.MCP,
        duration_ms=duration_ms,
        success=success,
        input_size=random.randint(500, 5000),
        output_size=random.randint(1000, 10000),
        error_message=error_message,
        metadata={
            "execution_context": "external",
            "mcp_server": f"server-{random.randint(1, 3)}",
            "network_latency_ms": base_latency
        }
    )
    
    end_time = time.time()
    actual_duration = (end_time - start_time) * 1000
    
    status = "✅" if success else "❌"
    print(f"   {status} Completed in {actual_duration:.1f}ms (Success: {success})")
    if error_message:
        print(f"   ⚠️  Error: {error_message}")
    
    return actual_duration


def run_basic_example():
    """Run the basic example demonstrating skill tracking."""
    print("🚀 Starting Basic Skills Tracking Example")
    print("=" * 50)
    
    # Initialize the tracker
    tracker = SkillsTracker()
    
    # Define some example skills
    first_party_skills = [
        "file_operations",
        "text_processing", 
        "data_analysis",
        "code_generation"
    ]
    
    mcp_skills = [
        "database_query",
        "external_api_integration",
        "cloud_storage_access",
        "third_party_tools"
    ]
    
    print("\n📊 Simulating skill usage patterns...")
    print("-" * 40)
    
    # Simulate a realistic usage pattern
    for iteration in range(10):
        print(f"\nIteration {iteration + 1}/10:")
        
        # More frequent use of 1p skills (they're built-in and reliable)
        if random.random() > 0.3:  # 70% chance to use 1p skill
            skill = random.choice(first_party_skills)
            simulate_1p_skill_usage(tracker, skill)
        
        # Less frequent but still regular use of MCP skills
        if random.random() > 0.5:  # 50% chance to use MCP skill
            skill = random.choice(mcp_skills)
            simulate_mcp_skill_usage(tracker, skill)
        
        # Small delay between iterations
        time.sleep(0.1)
    
    print("\n" + "=" * 50)
    print("📈 Generating Usage Report")
    print("=" * 50)
    
    # Generate and display a report
    report = tracker.generate_report(days=1)
    print(report)
    
    print("\n" + "=" * 50)
    print("📊 Raw Statistics (JSON)")
    print("=" * 50)
    
    # Show raw statistics
    stats = tracker.get_usage_stats(days=1)
    import json
    print(json.dumps(stats, indent=2))
    
    print("\n✨ Example completed! Check 'skills_data.json' for recorded data.")


if __name__ == "__main__":
    run_basic_example()