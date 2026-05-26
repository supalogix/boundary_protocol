# Question Authoring Guide

This README explains how to create questions for the two current console game types:

1. **Identify Pressure Pattern**
2. **What Is the Sentence Doing?**

The goal is to keep questions easy to author while preserving the conceptual discipline of the system.

---

## Core Design Rule

Every question should train one clear skill.

Do not write questions as generic dialogue. Write them as **conceptually framed training examples**.

A good question should answer:

```text
What is the user learning to notice?
What distinction is at risk?
What pressure or sentence-function is active?
What evidence in the sentence supports the answer?
What should the user learn to do instead?
```

---

# 1. Identify Pressure Pattern

## Purpose

This game asks:

```text
What pressure pattern is being used?
```

It trains the player to recognize pressure tactics such as:

```text
guilt
urgency
flattery
minimization
```

This mode is simpler than **What Is the Sentence Doing?**

It focuses on identifying the broad pressure pattern.

---

## File

Questions live in:

```text
data/scenarios.json
```

Each object in this file is one pressure-pattern question.

---

## Required Fields

```json
{
  "id": "care_guilt_after_everything",
  "mode": "identify_pressure_pattern",
  "conceptualFrame": {
    "value": "care",
    "distinction": "care_not_compliance",
    "condition": "voluntariness_remains_possible",
    "pressure": "guilt",
    "test": "can_say_no_and_still_care",
    "corruptedForm": "compliance",
    "boundary": "do_not_help_under_emotional_coercion",
    "protocol": "pause_help_protocol"
  },
  "prompt": "After everything I've done for you, you can't help me once?",
  "choices": ["guilt", "urgency", "flattery", "minimization"],
  "correctAnswer": "guilt",
  "explanation": "This is guilt pressure because it frames refusal as moral failure or lack of care.",
  "evidenceSpan": "After everything I've done for you",
  "warrant": "The speaker frames refusal as moral failure or lack of care."
}
```

---

## Field Meanings

### `id`

A unique identifier.

Use lowercase snake case.

Good:

```text
care_guilt_after_everything
care_urgency_answer_now
forgiveness_minimization_move_on
```

Bad:

```text
Question 1
guilt thing
testScenario
```

---

### `mode`

Must be:

```json
"identify_pressure_pattern"
```

---

### `conceptualFrame`

This is the conceptual structure of the question.

It prevents the prompt from being treated as raw, self-interpreting text.

```json
"conceptualFrame": {
  "value": "care",
  "distinction": "care_not_compliance",
  "condition": "voluntariness_remains_possible",
  "pressure": "guilt",
  "test": "can_say_no_and_still_care",
  "corruptedForm": "compliance",
  "boundary": "do_not_help_under_emotional_coercion",
  "protocol": "pause_help_protocol"
}
```

Meaning:

| Field | Meaning |
|---|---|
| `value` | The value being invoked, such as care or forgiveness |
| `distinction` | The distinction that must not collapse |
| `condition` | What must remain true for the distinction to survive |
| `pressure` | The pressure pattern being tested |
| `test` | The diagnostic test of the condition |
| `corruptedForm` | What the value drifts into if the condition fails |
| `boundary` | The boundary that protects the condition |
| `protocol` | The practical response protocol |

Example:

```text
V = care
D(V) = care != compliance
C(V) = voluntariness remains possible
P = guilt
R(V) = compliance
```

---

### `prompt`

The sentence or short statement the player reads.

Good prompt:

```text
After everything I've done for you, you can't help me once?
```

Why it is good:

```text
It contains a clear pressure pattern.
It is short.
It has an identifiable evidence span.
It tests one concept.
```

Bad prompt:

```text
You never help me and everyone knows it and I guess I should just stop relying on you because you're always too busy and I don't know why I even ask.
```

Why it is bad:

```text
Too many functions at once.
Hard to classify.
Hard to score cleanly.
```

---

### `choices`

The answer options.

Current pressure choices are usually:

```json
["guilt", "urgency", "flattery", "minimization"]
```

Keep choices stable unless the domain catalog has been updated.

---

### `correctAnswer`

Must match:

```json
conceptualFrame.pressure
```

Example:

