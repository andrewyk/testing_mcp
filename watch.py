"""
Watch data structure and validation for the watch collection system.
"""

from datetime import datetime
from typing import Optional, Dict, Any


class Watch:
    """Represents a watch in the collection with validation."""
    
    VALID_CONDITIONS = ['mint', 'excellent', 'very_good', 'good', 'fair', 'poor']
    
    def __init__(
        self,
        brand: str,
        model: str,
        year: int,
        condition: str,
        movement_type: Optional[str] = None,
        case_material: Optional[str] = None,
        price_paid: Optional[float] = None,
        notes: Optional[str] = None
    ):
        """
        Initialize a watch with validation.
        
        Args:
            brand: Watch brand name (required)
            model: Watch model name (required)
            year: Year of manufacture (required)
            condition: Condition of the watch (required)
            movement_type: Type of movement (optional)
            case_material: Case material (optional)
            price_paid: Price paid for the watch (optional)
            notes: Additional notes (optional)
        """
        self.brand = self._validate_brand(brand)
        self.model = self._validate_model(model)
        self.year = self._validate_year(year)
        self.condition = self._validate_condition(condition)
        self.movement_type = movement_type
        self.case_material = case_material
        self.price_paid = self._validate_price(price_paid) if price_paid is not None else None
        self.notes = notes or ""
        self.date_added = datetime.now()
    
    def _validate_brand(self, brand: str) -> str:
        """Validate brand name."""
        if not isinstance(brand, str) or not brand.strip():
            raise ValueError("Brand must be a non-empty string")
        return brand.strip()
    
    def _validate_model(self, model: str) -> str:
        """Validate model name."""
        if not isinstance(model, str) or not model.strip():
            raise ValueError("Model must be a non-empty string")
        return model.strip()
    
    def _validate_year(self, year: int) -> int:
        """Validate year of manufacture."""
        if not isinstance(year, int):
            raise ValueError("Year must be an integer")
        current_year = datetime.now().year
        if year < 1800 or year > current_year:
            raise ValueError(f"Year must be between 1800 and {current_year}")
        return year
    
    def _validate_condition(self, condition: str) -> str:
        """Validate condition."""
        if not isinstance(condition, str):
            raise ValueError("Condition must be a string")
        condition_lower = condition.lower()
        if condition_lower not in self.VALID_CONDITIONS:
            valid_conditions = ', '.join(self.VALID_CONDITIONS)
            raise ValueError(f"Condition must be one of: {valid_conditions}")
        return condition_lower
    
    def _validate_price(self, price: float) -> float:
        """Validate price."""
        if not isinstance(price, (int, float)):
            raise ValueError("Price must be a number")
        if price < 0:
            raise ValueError("Price cannot be negative")
        return float(price)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert watch to dictionary representation."""
        return {
            'brand': self.brand,
            'model': self.model,
            'year': self.year,
            'condition': self.condition,
            'movement_type': self.movement_type,
            'case_material': self.case_material,
            'price_paid': self.price_paid,
            'notes': self.notes,
            'date_added': self.date_added.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Watch':
        """Create watch from dictionary representation."""
        watch = cls(
            brand=data['brand'],
            model=data['model'],
            year=data['year'],
            condition=data['condition'],
            movement_type=data.get('movement_type'),
            case_material=data.get('case_material'),
            price_paid=data.get('price_paid'),
            notes=data.get('notes', '')
        )
        # Restore original date_added if available
        if 'date_added' in data:
            try:
                watch.date_added = datetime.fromisoformat(data['date_added'])
            except ValueError:
                pass  # Use current datetime if parsing fails
        return watch
    
    def __str__(self) -> str:
        """String representation of the watch."""
        price_str = f" (${self.price_paid:.2f})" if self.price_paid else ""
        return f"{self.brand} {self.model} ({self.year}) - {self.condition.title()}{price_str}"
    
    def __repr__(self) -> str:
        """Developer representation of the watch."""
        return f"Watch(brand='{self.brand}', model='{self.model}', year={self.year}, condition='{self.condition}')"