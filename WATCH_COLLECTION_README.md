# Watch Collection System

A comprehensive watch collection management system for organizing and tracking watch collections. This system provides data structures, validation, search capabilities, and a command-line interface for managing your watch collection.

## Features

### Core Functionality
- ✅ Store detailed watch information (brand, model, year, condition, etc.)
- ✅ Add new watches with validation
- ✅ Remove watches from collection
- ✅ List and display all watches
- ✅ Search and filter watches by multiple criteria
- ✅ Collection statistics and analytics
- ✅ Data persistence with JSON storage
- ✅ Interactive command-line interface

### Watch Properties
Each watch in the collection can store:
- **Brand** (required) - Watch manufacturer
- **Model** (required) - Specific watch model
- **Year** (required) - Year of manufacture (1800-current year)
- **Condition** (required) - mint, excellent, very_good, good, fair, poor
- **Movement Type** (optional) - e.g., Automatic, Manual, Quartz
- **Case Material** (optional) - e.g., Steel, Gold, Titanium
- **Price Paid** (optional) - Purchase price in dollars
- **Notes** (optional) - Additional comments or descriptions
- **Date Added** (automatic) - When the watch was added to collection

## Installation and Setup

No special installation required! The system uses Python 3 standard library only.

### Requirements
- Python 3.7 or higher
- No external dependencies

### Files
- `watch.py` - Watch data structure and validation
- `watch_collection.py` - Collection management system
- `watch_cli.py` - Interactive command-line interface
- `test_watch_collection.py` - Unit tests
- `watch_collection.json` - Data storage (created automatically)

## Usage

### Command-Line Interface (Recommended)

Start the interactive CLI:
```bash
python3 watch_cli.py
```

Or specify a custom storage file:
```bash
python3 watch_cli.py my_collection.json
```

#### CLI Commands
- `help` - Show available commands
- `add` - Add a new watch (interactive prompts)
- `list` - Display all watches in the collection
- `remove` - Remove a watch by index
- `search` - Search watches by criteria
- `stats` - Show collection statistics
- `example` - Add sample watch data for testing
- `clear` - Remove all watches from collection
- `quit` - Exit the program

#### Example CLI Session
```
🔴 Welcome to the Watch Collection Manager!

watch-collection> example
✅ Added 5 example watches to the collection

watch-collection> list
📋 Watch Collection (5 watches):
  0: Rolex Submariner (2020) - Excellent ($8500.00) | Automatic | Steel
  1: Omega Speedmaster Professional (1995) - Very_Good ($3200.00) | Manual | Steel
  ...

watch-collection> search
🔍 Search watches (press Enter to skip any field)
Brand (partial match): rolex
Condition (exact match): excellent
🎯 Found 1 matching watches:
  [0]: Rolex Submariner (2020) - Excellent ($8500.00) | Automatic | Steel

watch-collection> stats
📊 Collection Statistics:
  Total watches: 5
  Average year: 2013.4
  Total value: $36895.00 (5 watches)
  Average value: $7379.00
```

### Programmatic Usage

You can also use the classes directly in your Python code:

```python
from watch import Watch
from watch_collection import WatchCollection

# Create a new collection
collection = WatchCollection("my_watches.json")

# Add watches
submariner = Watch(
    brand="Rolex",
    model="Submariner",
    year=2020,
    condition="excellent",
    movement_type="Automatic",
    case_material="Steel",
    price_paid=8500.00,
    notes="Black dial, ceramic bezel"
)
collection.add_watch(submariner)

# Search watches
steel_watches = collection.search_watches(case_material="steel")
expensive_watches = collection.search_watches(min_price=5000)

# Get statistics
stats = collection.get_collection_stats()
print(f"Total value: ${stats['total_value']}")
```

## Search and Filtering

The system supports flexible search across multiple criteria:

