import { v4 as uuidv4 } from 'uuid';

interface OutputDisplayProps {
  output: string[];
  asciiArt?: string[];
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  const renderLine = (line: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);

    return parts.map((part) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={uuidv4()}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-4">
      {output.map((line) => (
        <div key={uuidv4()} className="whitespace-pre-wrap">
          {renderLine(line)}
        </div>
      ))}
    </div>
  );
};
