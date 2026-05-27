export type ValueId = string;
export type DistinctionId = string;
export type ConditionId = string;
export type PressureId = string;
export type TestId = string;
export type CorruptedFormId = string;
export type BoundaryId = string;
export type ProtocolId = string;

export type ConceptualFrame = {
  value: ValueId;
  distinction: DistinctionId;
  condition: ConditionId;
  pressure: PressureId;
  test: TestId;
  corruptedForm: CorruptedFormId;
  boundary: BoundaryId;
  protocol: ProtocolId;
};

export type ScenarioFrame = {
  id: string;
  mode: "identify_pressure_pattern";
  context: string;
  backgroundStory?: string;
  scenarioCategories: string[];
  conceptualFrame: ConceptualFrame;
  prompt: string;
  choices: PressureId[];
  correctAnswer: PressureId;
  explanation: string;
  evidenceSpan: string;
  warrant: string;
};

export type DiagnosticClaim = {
  type: "PRESSURE_IDENTIFIED";
  pressure: PressureId;
  evidenceSpan: string;
  warrant: string;
  threatensCondition: ConditionId;
  distinctionAtRisk: DistinctionId;
  scope: "current_scenario";
};


export type DomainCatalog = {
  values: Record<
    string,
    {
      label: string;
      distinctions: string[];
      corruptedForms: string[];
    }
  >;

  distinctions: Record<
    string,
    {
      label: string;
      preservedBy: string[];
    }
  >;

  conditions: Record<
    string,
    {
      label: string;
    }
  >;

  pressures: Record<
    string,
    {
      label: string;
      function: string;
      threatens: string[];
    }
  >;

  boundaries: Record<
    string,
    {
      label: string;
      protects: string[];
    }
  >;

  protocols: Record<
    string,
    {
      label: string;
      protects: string[];
      handlesPressures: string[];
      scripts: {
        first: string;
        repeat: string;
        exit: string;
      };
    }
  >;

  tests: Record<
    string,
    {
      label: string;
      reveals: string[];
    }
  >;
};

