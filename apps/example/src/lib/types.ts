export type CategoryId = "recommend" | "coffee" | "non-coffee" | "tea" | "smoothie" | "ade" | "dessert" | "goods";

export type Category = {
  id: CategoryId;
  label: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  emoji: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBest?: boolean;
};

export type CartLine = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
  option: TemperatureOption;
};

export type TemperatureOption = "hot" | "ice";

export type Review = {
  id: string;
  menuId: string;
  menuName: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};
