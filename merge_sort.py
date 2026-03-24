"""
Merge Sort Algorithm Implementation

MEMORY: This file contains a simple merge sort implementation in Python.
The merge sort algorithm uses a divide-and-conquer approach to sort arrays
by recursively dividing the array into halves, sorting each half, and then
merging them back together in sorted order. Time complexity: O(n log n),
Space complexity: O(n).
"""

def merge_sort(arr):
    """
    Sort an array using the merge sort algorithm.
    
    Args:
        arr (list): The array to be sorted
        
    Returns:
        list: A new sorted array
    """
    # Base case: arrays with 1 or 0 elements are already sorted
    if len(arr) <= 1:
        return arr
    
    # Divide: find the middle point and split the array
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # Conquer: recursively sort both halves
    left_sorted = merge_sort(left_half)
    right_sorted = merge_sort(right_half)
    
    # Combine: merge the sorted halves
    return merge(left_sorted, right_sorted)


def merge(left, right):
    """
    Merge two sorted arrays into one sorted array.
    
    Args:
        left (list): First sorted array
        right (list): Second sorted array
        
    Returns:
        list: Merged sorted array
    """
    result = []
    left_index = 0
    right_index = 0
    
    # Compare elements from both arrays and add the smaller one
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1
    
    # Add remaining elements from left array (if any)
    while left_index < len(left):
        result.append(left[left_index])
        left_index += 1
    
    # Add remaining elements from right array (if any)
    while right_index < len(right):
        result.append(right[right_index])
        right_index += 1
    
    return result


# Example usage and testing
if __name__ == "__main__":
    # Test cases
    test_arrays = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 4, 6, 1, 3],
        [1],
        [],
        [3, 3, 3, 3],
        [9, 8, 7, 6, 5, 4, 3, 2, 1]
    ]
    
    print("Merge Sort Algorithm Test Results:")
    print("=" * 40)
    
    for i, arr in enumerate(test_arrays, 1):
        original = arr.copy()
        sorted_arr = merge_sort(arr)
        print(f"Test {i}:")
        print(f"  Original: {original}")
        print(f"  Sorted:   {sorted_arr}")
        print()