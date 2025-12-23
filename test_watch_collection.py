#!/usr/bin/env python3
"""
Unit tests for the watch collection system.
"""

import unittest
import os
import tempfile
from datetime import datetime
from watch import Watch
from watch_collection import WatchCollection


class TestWatch(unittest.TestCase):
    """Test cases for the Watch class."""
    
    def test_valid_watch_creation(self):
        """Test creating a valid watch."""
        watch = Watch("Rolex", "Submariner", 2020, "excellent")
        self.assertEqual(watch.brand, "Rolex")
        self.assertEqual(watch.model, "Submariner")
        self.assertEqual(watch.year, 2020)
        self.assertEqual(watch.condition, "excellent")
        self.assertIsInstance(watch.date_added, datetime)
    
    def test_watch_with_all_fields(self):
        """Test creating a watch with all optional fields."""
        watch = Watch(
            "Omega", "Speedmaster", 1995, "very_good",
            movement_type="Manual", case_material="Steel",
            price_paid=3200.00, notes="Moon watch"
        )
        self.assertEqual(watch.movement_type, "Manual")
        self.assertEqual(watch.case_material, "Steel")
        self.assertEqual(watch.price_paid, 3200.00)
        self.assertEqual(watch.notes, "Moon watch")
    
    def test_invalid_brand(self):
        """Test validation of brand field."""
        with self.assertRaises(ValueError):
            Watch("", "Model", 2020, "good")
        with self.assertRaises(ValueError):
            Watch("   ", "Model", 2020, "good")
    
    def test_invalid_model(self):
        """Test validation of model field."""
        with self.assertRaises(ValueError):
            Watch("Brand", "", 2020, "good")
        with self.assertRaises(ValueError):
            Watch("Brand", "   ", 2020, "good")
    
    def test_invalid_year(self):
        """Test validation of year field."""
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 1799, "good")  # Too old
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 2100, "good")  # Future year
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", "2020", "good")  # String instead of int
    
    def test_invalid_condition(self):
        """Test validation of condition field."""
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 2020, "unknown")
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 2020, "")
    
    def test_invalid_price(self):
        """Test validation of price field."""
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 2020, "good", price_paid=-100)
        with self.assertRaises(ValueError):
            Watch("Brand", "Model", 2020, "good", price_paid="expensive")
    
    def test_condition_case_insensitive(self):
        """Test that condition is case insensitive."""
        watch1 = Watch("Brand", "Model", 2020, "EXCELLENT")
        watch2 = Watch("Brand", "Model", 2020, "Excellent")
        watch3 = Watch("Brand", "Model", 2020, "excellent")
        
        self.assertEqual(watch1.condition, "excellent")
        self.assertEqual(watch2.condition, "excellent")
        self.assertEqual(watch3.condition, "excellent")
    
    def test_to_dict_and_from_dict(self):
        """Test dictionary serialization and deserialization."""
        original = Watch(
            "Seiko", "SKX007", 2018, "good",
            movement_type="Automatic", case_material="Steel",
            price_paid=150.00, notes="Dive watch"
        )
        
        watch_dict = original.to_dict()
        restored = Watch.from_dict(watch_dict)
        
        self.assertEqual(original.brand, restored.brand)
        self.assertEqual(original.model, restored.model)
        self.assertEqual(original.year, restored.year)
        self.assertEqual(original.condition, restored.condition)
        self.assertEqual(original.movement_type, restored.movement_type)
        self.assertEqual(original.case_material, restored.case_material)
        self.assertEqual(original.price_paid, restored.price_paid)
        self.assertEqual(original.notes, restored.notes)
    
    def test_string_representation(self):
        """Test string representation of watch."""
        watch1 = Watch("Rolex", "Submariner", 2020, "excellent")
        watch2 = Watch("Omega", "Speedmaster", 1995, "very_good", price_paid=3200.00)
        
        str1 = str(watch1)
        str2 = str(watch2)
        
        self.assertIn("Rolex", str1)
        self.assertIn("Submariner", str1)
        self.assertIn("2020", str1)
        self.assertIn("Excellent", str1)
        
        self.assertIn("Omega", str2)
        self.assertIn("$3200.00", str2)


