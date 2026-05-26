export type SentenceFunctionChoice = {
  id: string;
  text: string;
};

export type SentenceFunctionQuestion = {
  prompt: string;
  choices: SentenceFunctionChoice[];
  correctChoiceId: string;
};

export type SentenceFunctionScenario = {
  id: string;
  mode: "what_is_sentence_doing";
  category: string;
  difficulty: number;
  context: string;
  sentence: string;
  taxonomyTags: string[];

  surfaceQuestion: SentenceFunctionQuestion;
  functionQuestion: SentenceFunctionQuestion;
  countermoveQuestion: SentenceFunctionQuestion;

  surfaceMeaning: string;
  functionalMeaning: string;
  hiddenMove: string;
  counterSkill: string;
  exampleResponse: string;
  unlockedFunctionCard: string;
};

export type SentenceFunctionAnswerResult = {
  surfaceCorrect: boolean;
  functionCorrect: boolean;
  countermoveCorrect: boolean;
  totalScore: number;
};