export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  thumbnail: string;
  images: string[];
  brief: string;
  problem: string;
  idea: string;
  reaction: string;
  results: { metric: string; value: string }[];
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: string;
  obsession: string;
  platform: string;
  superpower: string;
}

export interface CultureItem {
  id: string;
  type: 'trend' | 'behavior' | 'format' | 'meme' | 'creator' | 'observation';
  title: string;
  description: string;
  insight: string;
  platform: string;
}

export interface Statistic {
  label: string;
  value: string;
  description?: string;
}

export interface ToolboxTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Idea {
  id: string;
  text: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
  key: string;
}

export interface AttentionSignal {
  level: number;
  isMaxed: boolean;
}