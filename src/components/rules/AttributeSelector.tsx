import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material';
import { AttributeCategory, Attribute } from '../../types';
import { AttributeService } from '../../services/api';

interface AttributeSelectorProps {
  selectedAttributeId: string;
  onAttributeChange: (attributeId: string) => void;
  entityType?: string;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  selectedAttributeId,
  onAttributeChange,
  entityType
}) => {
  const [categories, setCategories] = useState<AttributeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        let fetchedCategories;
        if (entityType) {
          fetchedCategories = await AttributeService.getAttributeCategoriesByEntityType(entityType);
        } else {
          fetchedCategories = await AttributeService.getAttributeCategories();
        }
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch attribute categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [entityType]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onAttributeChange(event.target.value);
  };

  // Find the selected attribute for display
  const findSelectedAttribute = (): { category: string, attribute: string } => {
    for (const category of categories) {
      for (const attribute of category.attributes) {
        if (attribute.id === selectedAttributeId) {
          return { 
            category: category.name,
            attribute: attribute.name
          };
        }
      }
    }
    return { category: '', attribute: '' };
  };

  const { category, attribute } = findSelectedAttribute();

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="attribute-select-label">Attribute</InputLabel>
        <Select
          labelId="attribute-select-label"
          id="attribute-select"
          value={selectedAttributeId}
          label="Attribute"
          onChange={handleChange}
          disabled={loading}
        >
          {categories.map((category) => [
            <MenuItem 
              key={`category-${category.id}`} 
              value={`category-${category.id}`}
              disabled
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }}
            >
              {category.name}
            </MenuItem>,
            ...category.attributes.map((attribute) => (
              <MenuItem 
                key={attribute.id} 
                value={attribute.id}
                sx={{ pl: 4 }}
              >
                {attribute.name}
              </MenuItem>
            ))
          ])}
        </Select>
      </FormControl>
      
      {selectedAttributeId && category && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Selected: {category} - {attribute}
        </Typography>
      )}
    </Box>
  );
};

export default AttributeSelector; 