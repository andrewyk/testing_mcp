"""
Watch collection management system.
"""

import json
import os
from typing import List, Dict, Any, Optional, Callable
from watch import Watch


class WatchCollection:
    """Manages a collection of watches with CRUD operations and search functionality."""
    
    def __init__(self, storage_file: str = "watch_collection.json"):
        """
        Initialize the watch collection.
        
        Args:
            storage_file: Path to the JSON file for persistent storage
        """
        self.storage_file = storage_file
        self.watches: List[Watch] = []
        self.load_collection()
    
    def add_watch(self, watch: Watch) -> None:
        """
        Add a watch to the collection.
        
        Args:
            watch: Watch object to add
        """
        if not isinstance(watch, Watch):
            raise TypeError("Only Watch objects can be added to the collection")
        
        # Check for duplicates (same brand, model, and year)
        for existing_watch in self.watches:
            if (existing_watch.brand.lower() == watch.brand.lower() and
                existing_watch.model.lower() == watch.model.lower() and
                existing_watch.year == watch.year):
                raise ValueError(f"Watch {watch.brand} {watch.model} ({watch.year}) already exists in collection")
        
        self.watches.append(watch)
        self.save_collection()
    
    def remove_watch(self, index: int) -> Watch:
        """
        Remove a watch from the collection by index.
        
        Args:
            index: Index of the watch to remove
            
        Returns:
            The removed watch
            
        Raises:
            IndexError: If index is out of range
        """
        if not 0 <= index < len(self.watches):
            raise IndexError(f"Index {index} is out of range (0-{len(self.watches)-1})")
        
        removed_watch = self.watches.pop(index)
        self.save_collection()
        return removed_watch
    
    def get_watch(self, index: int) -> Watch:
        """
        Get a watch by index.
        
        Args:
            index: Index of the watch to retrieve
            
        Returns:
            The watch at the specified index
            
        Raises:
            IndexError: If index is out of range
        """
        if not 0 <= index < len(self.watches):
            raise IndexError(f"Index {index} is out of range (0-{len(self.watches)-1})")
        return self.watches[index]
    
    def list_watches(self) -> List[Watch]:
        """
        Get all watches in the collection.
        
        Returns:
            List of all watches
        """
        return self.watches.copy()
    
    def search_watches(
        self,
        brand: Optional[str] = None,
        model: Optional[str] = None,
        year: Optional[int] = None,
        condition: Optional[str] = None,
        movement_type: Optional[str] = None,
        case_material: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> List[Watch]:
        """
        Search for watches based on criteria.
        
        Args:
            brand: Brand name to search for (case-insensitive partial match)
            model: Model name to search for (case-insensitive partial match)
            year: Exact year to match
            condition: Exact condition to match
            movement_type: Movement type to search for (case-insensitive partial match)
            case_material: Case material to search for (case-insensitive partial match)
            min_price: Minimum price (inclusive)
            max_price: Maximum price (inclusive)
            
        Returns:
            List of watches matching the criteria
        """
        results = []
        
        for watch in self.watches:
            # Check brand
            if brand and brand.lower() not in watch.brand.lower():
                continue
            
            # Check model
            if model and model.lower() not in watch.model.lower():
                continue
            
            # Check year
            if year is not None and watch.year != year:
                continue
            
            # Check condition
            if condition and watch.condition.lower() != condition.lower():
                continue
            
            # Check movement type
            if movement_type and (not watch.movement_type or 
                                movement_type.lower() not in watch.movement_type.lower()):
                continue
            
            # Check case material
            if case_material and (not watch.case_material or 
                                case_material.lower() not in watch.case_material.lower()):
                continue
            
            # Check price range
            if watch.price_paid is not None:
                if min_price is not None and watch.price_paid < min_price:
                    continue
                if max_price is not None and watch.price_paid > max_price:
                    continue
            elif min_price is not None or max_price is not None:
                # Skip watches without price if price filter is specified
                continue
            
            results.append(watch)
        
        return results
    
    def filter_watches(self, filter_func: Callable[[Watch], bool]) -> List[Watch]:
        """
        Filter watches using a custom function.
        
        Args:
            filter_func: Function that takes a Watch and returns True if it should be included
            
        Returns:
            List of watches that match the filter
        """
        return [watch for watch in self.watches if filter_func(watch)]
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the collection.
        
        Returns:
            Dictionary with collection statistics
        """
        if not self.watches:
            return {
                'total_watches': 0,
                'brands': {},
                'conditions': {},
                'average_year': None,
                'total_value': None,
                'average_value': None
            }
        
        # Count by brand
        brands = {}
        for watch in self.watches:
            brands[watch.brand] = brands.get(watch.brand, 0) + 1
        
        # Count by condition
        conditions = {}
        for watch in self.watches:
            conditions[watch.condition] = conditions.get(watch.condition, 0) + 1
        
        # Calculate average year
        total_years = sum(watch.year for watch in self.watches)
        average_year = total_years / len(self.watches)
        
        # Calculate total and average value
        watches_with_price = [w for w in self.watches if w.price_paid is not None]
        total_value = sum(w.price_paid for w in watches_with_price) if watches_with_price else None
        average_value = total_value / len(watches_with_price) if watches_with_price else None
        
        return {
            'total_watches': len(self.watches),
            'brands': brands,
            'conditions': conditions,
            'average_year': round(average_year, 1),
            'total_value': round(total_value, 2) if total_value else None,
            'average_value': round(average_value, 2) if average_value else None,
            'watches_with_price': len(watches_with_price)
        }
    
    def save_collection(self) -> None:
        """Save the collection to a JSON file."""
        try:
            data = [watch.to_dict() for watch in self.watches]
            with open(self.storage_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            raise IOError(f"Failed to save collection: {e}")
    
    def load_collection(self) -> None:
        """Load the collection from a JSON file."""
        if not os.path.exists(self.storage_file):
            return  # Start with empty collection
        
        try:
            with open(self.storage_file, 'r') as f:
                data = json.load(f)
            
            self.watches = []
            for watch_data in data:
                try:
                    watch = Watch.from_dict(watch_data)
                    self.watches.append(watch)
                except Exception as e:
                    print(f"Warning: Failed to load watch {watch_data}: {e}")
        except Exception as e:
            print(f"Warning: Failed to load collection file: {e}")
            self.watches = []
    
    def clear_collection(self) -> None:
        """Remove all watches from the collection."""
        self.watches = []
        self.save_collection()
    
    def __len__(self) -> int:
        """Return the number of watches in the collection."""
        return len(self.watches)
    
    def __iter__(self):
        """Make the collection iterable."""
        return iter(self.watches)
    
    def __str__(self) -> str:
        """String representation of the collection."""
        if not self.watches:
            return "Empty watch collection"
        
        lines = [f"Watch Collection ({len(self.watches)} watches):"]
        for i, watch in enumerate(self.watches):
            lines.append(f"  {i}: {watch}")
        return "\n".join(lines)