
export type Deed = {
  id: string;
  title: string;
  description: string;
  date: Date;
  recipient: string;
  category: string;
  impact: 'small' | 'medium' | 'large';
  completed: boolean;
};

export type DeedStats = {
  total: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  byImpact: Record<string, number>;
};
