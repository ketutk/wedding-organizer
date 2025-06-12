// User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "User";
  createdAt: Date;
  updatedAt: Date;
  companies?: Company | null;
}

// Company.ts
export interface Company {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  image?: string | null;
  feedbackUrl: string;
  createdAt: Date;
  updatedAt: Date;

  owner?: User;
  feedbacks?: Feedback[];
  questionnaires?: Questionnaire[];
}

// Feedback.ts
export interface Feedback {
  id: string;
  companyId: string;
  questionnaireID: string;
  value: string;
  sentiment: string;
  createdAt: Date;
  updatedAt: Date;

  company?: Company;
  questionnaire?: Questionnaire;
}

// Questionnaire.ts
export interface Questionnaire {
  id: string;
  companyId: string;
  question: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  feedbacks?: Feedback[];
  company?: Company;
}
export interface FeedbackSentiment {
  _count: Count;
  sentiment: string;
}

interface Count {
  sentiment: number;
}
