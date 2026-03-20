import Link from 'next/link';
import { problems } from '@/lib/problems';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">MockPrep</h1>
          <p className="text-gray-400 text-lg">AI-powered mock technical interviews</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Choose a Problem</h2>
          {problems.map((problem) => (
            <Link
              key={problem.id}
              href={`/interview/${problem.id}`}
              className="block bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 hover:bg-gray-750 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {problem.description.split('\n')[0]}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 px-3 py-1 rounded-full text-sm font-medium capitalize ${difficultyColors[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          45 minute sessions • AI-powered feedback
        </p>
      </div>
    </main>
  );
}
