export type Product = {
  id: string;
  name: string;
  description: string;
  features?: Features[];
  price: number;
  isUpgradable?: boolean;
  hasIntegration?: boolean;
  monthtlyExecutionLimit?: number;
  dailyExecutionLimit?: number;
  maxRooms?: number;
  currency?: string;
  line_items?: any;
};
