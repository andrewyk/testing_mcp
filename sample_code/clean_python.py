"""
Clean Python file for testing bug detection accuracy.
This file should have minimal or no bugs detected.
"""

import os
import sys
from typing import List, Dict, Optional


def calculate_statistics(numbers: List[float]) -> Dict[str, float]:
    """
    Calculate basic statistics for a list of numbers.
    
    Args:
        numbers: List of numeric values
        
    Returns:
        Dictionary containing mean, median, and standard deviation
    """
    if not numbers:
        return {'mean': 0.0, 'median': 0.0, 'std_dev': 0.0}
    
    # Calculate mean
    mean = sum(numbers) / len(numbers)
    
    # Calculate median
    sorted_numbers = sorted(numbers)
    n = len(sorted_numbers)
    if n % 2 == 0:
        median = (sorted_numbers[n//2 - 1] + sorted_numbers[n//2]) / 2
    else:
        median = sorted_numbers[n//2]
    
    # Calculate standard deviation
    variance = sum((x - mean) ** 2 for x in numbers) / len(numbers)
    std_dev = variance ** 0.5
    
    return {
        'mean': mean,
        'median': median,
        'std_dev': std_dev
    }


def read_file_safely(file_path: str) -> Optional[str]:
    """
    Read a file safely with proper error handling.
    
    Args:
        file_path: Path to the file to read
        
    Returns:
        File contents or None if an error occurred
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None
    except PermissionError:
        print(f"Permission denied: {file_path}")
        return None
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None


class DataProcessor:
    """A class for processing data with proper error handling."""
    
    def __init__(self, data: List[Dict[str, any]]):
        """
        Initialize the data processor.
        
        Args:
            data: List of data dictionaries to process
        """
        self.data = data
        self.processed_count = 0
    
    def filter_data(self, key: str, value: any) -> List[Dict[str, any]]:
        """
        Filter data by key-value pair.
        
        Args:
            key: The key to filter by
            value: The value to match
            
        Returns:
            Filtered list of data dictionaries
        """
        return [item for item in self.data if item.get(key) == value]
    
    def process_items(self) -> int:
        """
        Process all items in the data.
        
        Returns:
            Number of successfully processed items
        """
        for item in self.data:
            if self._validate_item(item):
                self._process_item(item)
                self.processed_count += 1
        
        return self.processed_count
    
    def _validate_item(self, item: Dict[str, any]) -> bool:
        """Validate that an item has required fields."""
        required_fields = ['id', 'name']
        return all(field in item for field in required_fields)
    
    def _process_item(self, item: Dict[str, any]) -> None:
        """Process a single item."""
        # Processing logic would go here
        pass


def main():
    """Main function demonstrating proper structure."""
    # Sample data
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    stats = calculate_statistics(numbers)
    
    print("Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value:.2f}")
    
    # Test file reading
    content = read_file_safely("example.txt")
    if content is not None:
        print(f"File content length: {len(content)}")
    
    # Test data processing
    sample_data = [
        {'id': 1, 'name': 'Item 1', 'value': 100},
        {'id': 2, 'name': 'Item 2', 'value': 200},
    ]
    
    processor = DataProcessor(sample_data)
    processed = processor.process_items()
    print(f"Processed {processed} items")


if __name__ == "__main__":
    main()