import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FEED_SOURCES } from '../../config';

interface FeedFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(FEED_SOURCES);
  
  const handleSourceToggle = (source: string) => {
    const updated = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];
    
    setSelectedSources(updated);
    onFilterChange(updated);
  };
  
  const handleReset = () => {
    setSelectedSources(FEED_SOURCES);
    onFilterChange(FEED_SOURCES);
  };
  
  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Content Feed</h2>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
        >
          <Filter size={16} className="mr-1" />
          Filter
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filter by Source</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {FEED_SOURCES.map(source => (
              <div key={source} className="flex items-center">
                <input
                  id={`source-${source}`}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={selectedSources.includes(source)}
                  onChange={() => handleSourceToggle(source)}
                />
                <label
                  htmlFor={`source-${source}`}
                  className="ml-2 block text-sm text-gray-700 capitalize"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleReset}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedFilters;