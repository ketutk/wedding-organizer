interface Questionnaire {
  id: string;
  question: string;
  feedbackSummary: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    feedbacks: number;
  };
}

interface FeedbackSentiment {
  sentiment: "Positive" | "Neutral" | "Negative";
  _count: {
    sentiment: number;
  };
}

export interface CompanyDetail {
  company: {
    id: string;
    name: string;
    image: string;
    description: string;
    feedbackUrl: string;
    createdAt: string;
    updatedAt: string;
    questionnaires: Questionnaire[];
    owner: {
      name: string;
      email: string;
      role: string;
    };
    _count: {
      feedbacks: number;
    };
  };
  feedbacks: FeedbackSentiment[];
}
