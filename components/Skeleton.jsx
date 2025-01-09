import React from 'react';

const Skeleton = () => {
  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6">
      {/* Message when no card is selected */}
      <h1 className="text-2xl font-semibold text-gray-400 mb-8">
        Select a card to view analytics
      </h1>

      {/* Skeleton loader with gradient */}
      <div className="w-full max-w-5xl">
        <div className="animate-pulse space-y-4">
          {/* Header skeleton */}
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/4"></div>
          
          {/* Main content area skeleton */}
          <div className="grid grid-cols-6 gap-4">
            {/* Company column */}
            <div className="col-span-1 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                ></div>
              ))}
            </div>
            
            {/* Data columns */}
            <div className="col-span-5 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex"
                >
                  {[...Array(5)].map((_, j) => (
                    <div 
                      key={j}
                      className="flex-1 border-l border-white/10"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
