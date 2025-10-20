import React from "react";

interface HeroIllustrationProps {
  className?: string;
}

export function HeroIllustration({ className = "" }: HeroIllustrationProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main Dashboard Mockup */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-proof-blue to-proof-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PF</span>
            </div>
            <div>
              <div className="h-2 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-1 bg-gray-100 rounded w-12"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-proof-green rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-proof-orange rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fit Score Card */}
          <div className="bg-gradient-to-br from-proof-blue/10 to-proof-purple/10 rounded-xl p-4 border border-proof-blue/20">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-gray-600">Fit Score</div>
              <div className="w-2 h-2 bg-proof-green rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">87%</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-proof-blue to-proof-green rounded-full transition-all duration-1000"
                style={{ width: '87%' }}
              ></div>
            </div>
          </div>

          {/* Matches Card */}
          <div className="bg-gradient-to-br from-proof-green/10 to-proof-blue/10 rounded-xl p-4 border border-proof-green/20">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-gray-600">Matches</div>
              <div className="w-2 h-2 bg-proof-blue rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">12</div>
            <div className="flex space-x-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-4 bg-proof-green rounded-full opacity-60"></div>
              ))}
            </div>
          </div>

          {/* Proof Points */}
          <div className="col-span-2 bg-gradient-to-r from-proof-purple/10 to-proof-orange/10 rounded-xl p-4 border border-proof-purple/20">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-gray-600">Proof Points</div>
              <div className="w-2 h-2 bg-proof-purple rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-bold text-gray-900">8/10</div>
              <div className="flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-proof-purple rounded-full"></div>
                ))}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-proof-orange rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-proof-green rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute -z-10 inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-proof-blue/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-proof-purple/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-proof-green/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
