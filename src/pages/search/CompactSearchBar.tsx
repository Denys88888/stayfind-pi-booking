import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactSearchBarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CompactSearchBar({ collapsed, onToggleCollapse }: CompactSearchBarProps) {
  const [searchParams] = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Paris, France');
  const [dates, setDates] = useState(() => {
    if (searchParams.get('dates')) return searchParams.get('dates')!;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const d2 = new Date(d);
    d2.setDate(d2.getDate() + 7);
    const fmt = (x: Date) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(d)} \u2013 ${fmt(d2)}`;
  });
  const [guests, setGuests] = useState(searchParams.get('guests') || '2 Adults, 1 Room');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const summaryText = `${destination.split(',')[0]} \u00b7 ${dates} \u00b7 ${guests.split(',')[0]}`;

  return (
    <div
      ref={barRef}
      className="sticky top-[72px] z-30 bg-white border-b border-[#E2E6EC] shadow-[0_2px_12px_rgba(15,27,46,0.06)]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {isCollapsed ? (
          <button
            onClick={() => {
              setIsCollapsed(false);
              onToggleCollapse();
            }}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-[#F8F9FB] hover:bg-[#F0F2F5] rounded-full transition-all duration-300"
          >
            <Search size={16} className="text-[#7A8494]" />
            <span className="font-body text-sm text-[#1A2B47] font-medium">{summaryText}</span>
            <ChevronDown size={16} className="text-[#7A8494]" />
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-2 sm:hidden">
              <span className="font-body text-sm font-medium text-[#1A2B47]">Modify Search</span>
              <button
                onClick={() => {
                  setIsCollapsed(true);
                  onToggleCollapse();
                }}
                className="p-1 hover:bg-[#F0F2F5] rounded-full transition-colors"
              >
                <X size={18} className="text-[#7A8494]" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-[#F8F9FB] rounded-xl sm:rounded-full p-2 max-w-[1000px] mx-auto">
              {/* Destination */}
              <button
                onClick={() => setActiveField(activeField === 'destination' ? null : 'destination')}
                className={cn(
                  'flex items-center gap-2.5 flex-1 px-3.5 py-2.5 rounded-lg sm:rounded-full transition-all duration-200 text-left',
                  activeField === 'destination'
                    ? 'bg-white ring-2 ring-[#E85D4A] shadow-sm'
                    : 'hover:bg-white'
                )}
              >
                <MapPin size={18} className="text-[#7A8494] shrink-0" />
                <div className="min-w-0">
                  <p className="font-body text-[11px] font-medium text-[#7A8494] uppercase tracking-wider">
                    Destination
                  </p>
                  <p className="font-body text-sm text-[#1A2B47] truncate">{destination}</p>
                </div>
              </button>
              <div className="hidden sm:block w-px h-8 bg-[#E2E6EC]" />

              {/* Dates */}
              <button
                onClick={() => setActiveField(activeField === 'dates' ? null : 'dates')}
                className={cn(
                  'flex items-center gap-2.5 flex-1 px-3.5 py-2.5 rounded-lg sm:rounded-full transition-all duration-200 text-left',
                  activeField === 'dates'
                    ? 'bg-white ring-2 ring-[#E85D4A] shadow-sm'
                    : 'hover:bg-white'
                )}
              >
                <Calendar size={18} className="text-[#7A8494] shrink-0" />
                <div className="min-w-0">
                  <p className="font-body text-[11px] font-medium text-[#7A8494] uppercase tracking-wider">
                    Dates
                  </p>
                  <p className="font-body text-sm text-[#1A2B47] truncate">{dates}</p>
                </div>
              </button>
              <div className="hidden sm:block w-px h-8 bg-[#E2E6EC]" />

              {/* Guests */}
              <button
                onClick={() => setActiveField(activeField === 'guests' ? null : 'guests')}
                className={cn(
                  'flex items-center gap-2.5 flex-1 px-3.5 py-2.5 rounded-lg sm:rounded-full transition-all duration-200 text-left',
                  activeField === 'guests'
                    ? 'bg-white ring-2 ring-[#E85D4A] shadow-sm'
                    : 'hover:bg-white'
                )}
              >
                <Users size={18} className="text-[#7A8494] shrink-0" />
                <div className="min-w-0">
                  <p className="font-body text-[11px] font-medium text-[#7A8494] uppercase tracking-wider">
                    Guests
                  </p>
                  <p className="font-body text-sm text-[#1A2B47] truncate">{guests}</p>
                </div>
              </button>

              {/* Search Button */}
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body text-sm font-semibold rounded-lg sm:rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] ml-0 sm:ml-1">
                <Search size={16} />
                <span className="sm:hidden">Search</span>
              </button>
            </div>

            {/* Active field dropdowns */}
            {activeField === 'destination' && (
              <div className="mt-2 p-4 bg-white rounded-xl shadow-lg border border-[#E2E6EC] max-w-[1000px] mx-auto animate-in fade-in zoom-in-95 duration-200">
                <p className="font-body text-xs font-medium text-[#7A8494] mb-2">DESTINATION</p>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E6EC] rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D4A] focus:border-transparent transition-all"
                  placeholder="Where are you going?"
                  autoFocus
                />
                <div className="mt-3 flex gap-2">
                  {['Paris, France', 'London, UK', 'Tokyo, Japan', 'New York, USA'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setDestination(city)}
                      className="px-3 py-1.5 bg-[#F8F9FB] hover:bg-[#FEF2F0] text-[#243B5D] hover:text-[#E85D4A] rounded-full font-body text-xs font-medium transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeField === 'dates' && (
              <div className="mt-2 p-4 bg-white rounded-xl shadow-lg border border-[#E2E6EC] max-w-[1000px] mx-auto animate-in fade-in zoom-in-95 duration-200">
                <p className="font-body text-xs font-medium text-[#7A8494] mb-2">DATES</p>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E6EC] rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D4A] focus:border-transparent transition-all"
                  placeholder="Check-in \u2013 Check-out"
                  autoFocus
                />
                <div className="mt-3 flex gap-2">
                  {(() => {
                    const base = new Date();
                    const fmt = (x: Date) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const range = (offset: number, len: number) => {
                      const a = new Date(base); a.setDate(a.getDate() + offset);
                      const b = new Date(a); b.setDate(b.getDate() + len);
                      return `${fmt(a)} \u2013 ${fmt(b)}`;
                    };
                    return [range(14, 7), range(21, 7), range(30, 7)];
                  })().map(
                    (d) => (
                      <button
                        key={d}
                        onClick={() => setDates(d)}
                        className="px-3 py-1.5 bg-[#F8F9FB] hover:bg-[#FEF2F0] text-[#243B5D] hover:text-[#E85D4A] rounded-full font-body text-xs font-medium transition-colors"
                      >
                        {d}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeField === 'guests' && (
              <div className="mt-2 p-4 bg-white rounded-xl shadow-lg border border-[#E2E6EC] max-w-[1000px] mx-auto animate-in fade-in zoom-in-95 duration-200">
                <p className="font-body text-xs font-medium text-[#7A8494] mb-2">GUESTS</p>
                <input
                  type="text"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E6EC] rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D4A] focus:border-transparent transition-all"
                  placeholder="Guests"
                  autoFocus
                />
                <div className="mt-3 flex gap-2">
                  {['1 Adult, 1 Room', '2 Adults, 1 Room', '2 Adults, 2 Children, 1 Room'].map(
                    (g) => (
                      <button
                        key={g}
                        onClick={() => setGuests(g)}
                        className="px-3 py-1.5 bg-[#F8F9FB] hover:bg-[#FEF2F0] text-[#243B5D] hover:text-[#E85D4A] rounded-full font-body text-xs font-medium transition-colors"
                      >
                        {g}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
