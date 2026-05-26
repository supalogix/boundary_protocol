type Choice = {
  id: string;
  text: string;
};

type Props = {
  title: string;
  prompt: string;
  choices: Choice[];
  selectedChoiceId: string | null;
  disabled: boolean;
  onSelect: (choiceId: string) => void;
};

export function QuestionBlock({
  title,
  prompt,
  choices,
  selectedChoiceId,
  disabled,
  onSelect,
}: Props) {
  return (
    <div className="questionBlock">
      <h3>{title}</h3>
      <p>{prompt}</p>

      <div className="choiceGrid">
        {choices.map((choice) => (
          <button
            key={choice.id}
            disabled={disabled}
            className={selectedChoiceId === choice.id ? "selected" : ""}
            onClick={() => onSelect(choice.id)}
          >
            <strong>{choice.id}.</strong> {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}