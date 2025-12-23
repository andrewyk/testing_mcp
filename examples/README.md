# Skills Tracking Examples

This directory contains examples demonstrating how to use the skills tracking system.

## Examples

### 1. Basic Usage (`basic_usage.py`)
**Purpose**: Introduction to basic tracking functionality
**What it demonstrates**:
- Recording 1p and MCP skill usage
- Generating basic reports
- Understanding performance differences
- Simple usage patterns

**Run it**:
```bash
python examples/basic_usage.py
```

**What you'll see**:
- Simulated skill executions with realistic timing
- Performance comparison between 1p and MCP skills
- Usage statistics and breakdown by skill type
- Generated report showing key metrics

### 2. Advanced Analysis (`advanced_analysis.py`)
**Purpose**: In-depth performance analysis and benchmarking
**What it demonstrates**:
- Performance benchmarking with statistical analysis
- Advanced reporting with percentiles and trend analysis
- Alert simulation based on performance thresholds
- Multiple usage scenarios (heavy 1p, balanced, MCP-heavy)

**Run it**:
```bash
python examples/advanced_analysis.py
```

**What you'll see**:
- Controlled benchmark comparing 1p vs MCP performance
- Statistical analysis with mean, median, standard deviation, percentiles
- Performance insights and recommendations
- Simulated monitoring alerts
- Comprehensive analytics

## Key Insights from Examples

### Performance Patterns
- **1p Skills**: Typically 50-200ms response time, 98-99% success rate
- **MCP Skills**: Typically 200-800ms+ response time, 95-98% success rate
- **Variability**: MCP skills show higher performance variance due to external dependencies

### Usage Recommendations
- Use **1p skills** for:
  - Time-critical operations
  - High-reliability requirements
  - Simple, built-in functionality

- Use **MCP skills** for:
  - Specialized external functionality
  - Database and API integrations
  - When extensibility is important

### Monitoring Best Practices
- Track both success rates and latency
- Set up alerts for performance degradation
- Monitor trends over time
- Compare relative performance of skill types

## Extending the Examples

You can modify these examples to:
1. **Add your own skill types**: Update the skill lists and add custom metadata
2. **Customize performance patterns**: Adjust timing and success rate distributions
3. **Add new metrics**: Track additional performance indicators
4. **Integrate with your systems**: Connect to actual 1p and MCP implementations

## Example Output

Here's what typical output looks like:

```
🚀 Starting Basic Skills Tracking Example
==================================================

📊 Simulating skill usage patterns...
----------------------------------------

Iteration 1/10:
🔧 Executing 1p skill: text_processing
   ✅ Completed in 129.4ms (Success: True)
🌐 Executing MCP skill: database_query
   ✅ Completed in 445.2ms (Success: True)

...

📈 Generating Usage Report
==================================================

Skills Usage Report (Last 1 days)
=======================================

Overall Statistics:
- Total Usages: 13
- 1p Skills: 8 (61.5%)
- MCP Skills: 5 (38.5%)
- Overall Success Rate: 100.00%
- Average Duration: 625.65ms

Performance Comparison:
1P Skills:
- Count: 8
- Success Rate: 100.00%
- Avg Duration: 108.51ms

MCP Skills:
- Count: 5
- Success Rate: 100.00%
- Avg Duration: 1453.07ms
```

This shows the clear performance difference between skill types and provides actionable insights for optimization.