### Search Criteria
- **Brand** - Partial, case-insensitive matching
- **Model** - Partial, case-insensitive matching  
- **Year** - Exact year matching
- **Condition** - Exact condition matching
- **Movement Type** - Partial, case-insensitive matching
- **Case Material** - Partial, case-insensitive matching
- **Price Range** - Minimum and/or maximum price filters

### Search Examples
```python
# Find all Rolex watches
rolex_watches = collection.search_watches(brand="rolex")

# Find watches from 2020
recent_watches = collection.search_watches(year=2020)

# Find expensive watches in excellent condition
luxury_watches = collection.search_watches(
    condition="excellent", 
    min_price=10000
)

# Find automatic steel watches under $1000
affordable_auto = collection.search_watches(
    movement_type="auto",
    case_material="steel", 
    max_price=1000
)
```

## Data Validation

The system includes comprehensive validation:

### Watch Validation
- **Brand/Model**: Must be non-empty strings
- **Year**: Must be integer between 1800 and current year
- **Condition**: Must be one of the valid conditions
- **Price**: Must be non-negative number
- **Duplicates**: Prevents adding identical watches (same brand, model, year)

### Error Handling
```python
try:
    invalid_watch = Watch("", "Model", 2020, "excellent")
except ValueError as e:
    print(f"Validation error: {e}")
    # Output: "Brand must be a non-empty string"

try:
    old_watch = Watch("Brand", "Model", 1700, "excellent")  
except ValueError as e:
    print(f"Validation error: {e}")
    # Output: "Year must be between 1800 and 2024"
```

## Testing

Run the comprehensive test suite:
```bash
python3 test_watch_collection.py
```

The tests cover:
- Watch creation and validation
- Collection management (add, remove, search)
- Data persistence
- Search functionality
- Statistics calculation
- Error handling

## Data Storage

### JSON Format
Watches are stored in JSON format for easy portability:
```json
[
  {
    "brand": "Rolex",
    "model": "Submariner", 
    "year": 2020,
    "condition": "excellent",
    "movement_type": "Automatic",
    "case_material": "Steel",
    "price_paid": 8500.0,
    "notes": "Black dial, ceramic bezel",
    "date_added": "2024-08-08T20:30:45.123456"
  }
]
```

### Backup and Migration
Simply copy the JSON file to backup your collection:
```bash
cp watch_collection.json backup_collection_2024.json
```

## Collection Statistics

The system provides detailed analytics:
- Total number of watches
- Brand distribution
- Condition breakdown  
- Average manufacturing year
- Total collection value
- Average watch value
- Number of watches with price data

## Example Data

The system includes sample data for testing:
- Rolex Submariner (luxury dive watch)
- Omega Speedmaster Professional (moon watch)
- Seiko SKX007 (affordable dive watch)  
- Patek Philippe Calatrava (dress watch)
- Casio G-Shock (digital sports watch)

## Best Practices

### Data Entry
- Use consistent brand/model naming (e.g., "Rolex" not "ROLEX")
- Enter realistic years (no future dates)
- Use standard condition terms
- Add detailed notes for unique features
- Include purchase price for value tracking

### Organization
- Regular backups of your JSON file
- Consistent data entry standards
- Use search to find similar watches before adding
- Review collection statistics periodically

## Troubleshooting

### Common Issues
1. **"Watch already exists"** - Check for duplicate brand/model/year
2. **"Invalid year"** - Ensure year is between 1800 and current year
3. **"Invalid condition"** - Use one of: mint, excellent, very_good, good, fair, poor
4. **File permission errors** - Ensure write access to storage directory

### Getting Help
- Run tests to verify system integrity
- Check input validation requirements
- Use the CLI `help` command for available operations
- Review example data for proper formatting

## Future Enhancements

Potential improvements for the system:
- Web interface
- Image storage and display
- Import/export to CSV
- Watch value tracking over time
- Collection insurance calculations
- Service history tracking
- Watch recommendation system

## License

This is a demonstration project for the testing_mcp repository. Feel free to modify and extend as needed.