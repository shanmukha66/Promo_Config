import { 
  AttributeCategory, 
  Attribute, 
  Promotion,
  RuleGroup,
  AttributeCondition,
  Rule,
  LogicalOperator,
  RuleType
} from '../types';

// Mock attribute categories and attributes
export const mockAttributeCategories: AttributeCategory[] = [
  {
    id: 'pc1',
    name: 'Product Class',
    entityType: 'Product',
    attributes: [
      { id: 'pc1-a1', name: 'Product Class', type: 'enum', options: ['Shirts', 'Tops', 'Pants', 'Dresses', 'Accessories'] }
    ]
  },
  {
    id: 'color1',
    name: 'Color',
    entityType: 'Product',
    attributes: [
      { id: 'color1-a1', name: 'Color', type: 'enum', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow'] }
    ]
  },
  {
    id: 'season1',
    name: 'Season',
    entityType: 'Product',
    attributes: [
      { id: 'season1-a1', name: 'Season', type: 'enum', options: ['Spring', 'Summer', 'Fall', 'Winter'] }
    ]
  },
  {
    id: 'style1',
    name: 'Style',
    entityType: 'Product',
    attributes: [
      { id: 'style1-a1', name: 'Style Code', type: 'string' }
    ]
  },
  {
    id: 'size1',
    name: 'Size',
    entityType: 'Product',
    attributes: [
      { id: 'size1-a1', name: 'Size', type: 'enum', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: 'brand1',
    name: 'Brand',
    entityType: 'Product',
    attributes: [
      { id: 'brand1-a1', name: 'Brand', type: 'enum', options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'] }
    ]
  },
  {
    id: 'price1',
    name: 'Price',
    entityType: 'Product',
    attributes: [
      { id: 'price1-a1', name: 'Price', type: 'number' }
    ]
  },
  {
    id: 'customer1',
    name: 'Customer Type',
    entityType: 'Customer',
    attributes: [
      { id: 'customer1-a1', name: 'Customer Type', type: 'enum', options: ['Regular', 'Premium', 'VIP'] }
    ]
  },
  {
    id: 'order1',
    name: 'Order Value',
    entityType: 'Order',
    attributes: [
      { id: 'order1-a1', name: 'Order Value', type: 'number' }
    ]
  },
  {
    id: 'payment1',
    name: 'Payment Method',
    entityType: 'Payment',
    attributes: [
      { id: 'payment1-a1', name: 'Payment Method', type: 'enum', options: ['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay'] }
    ]
  }
];

// Helper function to create a condition
const createCondition = (
  id: string, 
  attributeId: string, 
  operator: string, 
  value: any
): AttributeCondition => ({
  id,
  attributeId,
  operator,
  value
});

// Helper function to create a rule group
const createRuleGroup = (
  id: string, 
  operator: LogicalOperator, 
  conditions: AttributeCondition[]
): RuleGroup => ({
  id,
  operator,
  conditions
});

// Helper function to create a rule
const createRule = (
  id: string, 
  type: RuleType, 
  isInclusion: boolean, 
  ruleGroups: RuleGroup[],
  operator: LogicalOperator
): Rule => ({
  id,
  type,
  isInclusion,
  ruleGroups,
  operator
});

// Mock promotions
export const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    name: '10% Off Black or Blue Items',
    description: 'Get 10% off on all Black or Blue colored items',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-12-31'),
    isActive: true,
    discountType: 'percentage',
    discountValue: 10,
    rules: [
      createRule(
        'rule1',
        'Qualifier',
        true,
        [
          createRuleGroup(
            'rg1',
            'OR',
            [
              createCondition('cond1', 'color1-a1', '=', 'Black'),
              createCondition('cond2', 'color1-a1', '=', 'Blue')
            ]
          )
        ],
        'AND'
      ),
      createRule(
        'rule2',
        'Target',
        true,
        [
          createRuleGroup(
            'rg2',
            'AND',
            [
              createCondition('cond3', 'price1-a1', '>=', 20)
            ]
          )
        ],
        'AND'
      )
    ],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: 'promo2',
    name: '20% Off Winter Season Items',
    description: 'Get 20% off on all Winter season items',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-02-28'),
    isActive: true,
    discountType: 'percentage',
    discountValue: 20,
    rules: [
      createRule(
        'rule3',
        'Qualifier',
        true,
        [
          createRuleGroup(
            'rg3',
            'AND',
            [
              createCondition('cond4', 'season1-a1', '=', 'Winter')
            ]
          )
        ],
        'AND'
      ),
      createRule(
        'rule4',
        'Target',
        true,
        [
          createRuleGroup(
            'rg4',
            'AND',
            [
              createCondition('cond5', 'price1-a1', '>=', 30)
            ]
          )
        ],
        'AND'
      )
    ],
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: 'promo3',
    name: 'Buy One Get One Free on Shirts',
    description: 'Buy one shirt and get another one free',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-08-31'),
    isActive: false,
    discountType: 'bogo',
    discountValue: 100,
    rules: [
      createRule(
        'rule5',
        'Qualifier',
        true,
        [
          createRuleGroup(
            'rg5',
            'AND',
            [
              createCondition('cond6', 'pc1-a1', '=', 'Shirts')
            ]
          )
        ],
        'AND'
      ),
      createRule(
        'rule6',
        'Target',
        true,
        [
          createRuleGroup(
            'rg6',
            'AND',
            [
              createCondition('cond7', 'pc1-a1', '=', 'Shirts')
            ]
          )
        ],
        'AND'
      )
    ],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 'promo4',
    name: 'Complex Promo with AND/OR Conditions',
    description: 'Example of a complex promotion with mixed AND/OR conditions',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-09-30'),
    isActive: true,
    discountType: 'percentage',
    discountValue: 15,
    rules: [
      createRule(
        'rule7',
        'Qualifier',
        true,
        [
          createRuleGroup(
            'rg7',
            'OR',
            [
              createCondition('cond8', 'color1-a1', '=', 'Black'),
              createCondition('cond9', 'color1-a1', '=', 'Blue')
            ]
          ),
          createRuleGroup(
            'rg8',
            'OR',
            [
              createCondition('cond10', 'season1-a1', '=', 'Winter'),
              createCondition('cond11', 'season1-a1', '=', 'Fall')
            ]
          )
        ],
        'AND'
      ),
      createRule(
        'rule8',
        'Target',
        true,
        [
          createRuleGroup(
            'rg9',
            'AND',
            [
              createCondition('cond12', 'price1-a1', '>=', 50)
            ]
          )
        ],
        'AND'
      )
    ],
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-07-15')
  }
]; 