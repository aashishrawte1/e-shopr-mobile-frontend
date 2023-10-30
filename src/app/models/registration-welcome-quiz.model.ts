import { ApiResponse } from './api';

export interface IRegistrationWelcomeQuizStatusCheckApiResponse
  extends ApiResponse {
  result: {
    completedQuiz: boolean;
  };
}

export interface IRegistrationWelcomeQuiz {
  startAt: string;
  endAt: string;
  activePage: string;
  responses: {
    [questionId: string]: {
      response: string; // comma separated
    };
  };
}
