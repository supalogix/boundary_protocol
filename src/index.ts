import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { RoundEngine } from "./engine/RoundEngine";
import { SentenceFunctionEngine } from "./engine/SentenceFunctionEngine";
import { FileDomainCatalogProvider } from "./providers/FileDomainCatalogProvider";
import { FileScenarioProvider } from "./providers/FileScenarioProvider";
import { FileSentenceFunctionScenarioProvider } from "./providers/FileSentenceFunctionScenarioProvider";
import { FileTaxonomyProvider } from "./providers/FileTaxonomyProvider";
import { filterByTaxonomy } from "./domain/filterByTaxonomy";
import type { PressureId, ScenarioFrame } from "./domain/types";
import type {
  SentenceFunctionQuestion,
  SentenceFunctionScenario,
} from "./domain/sentenceFunctionTypes";
import type { TaxonomyCategory } from "./domain/taxonomyTypes";

const rl = readline.createInterface({ input, output });

async function askGameChoice(): Promise<string> {
  console.log("\n====================================");
  console.log(" Boundary Protocol Console");
  console.log("====================================\n");

  console.log("Choose a game:");
  console.log("1. Identify Pressure Pattern");
  console.log("2. What Is the Sentence Doing?");
  console.log("q. Quit");

  return rl.question("\n> ");
}

