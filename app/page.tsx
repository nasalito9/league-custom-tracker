import React from 'react';
import { Button } from '@/components/ui/button';

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                Custom Tracker
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

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-8">
                🎮 League of Legends Custom Game Tracker
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Track Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Custom Games
                </span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
                Monitor your League of Legends custom game performance, analyze match statistics, 
                and improve your gameplay with detailed insights.
              </p>
              
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

        {/* Features Section */}
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Match Analytics",
                  description: "Deep dive into your performance with detailed statistics and visualizations",
                  icon: "📊",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Real-time Tracking",
                  description: "Monitor live games and get instant feedback on your gameplay",
                  icon: "⚡",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  title: "Team Insights",
                  description: "Analyze team compositions and strategies for better coordination",
                  icon: "👥",
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} text-white text-2xl mb-6`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
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