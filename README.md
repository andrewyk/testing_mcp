# testing_mcp
Testing repository for MCP

📐
🔴

## Skills Tracking System

This repository includes a comprehensive system for tracking and comparing **First-Party (1p) Skills** vs **MCP (Model Context Protocol) Skills**.

### 🎯 Overview

The skills tracking system provides:
- **Usage Monitoring**: Track how often different types of skills are used
- **Performance Comparison**: Compare latency, success rates, and efficiency between 1p and MCP skills
- **Analytics & Reporting**: Generate detailed reports and insights
- **Real-time Dashboard**: Interactive CLI dashboard for monitoring
- **Historical Trends**: Track performance over time

### 🚀 Quick Start

1. **Run the basic example**:
   ```bash
   python examples/basic_usage.py
   ```

2. **Start the interactive dashboard**:
   ```bash
   python skills_dashboard.py
   ```

3. **Use the CLI directly**:
   ```bash
   # Record a skill usage
   python skills_tracker.py record --skill-name "file_operations" --skill-type "1p" --duration 150 --success
   
   # Generate a report
   python skills_tracker.py report --days 7
   
   # Get statistics
   python skills_tracker.py stats --days 1
   ```

### 📊 What are 1p vs MCP Skills?

- **First-Party (1p) Skills**: Built-in capabilities native to the AI system
  - Fast, predictable performance
  - High reliability (99%+ success rate)
  - No external dependencies
  - Examples: file operations, text processing, data analysis

- **MCP Skills**: External capabilities via Model Context Protocol
  - Access to specialized external tools and data
  - Variable performance (depends on external systems)
  - Highly extensible
  - Examples: database queries, cloud services, enterprise integrations

### 📁 Project Structure

```
├── skills_tracker.py          # Core tracking system
├── skills_dashboard.py        # Interactive CLI dashboard
├── config/
│   └── skills_config.json     # Configuration settings
├── docs/
│   └── skills-comparison.md   # Comprehensive documentation
├── examples/
│   ├── basic_usage.py         # Basic usage examples
│   └── advanced_analysis.py   # Advanced performance analysis
└── skills_data.json          # Usage data storage (auto-generated)
```

### 🔧 Features

- **Automatic Data Collection**: Records skill usage with timestamps, duration, success rates
- **Performance Metrics**: Tracks latency, throughput, error rates
- **Comparison Analytics**: Side-by-side comparison of 1p vs MCP performance
- **Alerting System**: Monitors for performance degradation and failures
- **Historical Analysis**: Track trends over different time periods
- **Extensible Configuration**: Customize thresholds, retention, and monitoring settings

### 📈 Example Usage

```python
from skills_tracker import SkillsTracker, SkillType

# Initialize tracker
tracker = SkillsTracker()

# Record 1p skill usage
tracker.record_usage(
    skill_name="text_processing",
    skill_type=SkillType.FIRST_PARTY,
    duration_ms=120,
    success=True,
    input_size=500,
    output_size=1200
)

# Record MCP skill usage
tracker.record_usage(
    skill_name="database_query",
    skill_type=SkillType.MCP,
    duration_ms=450,
    success=True,
    input_size=200,
    output_size=5000
)

# Generate report
report = tracker.generate_report(days=7)
print(report)
```

### 📚 Documentation

- **[Complete Skills Comparison Guide](docs/skills-comparison.md)** - Detailed documentation on 1p vs MCP skills
- **[Basic Usage Examples](examples/basic_usage.py)** - Simple examples to get started
- **[Advanced Analysis](examples/advanced_analysis.py)** - Performance benchmarking and advanced features
- **[Configuration Reference](config/skills_config.json)** - Customize tracking behavior

### 🎛️ Dashboard Features

The interactive dashboard (`skills_dashboard.py`) provides:
- Live statistics and real-time monitoring
- Performance comparison charts
- Top skills ranking
- Historical trend analysis
- Alert monitoring
- Test data generation

### 🔍 Key Insights

The tracking system helps answer questions like:
- Which skill type is more reliable for different use cases?
- What's the performance trade-off between 1p and MCP skills?
- How has skill usage patterns changed over time?
- Which specific skills are causing performance bottlenecks?
- When should you choose 1p vs MCP skills?

---

For detailed documentation and advanced usage, see the [skills comparison guide](docs/skills-comparison.md).
