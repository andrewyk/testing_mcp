#!/usr/bin/env python3
"""
Command-line interface for the watch collection system.
"""

import sys
from typing import Optional
from watch import Watch
from watch_collection import WatchCollection


class WatchCollectionCLI:
    """Command-line interface for managing a watch collection."""
    
    def __init__(self, storage_file: str = "watch_collection.json"):
        """Initialize the CLI with a watch collection."""
        self.collection = WatchCollection(storage_file)
    
    def run(self):
        """Run the interactive CLI."""
        print("🔴 Welcome to the Watch Collection Manager!")
        print("Type 'help' for available commands or 'quit' to exit.\n")
        
        while True:
            try:
                command = input("watch-collection> ").strip().lower()
                
                if command in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                elif command == 'help':
                    self.show_help()
                elif command == 'add':
                    self.add_watch_interactive()
                elif command == 'list':
                    self.list_watches()
                elif command == 'remove':
                    self.remove_watch_interactive()
                elif command == 'search':
                    self.search_watches_interactive()
                elif command == 'stats':
                    self.show_stats()
                elif command == 'clear':
                    self.clear_collection_interactive()
                elif command == 'example':
                    self.add_example_data()
                elif command == '':
                    continue
                else:
                    print(f"Unknown command: {command}. Type 'help' for available commands.")
            
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def show_help(self):
        """Display help information."""
        print("""
📋 Available Commands:
  help     - Show this help message
  add      - Add a new watch to the collection
  list     - List all watches in the collection
  remove   - Remove a watch from the collection
  search   - Search for watches by criteria
  stats    - Show collection statistics
  clear    - Clear all watches from the collection
  example  - Add example watch data for testing
  quit     - Exit the program
        """)
    
    def add_watch_interactive(self):
        """Interactively add a watch to the collection."""
        try:
            print("\n➕ Adding a new watch")
            brand = input("Brand (required): ").strip()
            model = input("Model (required): ").strip()
            
            # Get year with validation
            while True:
                try:
                    year_str = input("Year (required): ").strip()
                    year = int(year_str)
                    break
                except ValueError:
                    print("❌ Please enter a valid year (number)")
            
            # Get condition with validation
            print(f"Valid conditions: {', '.join(Watch.VALID_CONDITIONS)}")
            condition = input("Condition (required): ").strip()
            
            # Optional fields
            movement_type = input("Movement type (optional): ").strip() or None
            case_material = input("Case material (optional): ").strip() or None
            
            # Get price with validation
            price_paid = None
            price_str = input("Price paid (optional): ").strip()
            if price_str:
                try:
                    price_paid = float(price_str)
                except ValueError:
                    print("⚠️ Invalid price format, skipping price")
            
            notes = input("Notes (optional): ").strip() or None
            
            # Create and add the watch
            watch = Watch(
                brand=brand,
                model=model,
                year=year,
                condition=condition,
                movement_type=movement_type,
                case_material=case_material,
                price_paid=price_paid,
                notes=notes
            )
            
            self.collection.add_watch(watch)
            print(f"✅ Added: {watch}")
            
        except ValueError as e:
            print(f"❌ Validation error: {e}")
        except Exception as e:
            print(f"❌ Error adding watch: {e}")
    
    def list_watches(self):
        """List all watches in the collection."""
        watches = self.collection.list_watches()
        if not watches:
            print("📭 No watches in collection")
            return
        
        print(f"\n📋 Watch Collection ({len(watches)} watches):")
        for i, watch in enumerate(watches):
            movement = f" | {watch.movement_type}" if watch.movement_type else ""
            material = f" | {watch.case_material}" if watch.case_material else ""
            notes = f" | Notes: {watch.notes}" if watch.notes else ""
            print(f"  {i}: {watch}{movement}{material}{notes}")
    
    def remove_watch_interactive(self):
        """Interactively remove a watch from the collection."""
        watches = self.collection.list_watches()
        if not watches:
            print("📭 No watches in collection to remove")
            return
        
        print("\n🗑️ Remove a watch")
        self.list_watches()
        
        try:
            index_str = input("\nEnter index of watch to remove: ").strip()
            index = int(index_str)
            
            removed_watch = self.collection.remove_watch(index)
            print(f"✅ Removed: {removed_watch}")
            
        except ValueError:
            print("❌ Please enter a valid index (number)")
        except IndexError as e:
            print(f"❌ {e}")
        except Exception as e:
            print(f"❌ Error removing watch: {e}")
    
    def search_watches_interactive(self):
        """Interactively search for watches."""
        print("\n🔍 Search watches (press Enter to skip any field)")
        
        brand = input("Brand (partial match): ").strip() or None
        model = input("Model (partial match): ").strip() or None
        
        year = None
        year_str = input("Year (exact match): ").strip()
        if year_str:
            try:
                year = int(year_str)
            except ValueError:
                print("⚠️ Invalid year format, ignoring year filter")
        
        condition = input("Condition (exact match): ").strip() or None
        movement_type = input("Movement type (partial match): ").strip() or None
        case_material = input("Case material (partial match): ").strip() or None
        
        min_price = None
        min_price_str = input("Minimum price: ").strip()
        if min_price_str:
            try:
                min_price = float(min_price_str)
            except ValueError:
                print("⚠️ Invalid minimum price format, ignoring")
        
        max_price = None
        max_price_str = input("Maximum price: ").strip()
        if max_price_str:
            try:
                max_price = float(max_price_str)
            except ValueError:
                print("⚠️ Invalid maximum price format, ignoring")
        
        # Perform search
        results = self.collection.search_watches(
            brand=brand,
            model=model,
            year=year,
            condition=condition,
            movement_type=movement_type,
            case_material=case_material,
            min_price=min_price,
            max_price=max_price
        )
        
        if not results:
            print("📭 No watches found matching your criteria")
            return
        
        print(f"\n🎯 Found {len(results)} matching watches:")
        for i, watch in enumerate(results):
            # Find original index
            original_index = self.collection.list_watches().index(watch)
            movement = f" | {watch.movement_type}" if watch.movement_type else ""
            material = f" | {watch.case_material}" if watch.case_material else ""
            notes = f" | Notes: {watch.notes}" if watch.notes else ""
            print(f"  [{original_index}]: {watch}{movement}{material}{notes}")
    
    def show_stats(self):
        """Show collection statistics."""
        stats = self.collection.get_collection_stats()
        
        if stats['total_watches'] == 0:
            print("📊 Collection is empty")
            return
        
        print(f"\n📊 Collection Statistics:")
        print(f"  Total watches: {stats['total_watches']}")
        print(f"  Average year: {stats['average_year']}")
        
        if stats['total_value']:
            print(f"  Total value: ${stats['total_value']:.2f} ({stats['watches_with_price']} watches)")
            print(f"  Average value: ${stats['average_value']:.2f}")
        
        print(f"\n  Brands:")
        for brand, count in sorted(stats['brands'].items()):
            print(f"    {brand}: {count}")
        
        print(f"\n  Conditions:")
        for condition, count in sorted(stats['conditions'].items()):
            print(f"    {condition.title()}: {count}")
    
    def clear_collection_interactive(self):
        """Interactively clear the collection."""
        if len(self.collection) == 0:
            print("📭 Collection is already empty")
            return
        
        confirm = input(f"❓ Are you sure you want to clear all {len(self.collection)} watches? (yes/no): ").strip().lower()
        if confirm in ['yes', 'y']:
            self.collection.clear_collection()
            print("✅ Collection cleared")
        else:
            print("❌ Clear operation cancelled")
    
    def add_example_data(self):
        """Add example watch data for testing."""
        example_watches = [
            Watch("Rolex", "Submariner", 2020, "excellent", "Automatic", "Steel", 8500.00, "Black dial, ceramic bezel"),
            Watch("Omega", "Speedmaster Professional", 1995, "very_good", "Manual", "Steel", 3200.00, "Moonwatch hesalite crystal"),
            Watch("Seiko", "SKX007", 2018, "good", "Automatic", "Steel", 150.00, "Classic dive watch"),
            Watch("Patek Philippe", "Calatrava", 2015, "mint", "Manual", "Gold", 25000.00, "Dress watch with leather strap"),
            Watch("Casio", "G-Shock DW-5600", 2019, "excellent", "Quartz", "Resin", 45.00, "Digital sports watch")
        ]
        
        added_count = 0
        for watch in example_watches:
            try:
                self.collection.add_watch(watch)
                added_count += 1
            except ValueError:
                # Watch already exists, skip
                pass
        
        if added_count > 0:
            print(f"✅ Added {added_count} example watches to the collection")
        else:
            print("ℹ️ All example watches already exist in the collection")


def main():
    """Main entry point for the CLI."""
    if len(sys.argv) > 1:
        storage_file = sys.argv[1]
    else:
        storage_file = "watch_collection.json"
    
    cli = WatchCollectionCLI(storage_file)
    cli.run()


if __name__ == "__main__":
    main()