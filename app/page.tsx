import React from 'react';
import { Button } from '@/components/ui/button';

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                LOLtracker
              </h1>
              <nav className="ml-8">
                <a 
                  href="/pages/match_History" 
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                >
                  Match History
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              
              <h1 className="text-5xl md:text-3xl font-bold text-white mb-6">
                Active Teams
              </h1>
              
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Start Tracking
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200 border border-white/20">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-white/70">
                Everything you need to elevate your League gameplay
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Improve Your Gameplay?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of players who are already tracking their progress
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page; 