import { create } from 'zustand';
import { Promotion, PromotionFormState, RuleGroup, LogicalOperator, RuleType } from '../types';
import { PromotionService, RuleService } from '../services/api';

interface PromotionState {
  // Promotions list
  promotions: Promotion[];
  isLoading: boolean;
  error: string | null;
  
  // Current promotion being viewed/edited
  currentPromotion: Promotion | null;
  
  // Form state for creating/editing
  formState: PromotionFormState;
  
  // Actions
  fetchPromotions: () => Promise<void>;
  fetchPromotionById: (id: string) => Promise<void>;
  createPromotion: () => Promise<Promotion>;
  updatePromotion: (id: string) => Promise<Promotion>;
  deletePromotion: (id: string) => Promise<boolean>;
  
  // Form state actions
  setFormField: <K extends keyof PromotionFormState>(field: K, value: PromotionFormState[K]) => void;
  resetFormState: () => void;
  initFormStateFromPromotion: (promotion: Promotion) => void;
  
  // Rule group actions
  addRuleGroup: (ruleType: 'Qualifier' | 'Target', isInclusion: boolean) => void;
  removeRuleGroup: (ruleType: 'Qualifier' | 'Target', isInclusion: boolean, groupIndex: number) => void;
  updateRuleGroupOperator: (
    ruleType: 'Qualifier' | 'Target', 
    isInclusion: boolean, 
    groupIndex: number, 
    operator: LogicalOperator
  ) => void;
  
  // Rule groups operator actions
  updateRuleGroupsOperator: (
    ruleType: 'Qualifier' | 'Target', 
    isInclusion: boolean, 
    operator: LogicalOperator
  ) => void;
  
  // Condition actions
  addCondition: (
    ruleType: 'Qualifier' | 'Target', 
    isInclusion: boolean, 
    groupIndex: number, 
    attributeId: string, 
    operator: string, 
    value: any
  ) => void;
  removeCondition: (
    ruleType: 'Qualifier' | 'Target', 
    isInclusion: boolean, 
    groupIndex: number, 
    conditionIndex: number
  ) => void;
  updateCondition: (
    ruleType: 'Qualifier' | 'Target', 
    isInclusion: boolean, 
    groupIndex: number, 
    conditionIndex: number, 
    attributeId: string, 
    operator: string, 
    value: any
  ) => void;
}

// Initial form state
const initialFormState: PromotionFormState = {
  name: '',
  description: '',
  startDate: null,
  endDate: null,
  isActive: true,
  discountType: 'percentage',
  discountValue: 0,
  qualifierInclusions: [RuleService.createRuleGroup()],
  qualifierExclusions: [],
  targetInclusions: [RuleService.createRuleGroup()],
  targetExclusions: [],
  qualifierInclusionsOperator: 'AND',
  qualifierExclusionsOperator: 'AND',
  targetInclusionsOperator: 'AND',
  targetExclusionsOperator: 'AND'
};