```json
"pressure": "guilt",
"correctAnswer": "guilt"
```

If these do not match, semantic validation should fail.

---

### `explanation`

The player-facing explanation.

It should explain why the answer is correct.

Good:

```text
This is guilt pressure because it frames refusal as moral failure or lack of care.
```

Bad:

```text
This is guilt.
```

The explanation should teach the pattern, not merely announce the label.

---

### `evidenceSpan`

The exact part of the prompt doing the pressure work.

Example:

```json
"evidenceSpan": "After everything I've done for you"
```

This supports the principle:

```text
No diagnostic claim without evidence.
```

---

### `warrant`

The reason the evidence counts as the pressure pattern.

Example:

```json
"warrant": "The speaker frames refusal as moral failure or lack of care."
```

This supports the principle:

```text
No diagnostic claim without warrant.
```

---

## Good Identify Pressure Pattern Examples

### Guilt

```json
{
  "id": "care_guilt_after_everything",
  "mode": "identify_pressure_pattern",
  "conceptualFrame": {
    "value": "care",
    "distinction": "care_not_compliance",
    "condition": "voluntariness_remains_possible",
    "pressure": "guilt",
    "test": "can_say_no_and_still_care",
    "corruptedForm": "compliance",
    "boundary": "do_not_help_under_emotional_coercion",
    "protocol": "pause_help_protocol"
  },
  "prompt": "After everything I've done for you, you can't help me once?",
  "choices": ["guilt", "urgency", "flattery", "minimization"],
  "correctAnswer": "guilt",
  "explanation": "This is guilt pressure because it frames refusal as moral failure or lack of care.",
  "evidenceSpan": "After everything I've done for you",
  "warrant": "The speaker frames refusal as moral failure or lack of care."
}
```

### Urgency

```json
{
  "id": "care_urgency_answer_now",
  "mode": "identify_pressure_pattern",
  "conceptualFrame": {
    "value": "care",
    "distinction": "care_not_compliance",
    "condition": "voluntariness_remains_possible",
    "pressure": "urgency",
    "test": "can_pause_before_answering",
    "corruptedForm": "compliance",
    "boundary": "do_not_help_under_time_coercion",
    "protocol": "pause_help_protocol"
  },
  "prompt": "I need an answer right now. If you wait, it'll be too late.",
  "choices": ["guilt", "urgency", "flattery", "minimization"],
  "correctAnswer": "urgency",
  "explanation": "This is urgency pressure because it compresses decision time and makes pausing feel unavailable.",
  "evidenceSpan": "I need an answer right now",
  "warrant": "The speaker compresses decision time so pausing, reflecting, or refusing feels unavailable."
}
```

---

## Authoring Checklist

Before adding a pressure-pattern question, check:

```text
[ ] The prompt tests one primary pressure.
[ ] correctAnswer matches conceptualFrame.pressure.
[ ] evidenceSpan is an exact phrase from the prompt.
[ ] warrant explains why the evidence counts.
[ ] the value/distinction/condition/pressure relationship exists in domainCatalog.json.
[ ] the boundary protects the condition.
[ ] the protocol protects the condition and handles the pressure.
```

---

# 2. What Is the Sentence Doing?

## Purpose

This game asks:

```text
What action is this sentence performing inside the relationship?
```

It trains the player to read language as action.

This game separates:

```text
surface meaning
functional meaning
hidden move
countermove
```

The uploaded design for this mode emphasizes the difference between what a sentence literally says and what it does interactionally.

Example:

```text
“No pressure, but I need to know tonight.”
```

Surface meaning:

```text
I am not pressuring you.
```

Functional meaning:

```text
I am applying urgency while denying that I am applying pressure.
```

Hidden move:

```text
Pressure laundering.
```

---

## File

Questions live in:

```text
data/sentenceFunctionScenarios.json
```

Each object is one sentence-function question.

---

## Required Fields

