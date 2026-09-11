import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { SYMPTOMS_LIST } from '../../api/predictionApi';

export default function SymptomSelector({ selectedSymptoms, setSelectedSymptoms }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSymptoms = SYMPTOMS_LIST.filter(
    symptom => 
      symptom.toLowerCase().includes(query.toLowerCase()) &&
      !selectedSymptoms.includes(symptom)
  );

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setQuery('');
  };

  return (
    <div className="space-y-2.5" ref={dropdownRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
        Symptom Observations *
      </label>
      
      {/* Selection Box / Input */}
      <div className="relative">
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 transition-all cursor-text min-h-[42px]"
        >
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder={selectedSymptoms.length > 0 ? "Add more symptoms..." : "Search symptoms..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="bg-transparent border-0 outline-none p-0 text-sm text-slate-100 placeholder-slate-500 flex-1 min-w-[120px] focus:ring-0"
          />
          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 cursor-pointer" />
        </div>

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20 font-sans">
            {filteredSymptoms.length > 0 ? (
              <div className="p-1">
                {filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-md transition-colors"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-xs text-slate-500 italic text-center">
                {query ? 'No matching symptoms found' : 'Type to search symptoms'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Chips */}
      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedSymptoms.map((symptom) => (
            <span
              key={symptom}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200"
            >
              <span>{symptom}</span>
              <button
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className="text-slate-500 hover:text-slate-200 focus:outline-none transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
