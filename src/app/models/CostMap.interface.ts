export interface CostBreakdown {
  shipping: number;
  subtotal: number;
  total: number;
}

export interface CostMap {
  [key: string]: CostBreakdown;
}
