export interface ListCost {
  id_food_costs: number;
  week_number: string;
  food_type: string | number;
  grams_per_chicken: string;
  total_kg: string;
  total_cost: string;
  start_date: Date;
  end_date: Date;
  status: string;
}

export interface FoodCost {
  idFoodCosts: number;
  weekNumber: string;
  foodId : number;
  gramsPerChicken: string;
  totalKg: string;
  totalCost: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface InsertCost {
  weekNumber: string;
  foodId : number;
  gramsPerChicken: string;
  totalKg: string;
  totalCost: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateCost {
  idFoodCosts: number;
  weekNumber: string;
  foodId : string | number;
  gramsPerChicken: string;
  totalKg: string;
  totalCost: string;
  startDate: Date;
  endDate: Date;
}
