#!/usr/bin/env python3
"""
Example script demonstrating programmatic usage of the watch collection system.
"""

from watch import Watch
from watch_collection import WatchCollection


def main():
    """Demonstrate the watch collection system."""
    print("🔴 Watch Collection System Demo")
    print("=" * 40)
    
    # Create a new collection
    collection = WatchCollection("demo_collection.json")
    
    # Add some example watches
    print("\n➕ Adding watches to collection...")
    
    watches_to_add = [
        Watch("Rolex", "Submariner", 2020, "excellent", "Automatic", "Steel", 8500.00, "No Date model"),
        Watch("Omega", "Speedmaster", 1995, "very_good", "Manual", "Steel", 3200.00, "Hesalite crystal"), 
        Watch("Seiko", "SKX007", 2018, "good", "Automatic", "Steel", 150.00, "Classic diver"),
        Watch("Casio", "F-91W", 2019, "excellent", "Quartz", "Resin", 15.00, "Digital classic")
    ]
    
    for watch in watches_to_add:
        try:
            collection.add_watch(watch)
            print(f"✅ Added: {watch}")
        except ValueError as e:
            print(f"❌ Failed to add {watch.brand} {watch.model}: {e}")
    
    # Display collection
    print(f"\n📋 Collection now has {len(collection)} watches:")
    for i, watch in enumerate(collection.list_watches()):
        print(f"  {i}: {watch}")
    
    # Search examples
    print("\n🔍 Search Examples:")
    
    # Find Rolex watches
    rolex_watches = collection.search_watches(brand="Rolex")
    print(f"Rolex watches: {len(rolex_watches)}")
    for watch in rolex_watches:
        print(f"  - {watch}")
    
    # Find automatic watches
    auto_watches = collection.search_watches(movement_type="Automatic")
    print(f"Automatic watches: {len(auto_watches)}")
    
    # Find affordable watches (under $200)
    affordable = collection.search_watches(max_price=200)
    print(f"Affordable watches (≤$200): {len(affordable)}")
    
    # Find watches by condition
    excellent_watches = collection.search_watches(condition="excellent")
    print(f"Excellent condition watches: {len(excellent_watches)}")
    
    # Collection statistics
    print("\n📊 Collection Statistics:")
    stats = collection.get_collection_stats()
    print(f"  Total watches: {stats['total_watches']}")
    print(f"  Average year: {stats['average_year']}")
    if stats['total_value']:
        print(f"  Total value: ${stats['total_value']:,.2f}")
        print(f"  Average value: ${stats['average_value']:,.2f}")
    
    print("\n  Brand distribution:")
    for brand, count in stats['brands'].items():
        print(f"    {brand}: {count}")
    
    print("\n  Condition breakdown:")
    for condition, count in stats['conditions'].items():
        print(f"    {condition.title()}: {count}")
    
    # Custom filter example
    print("\n🎯 Custom Filter Example:")
    steel_vintage = collection.filter_watches(
        lambda w: w.case_material == "Steel" and w.year < 2000
    )
    print(f"Vintage steel watches: {len(steel_vintage)}")
    for watch in steel_vintage:
        print(f"  - {watch}")
    
    print(f"\n💾 Collection saved to: {collection.storage_file}")
    print("\n🎉 Demo complete! Try running: python3 watch_cli.py demo_collection.json")


if __name__ == "__main__":
    main()