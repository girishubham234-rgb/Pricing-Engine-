import { UserProfile, UserScores, PricingDecision } from '../types';

export const calculateScores = (user: UserProfile): UserScores => {
  let intent = 0;
  let affordability = 0;
  let churn = 0;

  // Intent Score
  if (user.mockTestsTaken > 2) intent += 0.3;
  if (user.addedToCart) intent += 0.3;
  if (user.pageVisits > 3) intent += 0.2;
  // Cap intent at 1.0 (though logic implies it sums up, usually normalized)
  // Based on python snippet: max potential is 0.8 from these rules alone.

  // Affordability Score
  if (user.deviceType === 'iOS') {
    affordability += 0.9;
  } else if (user.deviceType === 'Android') {
    affordability += 0.4;
  } else if (user.deviceType === 'Web') {
    // Web users (Desktop/Laptop) generally imply moderate to high affordability
    affordability += 0.6;
  }

  if (user.cityTier === 1) {
    affordability += 0.9;
  } else if (user.cityTier === 2) {
    // Tier 2 cities (e.g., Pune, Jaipur) have moderate affordability
    affordability += 0.6;
  } else if (user.cityTier === 3) {
    affordability += 0.3;
  }

  // Churn Score
  if (user.isUninstalled) churn += 0.4;
  if (user.lastActiveDays > 30) churn += 0.3;
  if (user.competitorSignal) churn += 0.3;

  return {
    intentScore: parseFloat(intent.toFixed(2)),
    affordabilityScore: parseFloat((affordability / 2).toFixed(2)), // Averaging as per python snippet
    churnScore: parseFloat(churn.toFixed(2))
  };
};

export const getDiscountDecision = (scores: UserScores): number => {
  const { intentScore, affordabilityScore, churnScore } = scores;

  // Logic based on provided Python snippet
  // Priority 1: High Churn + Moderate/High Intent -> Win back at all costs
  if (churnScore > 0.6 && intentScore > 0.5) {
    return 75;
  } 
  // Priority 2: High Churn + Low Affordability -> Price sensitive retention
  else if (churnScore > 0.6 && affordabilityScore < 0.4) {
    return 70;
  } 
  // Priority 3: High Intent + Low Affordability -> Conversion nudge
  else if (intentScore > 0.75 && affordabilityScore < 0.4) {
    return 65;
  } 
  // Priority 4: High Intent -> Closing the deal
  else if (intentScore > 0.75) {
    return 45;
  } 
  // Default
  else {
    return 0;
  }
};

export const analyzeUser = (user: UserProfile): PricingDecision => {
  const scores = calculateScores(user);
  const discount = getDiscountDecision(scores);
  
  let reason = "Standard pricing applied.";
  if (discount === 75) reason = "High Churn Risk + High Intent (Win-back priority)";
  else if (discount === 70) reason = "High Churn Risk + Low Affordability (Price sensitive retention)";
  else if (discount === 65) reason = "High Intent + Low Affordability (Conversion nudge)";
  else if (discount === 45) reason = "High Intent (Closing the deal)";

  return {
    discount,
    reason,
    scores
  };
};