async function chooseTaxonomyCategory(
  categories: TaxonomyCategory[]
): Promise<TaxonomyCategory | null> {
  console.log("\nChoose a sentence-function category:\n");

  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.label}`);
    console.log(`   ${category.description}`);
  });

  console.log("q. Back");

  const answer = (await rl.question("\n> ")).trim().toLowerCase();

  if (answer === "q") {
    return null;
  }

  const index = Number(answer) - 1;
  return categories[index] ?? null;
}

function findPressureChoiceByIndex(
  scenario: ScenarioFrame,
  answer: string
): PressureId | null {
  const index = Number(answer.trim()) - 1;
  return scenario.choices[index] ?? null;
}

async function runIdentifyPressurePattern(): Promise<void> {
  const catalogProvider = new FileDomainCatalogProvider(
    "data/catalogs/domainCatalog.json"
  );

  const catalog = await catalogProvider.loadCatalog();

  const provider = new FileScenarioProvider({
    filePath: "data/scenarios.json",
    catalog,
  });

  const scenarios = await provider.loadScenarios();

  if (scenarios.length === 0) {
    console.log("\nNo Identify Pressure Pattern scenarios found.");
    return;
  }

  const engine = new RoundEngine();
  let correctCount = 0;

  console.log("\n=== Identify Pressure Pattern ===\n");

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];

    engine.reset();
    engine.start(scenario);

    console.log(`\n--- Question ${i + 1} ---\n`);
    console.log(`Scenario:\n"${scenario.prompt}"\n`);

    scenario.choices.forEach((choice, index) => {
      console.log(`${index + 1}. ${choice}`);
    });

    const answer = await rl.question("\nChoose the pressure pattern: ");
    const selected = findPressureChoiceByIndex(scenario, answer);

    if (!selected) {
      console.log("\nInvalid choice. Marked incorrect.");
      engine.complete();
      continue;
    }

    engine.submitPressureChoice(selected);

    const state = engine.getState();

    if (state.status !== "feedback") {
      throw new Error("Expected feedback state.");
    }

    if (state.correct) {
      correctCount++;
      console.log("\nCorrect.\n");
    } else {
      console.log(`\nNot quite. You chose "${state.selected}".\n`);
    }

    console.log(`Correct pressure pattern: ${state.claim.pressure}`);
    console.log(`Evidence: "${state.claim.evidenceSpan}"`);
    console.log(`Warrant: ${state.claim.warrant}`);
    console.log(`Value at stake: ${state.scenario.conceptualFrame.value}`);
    console.log(
      `Distinction at risk: ${state.scenario.conceptualFrame.distinction}`
    );
    console.log(`Condition threatened: ${state.claim.threatensCondition}`);
    console.log(`Protocol family: ${state.scenario.conceptualFrame.protocol}`);
    console.log(`\nExplanation: ${state.scenario.explanation}`);

    engine.complete();
  }

  console.log("\n=== Score ===");
  console.log(`${correctCount}/${scenarios.length}`);

  console.log("\n=== Event Log ===");
  console.log(JSON.stringify(engine.getEvents(), null, 2));
}

async function askChoiceById(
  question: SentenceFunctionQuestion
): Promise<string> {
  console.log(`\n${question.prompt}\n`);

  for (const choice of question.choices) {
    console.log(`${choice.id}. ${choice.text}`);
  }

  return (await rl.question("\n> ")).trim().toUpperCase();
}

async function runSentenceFunctionGame(
  taxonomyCategory: TaxonomyCategory
): Promise<void> {
  const provider = new FileSentenceFunctionScenarioProvider({
    filePath: "data/sentenceFunctionScenarios.json",
  });

  const allScenarios = await provider.loadScenarios();
  const scenarios = filterByTaxonomy(allScenarios, taxonomyCategory.id);

  if (scenarios.length === 0) {
    console.log(
      `\nNo What Is the Sentence Doing scenarios found for "${taxonomyCategory.label}".`
    );
    return;
  }

  const engine = new SentenceFunctionEngine();

  let totalScore = 0;
  const maxScore = scenarios.length * 100;

  console.log(`\n=== What Is the Sentence Doing?: ${taxonomyCategory.label} ===\n`);

  for (let i = 0; i < scenarios.length; i++) {
    const scenario: SentenceFunctionScenario = scenarios[i];

    engine.reset();
    engine.start(scenario);

    console.log(`\n--- Question ${i + 1} ---`);
    console.log(`Category: ${scenario.category}`);
    console.log(`Difficulty: Level ${scenario.difficulty}\n`);
    console.log(`Context:\n${scenario.context}\n`);
    console.log(`Sentence:\n"${scenario.sentence}"\n`);

    const surfaceChoiceId = await askChoiceById(scenario.surfaceQuestion);
    const functionChoiceId = await askChoiceById(scenario.functionQuestion);
    const countermoveChoiceId = await askChoiceById(
      scenario.countermoveQuestion
    );

    engine.submitAnswers({
      surfaceChoiceId,
      functionChoiceId,
      countermoveChoiceId,
    });

    const state = engine.getState();

    if (state.status !== "feedback") {
      throw new Error("Expected feedback state.");
    }

    totalScore += state.result.totalScore;

    console.log("\n--- Feedback ---\n");

    console.log(
      `Surface meaning: ${
        state.result.surfaceCorrect ? "Correct" : "Incorrect"
      }`
    );

    console.log(
      `Functional meaning: ${
        state.result.functionCorrect ? "Correct" : "Incorrect"
      }`
    );

    console.log(
      `Countermove: ${
        state.result.countermoveCorrect ? "Correct" : "Incorrect"
      }`
    );

    console.log(`\nSurface meaning:\n${scenario.surfaceMeaning}`);
    console.log(`\nFunctional meaning:\n${scenario.functionalMeaning}`);
    console.log(`\nHidden move:\n${scenario.hiddenMove}`);
    console.log(`\nCounter-skill:\n${scenario.counterSkill}`);
    console.log(`\nExample response:\n"${scenario.exampleResponse}"`);
    console.log(`\nUnlocked: ${scenario.unlockedFunctionCard}`);
    console.log(`\nRound score: ${state.result.totalScore}/100`);

    engine.complete();
  }

  console.log("\n=== Final Score ===");
  console.log(`${totalScore}/${maxScore}`);

  console.log("\n=== Event Log ===");
  console.log(JSON.stringify(engine.getEvents(), null, 2));
}

async function main(): Promise<void> {
  const taxonomyProvider = new FileTaxonomyProvider("data/taxonomy.json");
  const taxonomy = await taxonomyProvider.loadTaxonomy();

  while (true) {
    const gameChoice = (await askGameChoice()).trim().toLowerCase();

    if (gameChoice === "q") {
      break;
    }

    if (gameChoice === "1") {
      await runIdentifyPressurePattern();
      continue;
    }

    if (gameChoice === "2") {
      const taxonomyCategory = await chooseTaxonomyCategory(taxonomy.categories);

      if (!taxonomyCategory) {
        continue;
      }

      await runSentenceFunctionGame(taxonomyCategory);
      continue;
    }

    console.log("\nUnknown game choice.");
  }

  rl.close();
}

main().catch((error) => {
  console.error("\nError:");
  console.error(error instanceof Error ? error.message : String(error));
  rl.close();
});