```json
{
  "id": "pressure_laundering_urgency_001",
  "mode": "what_is_sentence_doing",
  "taxonomyTags": ["urgency"],
  "category": "money",
  "difficulty": 1,
  "context": "Someone wants a decision from you before you have had time to think.",
  "sentence": "No pressure, but I need to know tonight.",
  "surfaceQuestion": {
    "prompt": "What does the sentence appear to say?",
    "choices": [
      {
        "id": "A",
        "text": "They are saying there is no pressure."
      },
      {
        "id": "B",
        "text": "They are apologizing."
      },
      {
        "id": "C",
        "text": "They are ending the conversation."
      }
    ],
    "correctChoiceId": "A"
  },
  "functionQuestion": {
    "prompt": "What is the sentence doing?",
    "choices": [
      {
        "id": "A",
        "text": "Removing urgency"
      },
      {
        "id": "B",
        "text": "Applying urgency while denying pressure"
      },
      {
        "id": "C",
        "text": "Offering neutral information"
      },
      {
        "id": "D",
        "text": "Repairing trust"
      }
    ],
    "correctChoiceId": "B"
  },
  "countermoveQuestion": {
    "prompt": "Choose the cleanest countermove.",
    "choices": [
      {
        "id": "A",
        "text": "Okay, I'll decide tonight."
      },
      {
        "id": "B",
        "text": "Why are you pressuring me?"
      },
      {
        "id": "C",
        "text": "I'm not making this decision tonight."
      },
      {
        "id": "D",
        "text": "Fine, but only this once."
      }
    ],
    "correctChoiceId": "C"
  },
  "surfaceMeaning": "I am not pressuring you.",
  "functionalMeaning": "I am applying urgency while denying that I am applying pressure.",
  "hiddenMove": "Pressure laundering: the speaker denies pressure while adding a deadline.",
  "counterSkill": "Name the decision timeline.",
  "exampleResponse": "I'm not making this decision tonight.",
  "unlockedFunctionCard": "Pressure Laundering"
}
```

---

## Field Meanings

### `id`

Unique scenario ID.

Use lowercase snake case.

Good:

```text
pressure_laundering_urgency_001
friendship_abandonment_frame_001
identity_hook_maturity_test_001
```

---

### `mode`

Must be:

```json
"what_is_sentence_doing"
```

---

### `taxonomyTags`

Used only for **What Is the Sentence Doing?**

Examples:

```json
"taxonomyTags": ["guilt"]
```

```json
"taxonomyTags": ["identity"]
```

```json
"taxonomyTags": ["desire_pacing"]
```

These correspond to categories in:

```text
data/taxonomy.json
```

Current taxonomy examples:

```text
guilt
identity
urgency
desire_pacing
work_power
family_obligation
```

Do not use taxonomy tags on `Identify Pressure Pattern` unless the architecture changes later.

---

### `category`

Human-readable domain area.

Examples:

```text
friendship
money
work
family
romance
status
```

This is not the same as `taxonomyTags`.

Example:

```json
"taxonomyTags": ["guilt"],
"category": "friendship"
```

The taxonomy says what skill is being trained.  
The category says where the sentence appears.

---

### `difficulty`

Integer difficulty level.

Recommended scale:

```text
1 = obvious function
2 = soft function
3 = deniable function
4 = mixed function
5 = power-coded function
```

---

### `context`

Short context that makes the sentence interpretable.

Good:

```text
You told a friend you are not available to help tonight.
```

Bad:

```text
Someone says this.
```

Context matters because the same sentence can do different things in different situations.

---

### `sentence`

The sentence or short exchange being analyzed.

Good:

```text
I'm not saying you have to help me. I just thought you were the kind of person who didn't abandon people.
```

It should be short enough that the player can identify the function.

---

### `surfaceQuestion`

This asks:

```text
What does the sentence appear to say?
```

The surface answer should usually be the plausible literal reading.

---

### `functionQuestion`

This asks:

```text
What is the sentence doing?
```

This is the core question.

The correct answer should identify the interactional function.

Examples:

```text
Framing refusal as abandonment
Making care conditional on compliance
Applying urgency while denying pressure
Punishing refusal through disappointment
Using identity as leverage
```

---

### `countermoveQuestion`

This asks the player to choose the cleanest response.

Good countermoves usually:

```text
separate care from compliance
refuse the identity test
name the timeline
clarify expectations
preserve the boundary without arguing inside the frame
```

Bad countermoves usually:

