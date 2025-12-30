'use client';

import { useState } from 'react';
import { StockfishClient } from '../../lib/stockfish-client';
import { parsePGN } from '../../lib/pgn-parser';

export default function StockfishTestPage() {
  const [pgn, setPgn] = useState(`[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.12.25"]
[White "chess_machine76"]
[Black "TheTuraib"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d6 9. O-O O-O 10. Rfe1 Re8 11. a3 a6 12. h3 h6 13. b4 Be6 14. Bxe6 Rxe6 15. Rc1 Re8 16. Qb3 Qe7 17. Rc3 Rae8 18. Rce3 d5 19. exd5 Nxd5 20. Nxd5 Qxd5 21. Ne5 Qb5 22. Qxb5 axb5 23. Rxe8+ Rxe8 24. Rxe8+ Nxe8 25. Nc6 b4 26. axb4 Nxc6 27. b5 Ne7 28. b6 c6 29. f4 Nd5 30. Kf2 Nxb6 31. Ke3 Nc4+ 32. Kd4 Nxb2 33. Kc5 Nd3 34. Kd6 Nf4 35. g3 Ne6 36. h4 f6 37. h5 Kf7 38. Kc7 Kf8 39. h6 Kg8 40. Kd6 Kf8 41. Ke5 Ke8 42. f5 Kf7 43. f6 g6 44. hxg6+ hxg6 45. Kd6 Ke8 46. Ke5 Kf7 47. Kd6 Ke8 48. Ke5 Kf7 49. Kd6 Ke8 1/2-1/2`);
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState('Ready');
  const [isRunning, setIsRunning] = useState(false);

  const appendLog = (text: string, type: 'pass' | 'fail' | 'info' = 'info') => {
    setResults(prev => [...prev, text]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runTests = async () => {
    clearResults();
    setIsRunning(true);
    setStatus('Initializing...');

    try {
      const StockfishModule = await import('../../lib/stockfish-client');
      const client = new StockfishModule.StockfishClient();

      appendLog('=== Stockfish Client Test Results ===\n', 'info');

      appendLog('Waiting for engine to be ready...', 'info');
      const ready = await client.isReady();

      if (!ready) {
        appendLog('❌ FAIL: Engine initialization failed', 'fail');
        setStatus('Failed');
        setIsRunning(false);
        return;
      }

      appendLog('✅ PASS: Engine initialized successfully', 'pass');
      setStatus('Running tests...');

      appendLog('\nTesting position evaluation...', 'info');
      const evalStart = Date.now();
      const evaluation = await client.evaluatePosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 10);
      const evalDuration = Date.now() - evalStart;

      if (evaluation && evaluation.score !== undefined) {
        appendLog(`✅ PASS: Position evaluation (${evalDuration}ms)`, 'pass');
        appendLog(`   Score: ${evaluation.score}, Depth: ${evaluation.depth}`, 'info');
      } else {
        appendLog('❌ FAIL: Position evaluation failed', 'fail');
      }

      appendLog('\nTesting move classification...', 'info');
      const classification = client.classifyMove(
        { score: 100, depth: 15 },
        { score: -150, depth: 15 }
      );

      if (classification === 'blunder') {
        appendLog('✅ PASS: Move classification', 'pass');
        appendLog(`   Classification: ${classification}`, 'info');
      } else {
        appendLog('❌ FAIL: Move classification unexpected result', 'fail');
      }

      appendLog('\nTesting full game analysis...', 'info');
      setStatus('Analyzing game...');
      const analysisStart = Date.now();

      const parsed = parsePGN(pgn);

      if (!parsed) {
        appendLog('❌ FAIL: PGN parsing failed', 'fail');
        setStatus('Failed');
        setIsRunning(false);
        return;
      }

      const engineData = await client.analyzeGame(parsed);
      const analysisDuration = Date.now() - analysisStart;

      if (engineData && engineData.evaluations.size > 0) {
        appendLog(`✅ PASS: Full game analysis (${analysisDuration}ms)`, 'pass');
        appendLog(`   PGN Hash: ${engineData.pgnHash.substring(0, 16)}...`, 'info');
        appendLog(`   Positions: ${engineData.positions.length}`, 'info');
        appendLog(`   Evaluations: ${engineData.evaluations.size}`, 'info');
        appendLog(`   Key Positions: ${engineData.keyPositions.length}`, 'info');
        appendLog(`   Sample key positions: ${engineData.keyPositions.slice(0, 5).join(', ')}`, 'info');

        appendLog('\n=== Sample Evaluations ===', 'info');
        let sampleCount = 0;
        for (const [moveNum, analysis] of engineData.evaluations) {
          if (sampleCount >= 10) break;
          const sign = analysis.evaluation.score > 0 ? '+' : '';
          appendLog(`   Move ${moveNum + 1}: ${analysis.san} = ${sign}${analysis.evaluation.score}cp (${analysis.classification})`, 'info');
          sampleCount++;
        }
      } else {
        appendLog('❌ FAIL: Full game analysis failed', 'fail');
      }

      appendLog('\n=== All Tests Completed ===\n', 'info');
      setStatus('Tests completed');

      client.terminate();

    } catch (error) {
      appendLog(`\n❌ FAIL: ${error instanceof Error ? error.message : 'Unknown error'}`, 'fail');
      console.error(error);
      setStatus('Test failed');
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold text-green-500 mb-8">Stockfish Client Test</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

        <label className="block mb-2 font-medium">PGN to test:</label>
        <textarea
          className="w-full h-48 bg-gray-900 text-gray-100 border border-gray-700 rounded p-4 font-mono text-sm resize-y mb-4"
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
          placeholder="Paste PGN here..."
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run All Tests'}
          </button>
          <button
            onClick={clearResults}
            disabled={isRunning}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Clear Results
          </button>
        </div>

        <p className="text-gray-400">Status: {status}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <pre className="font-mono text-sm whitespace-pre-wrap">
          {results.length === 0 ? 'Test results will appear here...' : results.map((r, i) => (
            <div key={i} className={
              r.includes('✅ PASS') ? 'text-green-500' :
              r.includes('❌ FAIL') ? 'text-red-500' :
              'text-blue-400'
            }>
              {r}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
