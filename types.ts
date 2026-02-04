export type Step = 1 | 2 | 3 | "complete";

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

export interface LearningSection {
  title: string;
  type: "observation" | "dont" | "do";
  content: string;
  mediaLabel: string;
}

export interface PracticeQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningContent {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sections: LearningSection[];
  questions: PracticeQuestion[];
}


export interface EmergencyStep {
  title: string;
  instruction: string;
  helperText: string;
  hasTimer: boolean;
  threshold?: number;
}

export interface EmergencyCondition {
  id: number;
  name: string;
  subtitle: string;
  sessions: number;
  status: 'Live' | 'Draft' | 'Under Review';
  updated: string;
  steps: EmergencyStep[];
}

export interface DailyNudge {
  id: number;
  tip: string;
  context: string;
}

export interface Feedback {
  id: string;
  name: string;
  date: string;
  message: string;
  status: "Read" | "Unread";
}