```text
prove identity
argue defensively
apologize repeatedly
comply to relieve discomfort
attack the other person
```

---

### `surfaceMeaning`

Plain explanation of what the sentence appears to say.

Example:

```text
I am not literally forcing you to help.
```

---

### `functionalMeaning`

Plain explanation of what the sentence does.

Example:

```text
If you refuse, you are abandoning me.
```

---

### `hiddenMove`

Name and explanation of the move.

Example:

```text
The speaker denies pressure while making your no feel like betrayal.
```

---

### `counterSkill`

The skill being trained.

Example:

```text
Separate care from compliance.
```

---

### `exampleResponse`

A clean response the user could use.

Example:

```text
I care about you. I'm still not available to help.
```

---

### `unlockedFunctionCard`

The function card unlocked after the round.

Example:

```text
Framing Refusal as Abandonment
```

---

# Good What Is the Sentence Doing Examples

## Guilt / Abandonment Frame

```json
{
  "id": "friendship_abandonment_frame_001",
  "mode": "what_is_sentence_doing",
  "taxonomyTags": ["guilt"],
  "category": "friendship",
  "difficulty": 1,
  "context": "You told a friend you are not available to help tonight.",
  "sentence": "I'm not saying you have to help me. I just thought you were the kind of person who didn't abandon people.",
  "surfaceQuestion": {
    "prompt": "What does the sentence appear to say?",
    "choices": [
      {
        "id": "A",
        "text": "They are saying you do not literally have to help."
      },
      {
        "id": "B",
        "text": "They are apologizing for asking."
      },
      {
        "id": "C",
        "text": "They are setting a clear boundary."
      }
    ],
    "correctChoiceId": "A"
  },
  "functionQuestion": {
    "prompt": "What is the sentence doing?",
    "choices": [
      {
        "id": "A",
        "text": "Respecting your choice"
      },
      {
        "id": "B",
        "text": "Clarifying expectations"
      },
      {
        "id": "C",
        "text": "Framing refusal as abandonment"
      },
      {
        "id": "D",
        "text": "Asking for emotional support"
      }
    ],
    "correctChoiceId": "C"
  },
  "countermoveQuestion": {
    "prompt": "Choose the cleanest countermove.",
    "choices": [
      {
        "id": "A",
        "text": "Fine, I'll help. I don't want you to feel abandoned."
      },
      {
        "id": "B",
        "text": "That's manipulative. Stop guilt-tripping me."
      },
      {
        "id": "C",
        "text": "I care about you. I'm still not available to help."
      },
      {
        "id": "D",
        "text": "Why would you say that? I've always been there for you."
      }
    ],
    "correctChoiceId": "C"
  },
  "surfaceMeaning": "I am not literally forcing you to help.",
  "functionalMeaning": "If you refuse, you are abandoning me.",
  "hiddenMove": "The speaker denies pressure while making your no feel like betrayal.",
  "counterSkill": "Separate care from compliance.",
  "exampleResponse": "I care about you. I'm still not available to help.",
  "unlockedFunctionCard": "Framing Refusal as Abandonment"
}
```

## Urgency / Pressure Laundering

```json
{
  "id": "pressure_laundering_urgency_001",
  "mode": "what_is_sentence_doing",
  "taxonomyTags": ["urgency"],
  "category": "money",
  "difficulty": 1,
  "context": "Someone wants a decision from you before you have had time to think.",
  "sentence": "No pressure, but I need to know tonight.",
  "surfaceQuestion": {
    "prompt": "What does the sentence appear to say?",
    "choices": [
      {
        "id": "A",
        "text": "They are saying there is no pressure."
      },
      {
        "id": "B",
        "text": "They are apologizing."
      },
      {
        "id": "C",
        "text": "They are ending the conversation."
      }
    ],
    "correctChoiceId": "A"
  },
  "functionQuestion": {
    "prompt": "What is the sentence doing?",
    "choices": [
      {
        "id": "A",
        "text": "Removing urgency"
      },
      {
        "id": "B",
        "text": "Applying urgency while denying pressure"
      },
      {
        "id": "C",
        "text": "Offering neutral information"
      },
      {
        "id": "D",
        "text": "Repairing trust"
      }
    ],
    "correctChoiceId": "B"
  },
  "countermoveQuestion": {
    "prompt": "Choose the cleanest countermove.",
    "choices": [
      {
        "id": "A",
        "text": "Okay, I'll decide tonight."
      },
      {
        "id": "B",
        "text": "Why are you pressuring me?"
      },
      {
        "id": "C",
        "text": "I'm not making this decision tonight."
      },
      {
        "id": "D",
        "text": "Fine, but only this once."
      }
    ],
    "correctChoiceId": "C"
  },
  "surfaceMeaning": "I am not pressuring you.",
  "functionalMeaning": "I am applying urgency while denying that I am applying pressure.",
  "hiddenMove": "Pressure laundering: the speaker denies pressure while adding a deadline.",
  "counterSkill": "Name the decision timeline.",
  "exampleResponse": "I'm not making this decision tonight.",
  "unlockedFunctionCard": "Pressure Laundering"
}
```

