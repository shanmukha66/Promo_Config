// Logical operator types
export type LogicalOperator = 'AND' | 'OR';

// Entity types that can be used in rules
export type EntityType = 
  | 'Product' 
  | 'Customer' 
  | 'Order' 
  | 'Payment' 
  | 'Employee';

// Attribute categories for each entity type
export interface AttributeCategory {
  id: string;
  name: string;
  entityType: EntityType;
  attributes: Attribute[];
}

// Individual attribute definition
export interface Attribute {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  options?: string[]; // For enum type attributes
}

// Condition for a specific attribute
export interface AttributeCondition {
  id: string;
  attributeId: string;
  operator: string; // "=", "!=", ">", "<", ">=", "<=", "contains", "startsWith", "endsWith"
  value: string | number | boolean | Date | string[];
}

// Rule group with logical operator
export interface RuleGroup {
  id: string;
  operator: LogicalOperator;
  conditions: AttributeCondition[];
}

// Rule type definition
export type RuleType = 'Qualifier' | 'Target';

// Rule definition (Inclusion or Exclusion)
export interface Rule {
  id: string;
  type: RuleType;
  isInclusion: boolean;
  ruleGroups: RuleGroup[];
  operator: LogicalOperator; // Operator between rule groups
}

// Promotion definition
export interface Promotion {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  rules: Rule[];
  createdAt: Date;
  updatedAt: Date;
}

// Form state for creating/editing promotions
export interface PromotionFormState {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  qualifierInclusions: RuleGroup[];
  qualifierExclusions: RuleGroup[];
  targetInclusions: RuleGroup[];
  targetExclusions: RuleGroup[];
  qualifierInclusionsOperator: LogicalOperator;
  qualifierExclusionsOperator: LogicalOperator;
  targetInclusionsOperator: LogicalOperator;
  targetExclusionsOperator: LogicalOperator;
} 