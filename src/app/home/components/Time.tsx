type TimeProps = {
    timer: number;
};

export default function Time({ timer }: TimeProps) {
    return <span className="text-4xl font-bold text-gray-400">{timer}</span>;
}