// Create the store
export const usePromotionStore = create<PromotionState>((set, get) => ({
  // State
  promotions: [],
  isLoading: false,
  error: null,
  currentPromotion: null,
  formState: { ...initialFormState },
  
  // Actions
  fetchPromotions: async () => {
    set({ isLoading: true, error: null });
    try {
      const promotions = await PromotionService.getPromotions();
      set({ promotions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch promotions', isLoading: false });
    }
  },
  
  fetchPromotionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = await PromotionService.getPromotionById(id);
      set({ currentPromotion: promotion, isLoading: false });
      if (promotion) {
        get().initFormStateFromPromotion(promotion);
      }
    } catch (error) {
      set({ error: 'Failed to fetch promotion', isLoading: false });
    }
  },
  
  createPromotion: async () => {
    set({ isLoading: true, error: null });
    try {
      const { formState } = get();
      
      // Convert form state to promotion
      const promotionData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formState.name,
        description: formState.description,
        startDate: formState.startDate || new Date(),
        endDate: formState.endDate || new Date(),
        isActive: formState.isActive,
        discountType: formState.discountType,
        discountValue: formState.discountValue,
        rules: [
          // Qualifier inclusions
          {
            id: RuleService.generateId(),
            type: 'Qualifier' as RuleType,
            isInclusion: true,
            ruleGroups: formState.qualifierInclusions,
            operator: formState.qualifierInclusionsOperator
          },
          // Qualifier exclusions
          ...(formState.qualifierExclusions.length > 0 ? [{
            id: RuleService.generateId(),
            type: 'Qualifier' as RuleType,
            isInclusion: false,
            ruleGroups: formState.qualifierExclusions,
            operator: formState.qualifierExclusionsOperator
          }] : []),
          // Target inclusions
          {
            id: RuleService.generateId(),
            type: 'Target' as RuleType,
            isInclusion: true,
            ruleGroups: formState.targetInclusions,
            operator: formState.targetInclusionsOperator
          },
          // Target exclusions
          ...(formState.targetExclusions.length > 0 ? [{
            id: RuleService.generateId(),
            type: 'Target' as RuleType,
            isInclusion: false,
            ruleGroups: formState.targetExclusions,
            operator: formState.targetExclusionsOperator
          }] : [])
        ]
      };
      
      const newPromotion = await PromotionService.createPromotion(promotionData);
      
      // Update state
      set(state => ({
        promotions: [...state.promotions, newPromotion],
        currentPromotion: newPromotion,
        isLoading: false
      }));
      
      return newPromotion;
    } catch (error) {
      set({ error: 'Failed to create promotion', isLoading: false });
      throw error;
    }
  },
  
  updatePromotion: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { formState } = get();
      
      // Convert form state to promotion
      const promotionData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formState.name,
        description: formState.description,
        startDate: formState.startDate || new Date(),
        endDate: formState.endDate || new Date(),
        isActive: formState.isActive,
        discountType: formState.discountType,
        discountValue: formState.discountValue,
        rules: [
          // Qualifier inclusions
          {
            id: RuleService.generateId(),
            type: 'Qualifier' as RuleType,
            isInclusion: true,
            ruleGroups: formState.qualifierInclusions,
            operator: formState.qualifierInclusionsOperator
          },
          // Qualifier exclusions
          ...(formState.qualifierExclusions.length > 0 ? [{
            id: RuleService.generateId(),
            type: 'Qualifier' as RuleType,
            isInclusion: false,
            ruleGroups: formState.qualifierExclusions,
            operator: formState.qualifierExclusionsOperator
          }] : []),
          // Target inclusions
          {
            id: RuleService.generateId(),
            type: 'Target' as RuleType,
            isInclusion: true,
            ruleGroups: formState.targetInclusions,
            operator: formState.targetInclusionsOperator
          },
          // Target exclusions
          ...(formState.targetExclusions.length > 0 ? [{
            id: RuleService.generateId(),
            type: 'Target' as RuleType,
            isInclusion: false,
            ruleGroups: formState.targetExclusions,
            operator: formState.targetExclusionsOperator
          }] : [])
        ]
      };
      
      const updatedPromotion = await PromotionService.updatePromotion(id, promotionData);
      
      // Update state
      set(state => ({
        promotions: state.promotions.map(p => p.id === id ? updatedPromotion : p),
        currentPromotion: updatedPromotion,
        isLoading: false
      }));
      
      return updatedPromotion;
    } catch (error) {
      set({ error: 'Failed to update promotion', isLoading: false });
      throw error;
    }
  },
  
  deletePromotion: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await PromotionService.deletePromotion(id);
      if (success) {
        set(state => ({
          promotions: state.promotions.filter(p => p.id !== id),
          isLoading: false
        }));
      }
      return success;
    } catch (error) {
      set({ error: 'Failed to delete promotion', isLoading: false });
      return false;
    }
  },
  
  // Form state actions
  setFormField: (field, value) => {
    set(state => ({
      formState: {
        ...state.formState,
        [field]: value
      }
    }));
  },
  
  resetFormState: () => {
    set({ formState: { ...initialFormState } });
  },
  
  initFormStateFromPromotion: (promotion: Promotion) => {
    // Extract rule groups from promotion
    const qualifierInclusions: RuleGroup[] = [];
    const qualifierExclusions: RuleGroup[] = [];
    const targetInclusions: RuleGroup[] = [];
    const targetExclusions: RuleGroup[] = [];
    
    let qualifierInclusionsOperator: LogicalOperator = 'AND';
    let qualifierExclusionsOperator: LogicalOperator = 'AND';
    let targetInclusionsOperator: LogicalOperator = 'AND';
    let targetExclusionsOperator: LogicalOperator = 'AND';
    
    // Process rules
    promotion.rules.forEach(rule => {
      if (rule.type === 'Qualifier') {
        if (rule.isInclusion) {
          qualifierInclusions.push(...rule.ruleGroups);
          qualifierInclusionsOperator = rule.operator;
        } else {
          qualifierExclusions.push(...rule.ruleGroups);
          qualifierExclusionsOperator = rule.operator;
        }
      } else if (rule.type === 'Target') {
        if (rule.isInclusion) {
          targetInclusions.push(...rule.ruleGroups);
          targetInclusionsOperator = rule.operator;
        } else {
          targetExclusions.push(...rule.ruleGroups);
          targetExclusionsOperator = rule.operator;
        }
      }
    });
    
    // Set form state
    set({
      formState: {
        name: promotion.name,
        description: promotion.description,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        isActive: promotion.isActive,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        qualifierInclusions,
        qualifierExclusions,
        targetInclusions,
        targetExclusions,
        qualifierInclusionsOperator,
        qualifierExclusionsOperator,
        targetInclusionsOperator,
        targetExclusionsOperator
      }
    });
  },
  
  // Rule group actions
  addRuleGroup: (ruleType, isInclusion) => {
    set(state => {
      const newGroup = RuleService.createRuleGroup();
      const formState = { ...state.formState };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = [...formState.qualifierInclusions, newGroup];
        } else {
          formState.qualifierExclusions = [...formState.qualifierExclusions, newGroup];
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = [...formState.targetInclusions, newGroup];
        } else {
          formState.targetExclusions = [...formState.targetExclusions, newGroup];
        }
      }
      
      return { formState };
    });
  },
  
  removeRuleGroup: (ruleType, isInclusion, groupIndex) => {
    set(state => {
      const formState = { ...state.formState };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = formState.qualifierInclusions.filter((_, i) => i !== groupIndex);
          // Ensure at least one group remains
          if (formState.qualifierInclusions.length === 0) {
            formState.qualifierInclusions = [RuleService.createRuleGroup()];
          }
        } else {
          formState.qualifierExclusions = formState.qualifierExclusions.filter((_, i) => i !== groupIndex);
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = formState.targetInclusions.filter((_, i) => i !== groupIndex);
          // Ensure at least one group remains
          if (formState.targetInclusions.length === 0) {
            formState.targetInclusions = [RuleService.createRuleGroup()];
          }
        } else {
          formState.targetExclusions = formState.targetExclusions.filter((_, i) => i !== groupIndex);
        }
      }
      
      return { formState };
    });
  },
  
  updateRuleGroupOperator: (ruleType, isInclusion, groupIndex, operator) => {
    set(state => {
      const formState = { ...state.formState };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = formState.qualifierInclusions.map((group, i) => 
            i === groupIndex ? { ...group, operator } : group
          );
        } else {
          formState.qualifierExclusions = formState.qualifierExclusions.map((group, i) => 
            i === groupIndex ? { ...group, operator } : group
          );
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = formState.targetInclusions.map((group, i) => 
            i === groupIndex ? { ...group, operator } : group
          );
        } else {
          formState.targetExclusions = formState.targetExclusions.map((group, i) => 
            i === groupIndex ? { ...group, operator } : group
          );
        }
      }
      
      return { formState };
    });
  },
  
  updateRuleGroupsOperator: (ruleType, isInclusion, operator) => {
    set(state => {
      const formState = { ...state.formState };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusionsOperator = operator;
        } else {
          formState.qualifierExclusionsOperator = operator;
        }
      } else {
        if (isInclusion) {
          formState.targetInclusionsOperator = operator;
        } else {
          formState.targetExclusionsOperator = operator;
        }
      }
      
      return { formState };
    });
  },
  
  // Condition actions
  addCondition: (ruleType, isInclusion, groupIndex, attributeId, operator, value) => {
    set(state => {
      const formState = { ...state.formState };
      const newCondition = {
        id: RuleService.generateId(),
        attributeId,
        operator,
        value
      };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = formState.qualifierInclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: [...group.conditions, newCondition] } 
              : group
          );
        } else {
          formState.qualifierExclusions = formState.qualifierExclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: [...group.conditions, newCondition] } 
              : group
          );
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = formState.targetInclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: [...group.conditions, newCondition] } 
              : group
          );
        } else {
          formState.targetExclusions = formState.targetExclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: [...group.conditions, newCondition] } 
              : group
          );
        }
      }
      
      return { formState };
    });
  },
  
  removeCondition: (ruleType, isInclusion, groupIndex, conditionIndex) => {
    set(state => {
      const formState = { ...state.formState };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = formState.qualifierInclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: group.conditions.filter((_, j) => j !== conditionIndex) } 
              : group
          );
        } else {
          formState.qualifierExclusions = formState.qualifierExclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: group.conditions.filter((_, j) => j !== conditionIndex) } 
              : group
          );
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = formState.targetInclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: group.conditions.filter((_, j) => j !== conditionIndex) } 
              : group
          );
        } else {
          formState.targetExclusions = formState.targetExclusions.map((group, i) => 
            i === groupIndex 
              ? { ...group, conditions: group.conditions.filter((_, j) => j !== conditionIndex) } 
              : group
          );
        }
      }
      
      return { formState };
    });
  },
  
  updateCondition: (ruleType, isInclusion, groupIndex, conditionIndex, attributeId, operator, value) => {
    set(state => {
      const formState = { ...state.formState };
      const updatedCondition = {
        id: RuleService.generateId(),
        attributeId,
        operator,
        value
      };
      
      if (ruleType === 'Qualifier') {
        if (isInclusion) {
          formState.qualifierInclusions = formState.qualifierInclusions.map((group, i) => 
            i === groupIndex 
              ? { 
                  ...group, 
                  conditions: group.conditions.map((cond, j) => 
                    j === conditionIndex ? updatedCondition : cond
                  ) 
                } 
              : group
          );
        } else {
          formState.qualifierExclusions = formState.qualifierExclusions.map((group, i) => 
            i === groupIndex 
              ? { 
                  ...group, 
                  conditions: group.conditions.map((cond, j) => 
                    j === conditionIndex ? updatedCondition : cond
                  ) 
                } 
              : group
          );
        }
      } else {
        if (isInclusion) {
          formState.targetInclusions = formState.targetInclusions.map((group, i) => 
            i === groupIndex 
              ? { 
                  ...group, 
                  conditions: group.conditions.map((cond, j) => 
                    j === conditionIndex ? updatedCondition : cond
                  ) 
                } 
              : group
          );
        } else {
          formState.targetExclusions = formState.targetExclusions.map((group, i) => 
            i === groupIndex 
              ? { 
                  ...group, 
                  conditions: group.conditions.map((cond, j) => 
                    j === conditionIndex ? updatedCondition : cond
                  ) 
                } 
              : group
          );
        }
      }
      
      return { formState };
    });
  }
})); 