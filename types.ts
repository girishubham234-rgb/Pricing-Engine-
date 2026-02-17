export interface UserProfile {
  id: string;
  name: string;
  mockTestsTaken: number;
  addedToCart: boolean;
  pageVisits: number;
  deviceType: 'iOS' | 'Android' | 'Web';
  cityTier: 1 | 2 | 3;
  isUninstalled: boolean;
  lastActiveDays: number;
  competitorSignal: boolean;
}

export interface UserScores {
  intentScore: number;
  affordabilityScore: number;
  churnScore: number;
}

export interface PricingDecision {
  discount: number;
  reason: string;
  scores: UserScores;
}

export interface BatchResult extends UserProfile, PricingDecision {
  converted: boolean;
}