class TestWatchCollection(unittest.TestCase):
    """Test cases for the WatchCollection class."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a temporary file for testing
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
        self.temp_file.close()
        self.collection = WatchCollection(self.temp_file.name)
        
        # Sample watches for testing
        self.watch1 = Watch("Rolex", "Submariner", 2020, "excellent", price_paid=8500.00)
        self.watch2 = Watch("Omega", "Speedmaster", 1995, "very_good", price_paid=3200.00)
        self.watch3 = Watch("Seiko", "SKX007", 2018, "good", price_paid=150.00)
    
    def tearDown(self):
        """Clean up test fixtures."""
        try:
            os.unlink(self.temp_file.name)
        except FileNotFoundError:
            pass
    
    def test_add_watch(self):
        """Test adding watches to collection."""
        self.collection.add_watch(self.watch1)
        self.assertEqual(len(self.collection), 1)
        
        self.collection.add_watch(self.watch2)
        self.assertEqual(len(self.collection), 2)
    
    def test_add_duplicate_watch(self):
        """Test that adding duplicate watches raises an error."""
        self.collection.add_watch(self.watch1)
        
        # Try to add the same watch again
        duplicate = Watch("Rolex", "Submariner", 2020, "good")
        with self.assertRaises(ValueError):
            self.collection.add_watch(duplicate)
    
    def test_remove_watch(self):
        """Test removing watches from collection."""
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        
        removed = self.collection.remove_watch(0)
        self.assertEqual(removed, self.watch1)
        self.assertEqual(len(self.collection), 1)
    
    def test_remove_invalid_index(self):
        """Test removing watch with invalid index."""
        self.collection.add_watch(self.watch1)
        
        with self.assertRaises(IndexError):
            self.collection.remove_watch(1)
        with self.assertRaises(IndexError):
            self.collection.remove_watch(-1)
    
    def test_get_watch(self):
        """Test getting watch by index."""
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        
        retrieved = self.collection.get_watch(1)
        self.assertEqual(retrieved, self.watch2)
    
    def test_list_watches(self):
        """Test listing all watches."""
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        
        watches = self.collection.list_watches()
        self.assertEqual(len(watches), 2)
        self.assertIn(self.watch1, watches)
        self.assertIn(self.watch2, watches)
    
    def test_search_by_brand(self):
        """Test searching watches by brand."""
        self.collection.add_watch(self.watch1)  # Rolex
        self.collection.add_watch(self.watch2)  # Omega
        self.collection.add_watch(self.watch3)  # Seiko
        
        rolex_watches = self.collection.search_watches(brand="Rolex")
        self.assertEqual(len(rolex_watches), 1)
        self.assertEqual(rolex_watches[0], self.watch1)
        
        # Test partial match
        omega_watches = self.collection.search_watches(brand="meg")  # Should match Omega only
        self.assertEqual(len(omega_watches), 1)
        self.assertEqual(omega_watches[0], self.watch2)
    
    def test_search_by_year(self):
        """Test searching watches by year."""
        self.collection.add_watch(self.watch1)  # 2020
        self.collection.add_watch(self.watch2)  # 1995
        self.collection.add_watch(self.watch3)  # 2018
        
        recent_watches = self.collection.search_watches(year=2020)
        self.assertEqual(len(recent_watches), 1)
        self.assertEqual(recent_watches[0], self.watch1)
    
    def test_search_by_price_range(self):
        """Test searching watches by price range."""
        self.collection.add_watch(self.watch1)  # $8500
        self.collection.add_watch(self.watch2)  # $3200
        self.collection.add_watch(self.watch3)  # $150
        
        expensive_watches = self.collection.search_watches(min_price=3000)
        self.assertEqual(len(expensive_watches), 2)
        
        affordable_watches = self.collection.search_watches(max_price=200)
        self.assertEqual(len(affordable_watches), 1)
        self.assertEqual(affordable_watches[0], self.watch3)
        
        mid_range = self.collection.search_watches(min_price=1000, max_price=5000)
        self.assertEqual(len(mid_range), 1)
        self.assertEqual(mid_range[0], self.watch2)
    
    def test_collection_stats(self):
        """Test collection statistics."""
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        self.collection.add_watch(self.watch3)
        
        stats = self.collection.get_collection_stats()
        
        self.assertEqual(stats['total_watches'], 3)
        self.assertEqual(stats['brands']['Rolex'], 1)
        self.assertEqual(stats['brands']['Omega'], 1)
        self.assertEqual(stats['brands']['Seiko'], 1)
        self.assertAlmostEqual(stats['average_year'], (2020 + 1995 + 2018) / 3, places=1)
        self.assertEqual(stats['total_value'], 8500.00 + 3200.00 + 150.00)
    
    def test_persistence(self):
        """Test that collection persists to file."""
        # Add watches to collection
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        
        # Create new collection from same file
        new_collection = WatchCollection(self.temp_file.name)
        
        self.assertEqual(len(new_collection), 2)
        watches = new_collection.list_watches()
        
        # Check that watches were loaded correctly
        loaded_watch1 = next(w for w in watches if w.brand == "Rolex")
        self.assertEqual(loaded_watch1.model, "Submariner")
        self.assertEqual(loaded_watch1.year, 2020)
    
    def test_clear_collection(self):
        """Test clearing the collection."""
        self.collection.add_watch(self.watch1)
        self.collection.add_watch(self.watch2)
        
        self.collection.clear_collection()
        self.assertEqual(len(self.collection), 0)


def run_tests():
    """Run all tests."""
    unittest.main(verbosity=2)


if __name__ == "__main__":
    run_tests()