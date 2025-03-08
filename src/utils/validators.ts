import { PromotionFormState } from '../types';

/**
 * Validates a promotion form state
 * Returns an object with validation errors
 */
export const validatePromotionForm = (formState: PromotionFormState): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!formState.name.trim()) {
    errors.name = 'Name is required';
  } else if (formState.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  // Validate dates
  if (formState.startDate && formState.endDate) {
    if (new Date(formState.startDate) > new Date(formState.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Validate discount value
  if (formState.discountType !== 'bogo') {
    if (formState.discountValue <= 0) {
      errors.discountValue = 'Discount value must be greater than 0';
    }

    if (formState.discountType === 'percentage' && formState.discountValue > 100) {
      errors.discountValue = 'Percentage discount cannot exceed 100%';
    }
  }

  // Validate qualifier inclusions
  if (formState.qualifierInclusions.length === 0) {
    errors.qualifierInclusions = 'At least one qualifier inclusion is required';
  } else {
    // Check if any rule group has no conditions
    const hasEmptyRuleGroup = formState.qualifierInclusions.some(
      group => group.conditions.length === 0
    );
    
    if (hasEmptyRuleGroup) {
      errors.qualifierInclusions = 'All rule groups must have at least one condition';
    }
  }

  // Validate target inclusions
  if (formState.targetInclusions.length === 0) {
    errors.targetInclusions = 'At least one target inclusion is required';
  } else {
    // Check if any rule group has no conditions
    const hasEmptyRuleGroup = formState.targetInclusions.some(
      group => group.conditions.length === 0
    );
    
    if (hasEmptyRuleGroup) {
      errors.targetInclusions = 'All rule groups must have at least one condition';
    }
  }

  return errors;
};

/**
 * Checks if a promotion form is valid
 */
export const isPromotionFormValid = (formState: PromotionFormState): boolean => {
  const errors = validatePromotionForm(formState);
  return Object.keys(errors).length === 0;
}; 