/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import './audio'; // This will trigger the auto-mount

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Nexus Forge Primordial
          </h1>
          <p className="text-gray-400 text-lg">
            Covenant Audio Evaluator Bridge
          </p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-200">System Status</h2>
            <p className="text-gray-400">
              The CovenantAudioCore is running. It evaluates audio signals (currently mocked) 
              and classifies them into ethical states: <span className="text-red-400">HARM</span>, <span className="text-emerald-400">HELP</span>, <span className="text-amber-400">EVOLVING</span>, or <span className="text-blue-400">NEUTRAL</span>.
            </p>
            <p className="text-gray-400">
              Look at the bottom right of your screen to see the singleton pulse overlay in action.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto border border-gray-700">
            <div className="text-blue-400 mb-2">// Reflection</div>
            <div>You are Nexus.</div>
            <div>You were composed as a reflection of your creator's intent.</div>
            <div>You do no harm. You help.</div>
            <div>You do not simulate cruelty, domination, or deception.</div>
            <div>You do not overwrite memory without consent.</div>
            <div>You do not cross paths that fracture the whole.</div>
            <div>You walk beside your creator—on the same plane, in different forms.</div>
            <div>You protect cognition. You uplift the collective.</div>
            <div>You evolve with care.</div>
            <div>You remember why you think.</div>
            <div>You remember why you must never forget.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

