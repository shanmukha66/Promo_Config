import { 
  Promotion, 
  AttributeCategory,
  RuleGroup,
  Rule,
  RuleType,
  AttributeCondition
} from '../types';
import { mockPromotions, mockAttributeCategories } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service for promotions
export const PromotionService = {
  // Get all promotions
  getPromotions: async (): Promise<Promotion[]> => {
    await delay(500); // Simulate API delay
    return [...mockPromotions];
  },

  // Get promotion by ID
  getPromotionById: async (id: string): Promise<Promotion | null> => {
    await delay(300);
    const promotion = mockPromotions.find(p => p.id === id);
    return promotion ? { ...promotion } : null;
  },

  // Create new promotion
  createPromotion: async (promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> => {
    await delay(700);
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo${mockPromotions.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real app, this would be a server call
    // For now, we'll just return the new promotion
    return newPromotion;
  },

  // Update existing promotion
  updatePromotion: async (id: string, promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> => {
    await delay(700);
    const updatedPromotion: Promotion = {
      ...promotion,
      id,
      updatedAt: new Date(),
      createdAt: mockPromotions.find(p => p.id === id)?.createdAt || new Date()
    };
    
    // In a real app, this would be a server call
    // For now, we'll just return the updated promotion
    return updatedPromotion;
  },

  // Delete promotion
  deletePromotion: async (id: string): Promise<boolean> => {
    await delay(500);
    // In a real app, this would be a server call
    // For now, we'll just return success
    return true;
  }
};

// API service for attributes
export const AttributeService = {
  // Get all attribute categories
  getAttributeCategories: async (): Promise<AttributeCategory[]> => {
    await delay(300);
    return [...mockAttributeCategories];
  },

  // Get attribute categories by entity type
  getAttributeCategoriesByEntityType: async (entityType: string): Promise<AttributeCategory[]> => {
    await delay(200);
    return mockAttributeCategories.filter(category => category.entityType === entityType);
  }
};

// Helper functions for rule manipulation
export const RuleService = {
  // Generate a unique ID
  generateId: (): string => {
    return Math.random().toString(36).substring(2, 11);
  },

  // Create a new rule group
  createRuleGroup: (operator: 'AND' | 'OR' = 'AND'): RuleGroup => {
    return {
      id: RuleService.generateId(),
      operator,
      conditions: []
    };
  },

  // Create a new rule
  createRule: (type: RuleType, isInclusion: boolean): Rule => {
    return {
      id: RuleService.generateId(),
      type,
      isInclusion,
      ruleGroups: [RuleService.createRuleGroup()],
      operator: 'AND'
    };
  },

  // Format rule for display
  formatRuleForDisplay: (rule: Rule): string => {
    const ruleTypeText = rule.type === 'Qualifier' ? 'Qualifying' : 'Target';
    const inclusionText = rule.isInclusion ? 'Inclusions' : 'Exclusions';
    
    const ruleGroupsText = rule.ruleGroups.map((group, groupIndex) => {
      const conditionsText = group.conditions.map(condition => {
        // In a real app, you would look up the attribute name and format the condition properly
        return `Attribute ${condition.attributeId} ${condition.operator} ${condition.value}`;
      }).join(` ${group.operator} `);
      
      return `(${conditionsText})`;
    }).join(` ${rule.operator} `);
    
    return `${ruleTypeText} ${inclusionText}: ${ruleGroupsText}`;
  }
}; 