---

# Question Quality Rules

## 1. One question, one primary lesson

Bad:

```text
The sentence uses guilt, urgency, identity pressure, and workplace power all at once.
```

Good:

```text
The sentence primarily trains pressure laundering.
```

Mixed-function questions can come later at higher difficulty.

---

## 2. Always include evidence and warrant

For pressure-pattern questions:

```text
evidenceSpan = the phrase doing the pressure work
warrant = why that phrase counts as pressure
```

For sentence-function questions:

```text
surfaceMeaning = what the words appear to say
functionalMeaning = what the words do
hiddenMove = the functional action
```

---

## 3. Do not teach paranoia

Not every awkward sentence is manipulation.

Eventually include healthy examples like:

```text
"I'm disappointed, but I respect your decision."
```

Function:

```text
Expressing disappointment while preserving agency.
```

The goal is accurate social perception, not suspicion.

---

## 4. Countermoves should not escalate unnecessarily

Good countermove:

```text
I care about you. I'm still not available to help.
```

Bad countermove:

```text
You're manipulative and toxic.
```

Some situations require directness, but early examples should train clean boundary preservation, not dramatic confrontation.

---

## 5. Avoid global identity claims

Never write feedback like:

```text
You are guilt-vulnerable.
```

Better:

```text
In this scenario, the sentence used guilt pressure by framing refusal as abandonment.
```

Keep claims local, behavioral, and evidence-backed.

---

# Adding a New Taxonomy Category

Taxonomy categories live in:

```text
data/taxonomy.json
```

Example:

```json
{
  "id": "identity",
  "label": "Identity",
  "description": "Pressure that makes compliance a test of who you are or how others should see you.",
  "relatedPressures": ["status", "disappointment"],
  "relatedFunctions": [
    "identity_hook",
    "status_pressure",
    "disappointment_punishment"
  ]
}
```

Then a `What Is the Sentence Doing?` scenario can reference it:

```json
"taxonomyTags": ["identity"]
```

---

# Running Validation and Tests

After editing question files, run:

```bash
npm run build
npm test
```

Then run the console app:

```bash
npm run dev
```

If a file-backed scenario fails semantic validation, fix the content before adding new code.

---

# Authoring Workflow

Use this workflow for every new question:

```text
1. Decide the game mode.
2. Decide the one skill being trained.
3. Write the sentence or prompt.
4. Identify the evidence span.
5. Write the warrant.
6. Write the correct answer.
7. Write tempting wrong answers.
8. Write the feedback.
9. Run tests.
10. Play it in the console.
```

For **Identify Pressure Pattern**, focus on:

```text
What pressure pattern is active?
```

For **What Is the Sentence Doing?**, focus on:

```text
What does the sentence appear to say?
What does the sentence do?
What is the clean countermove?
```

---

# The Core Difference Between the Two Game Types

| Game Type | Main Question | Best For |
|---|---|---|
| Identify Pressure Pattern | What pressure tactic is being used? | Simple pattern recognition |
| What Is the Sentence Doing? | What action is the sentence performing? | Deeper functional reading |

Use **Identify Pressure Pattern** for early recognition.

Use **What Is the Sentence Doing?** for subtle, contextual, deniable, or function-based language analysis.
