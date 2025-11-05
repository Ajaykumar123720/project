export type SectionId = 'home' | 'lessons' | 'quiz' | 'discussion' | 'admin';

export interface NavButton {
  id: SectionId;
  label: string;
}

export interface LessonTopic {
  title: string;
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface DiscussionPost {
  author: string;
  content: string;
}
