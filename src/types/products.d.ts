export type Product = {
  id: string;
  name: string;
  description: string;
  features: Features[];
  price: number;
  currency?: string;
  line_items?: any;
};
