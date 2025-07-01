type WordCountDisplayProps = {
    count: number;
    target: number;
};

const WordCountDisplay = ({ count, target }: WordCountDisplayProps) => {
    return (
        <span className="text-4xl font-bold text-secondary">
            {count} / {target}
        </span>
    );
};

export default WordCountDisplay;
