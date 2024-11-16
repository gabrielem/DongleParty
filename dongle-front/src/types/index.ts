export interface Challenge {
  id: number;
  startAmount: number;
  targetAmount: number;
  currentValue: number;
  completion: number;
  status: 'active' | 'completed' | 'cancelled';
}
