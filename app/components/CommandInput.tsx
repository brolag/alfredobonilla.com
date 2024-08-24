interface CommandInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  showPrompt: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  input,
  setInput,
  handleKeyDown,
  inputRef,
  showPrompt,
}) => {
  return (
    <div className="flex items-center">
      <span className="mr-2">{showPrompt ? '>' : ' '}</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className="bg-black text-green-500 outline-none flex-grow"
        autoFocus
      />
    </div>
  );
};
