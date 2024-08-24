import { v4 as uuidv4 } from 'uuid';

interface OutputDisplayProps {
  output: string[];
  asciiArt?: string[];
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, asciiArt }) => {
  return (
    <div className="mb-4">
      {asciiArt && (
        <pre className="mb-4">
          {asciiArt.map((line) => (
            <div key={uuidv4()}>{line}</div>
          ))}
        </pre>
      )}
      {output.map((line) => (
        <div key={uuidv4()} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}
    </div>
  );
};
