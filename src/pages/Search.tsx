import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  LayoutList,
  Map,
  Search as SearchIcon,
  ChevronDown,
  Loader2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import CompactSearchBar from './search/CompactSearchBar';
import FilterSidebar from './search/FilterSidebar';
import HotelCard from './search/HotelCard';
import MapView from './search/MapView';
import { hotels, SORT_OPTIONS, GUEST_RATING_OPTIONS } from '@/data/hotelData';
import type { Hotel, FilterState, SortOption } from '@/types/search';

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 600],
  starRatings: [],
  guestRatings: [],
  propertyTypes: [],
  amenities: [],
  freeCancellation: false,
  breakfastIncluded: false,
};

const ITEMS_PER_PAGE = 6;

export default function Search() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || 'Paris, France';

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('top-picks');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeHotelId, setActiveHotelId] = useState<number | null>(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  /* ── Scroll: collapse search bar ── */
  useEffect(() => {
    const handleScroll = () => {
      setSearchCollapsed(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Click outside sort dropdown ── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sort-dropdown-container')) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Client-side filtering ── */
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // Price range
    result = result.filter(
      (h) => h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1]
    );

    // Star rating
    if (filters.starRatings.length > 0) {
      result = result.filter((h) => filters.starRatings.includes(h.starRating));
    }

    // Guest rating
    if (filters.guestRatings.length > 0) {
      result = result.filter((h) => {
        return filters.guestRatings.some((gr) => {
          const min = parseInt(gr);
          return h.rating >= min;
        });
      });
    }

    // Property type
    if (filters.propertyTypes.length > 0) {
      result = result.filter((h) => filters.propertyTypes.includes(h.propertyType));
    }

    // Amenities
    if (filters.amenities.length > 0) {
      result = result.filter((h) =>
        filters.amenities.every((a) => h.amenities.includes(a))
      );
    }

    // Free cancellation
    if (filters.freeCancellation) {
      result = result.filter((h) => h.freeCancellation);
    }

    // Breakfast included
    if (filters.breakfastIncluded) {
      result = result.filter((h) => h.breakfastIncluded);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-reviewed':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'closest':
        // Sort by distance from Paris center (48.8566, 2.3522)
        result.sort((a, b) => {
          const distA =
            Math.pow(a.coordinates[0] - 48.8566, 2) +
            Math.pow(a.coordinates[1] - 2.3522, 2);
          const distB =
            Math.pow(b.coordinates[0] - 48.8566, 2) +
            Math.pow(b.coordinates[1] - 2.3522, 2);
          return distA - distB;
        });
        break;
      default:
        // top-picks: default order
        break;
    }

    return result;
  }, [filters, sortBy]);

  const paginatedHotels = useMemo(
    () => filteredHotels.slice(0, page * ITEMS_PER_PAGE),
    [filteredHotels, page]
  );

  const hasMore = paginatedHotels.length < filteredHotels.length;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 600);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 600) count++;
    count += filters.starRatings.length;
    count += filters.guestRatings.length;
    count += filters.propertyTypes.length;
    count += filters.amenities.length;
    if (filters.freeCancellation) count++;
    if (filters.breakfastIncluded) count++;
    return count;
  }, [filters]);

  /* ── Quick filter chips ── */
  const quickFilterConfig = [
    { label: 'Pool', filter: 'Pool' as const },
    { label: 'Spa', filter: 'Spa' as const },
    { label: 'Free cancellation', filter: 'freeCancel' as const },
    { label: 'Breakfast', filter: 'breakfast' as const },
  ];

  const isQuickActive = (filter: string) => {
    switch (filter) {
      case 'Pool':
      case 'Spa':
        return filters.amenities.includes(filter);
      case 'freeCancel':
        return filters.freeCancellation;
      case 'breakfast':
        return filters.breakfastIncluded;
      default:
        return false;
    }
  };

  const toggleQuickFilter = (filter: string) => {
    const newFilters = { ...filters };
    switch (filter) {
      case 'Pool':
      case 'Spa':
        newFilters.amenities = newFilters.amenities.includes(filter)
          ? newFilters.amenities.filter((a) => a !== filter)
          : [...newFilters.amenities, filter];
        break;
      case 'freeCancel':
        newFilters.freeCancellation = !newFilters.freeCancellation;
        break;
      case 'breakfast':
        newFilters.breakfastIncluded = !newFilters.breakfastIncluded;
        break;
    }
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <Layout>
      <div className="min-h-[100dvh] bg-[#F8F9FB]">
        {/* ── Compact Search Bar ── */}
        <CompactSearchBar
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        />

        {/* ── Filter Bar & Sort ── */}
        <div className="bg-white border-b border-[#F0F2F5]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Quick filters + Filters button */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {/* Filters button */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className={cn(
                    'flex items-center gap-1.5 shrink-0 px-3.5 py-2 border rounded-full font-body text-sm font-medium transition-all duration-200',
                    activeFilterCount > 0
                      ? 'border-[#E85D4A] bg-[#FEF2F0] text-[#E85D4A]'
                      : 'border-[#E2E6EC] text-[#1A2B47] hover:border-[#C5CBD4]'
                  )}
                >
                  <SlidersHorizontal size={16} />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 w-5 h-5 bg-[#E85D4A] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Quick filter chips */}
                <div className="hidden md:flex items-center gap-1.5">
                  {quickFilterConfig.map((qf) => (
                    <button
                      type="button"
                      key={qf.filter}
                      onClick={() => toggleQuickFilter(qf.filter)}
                      className={cn(
                        'px-3.5 py-2 border rounded-full font-body text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
                        isQuickActive(qf.filter)
                          ? 'bg-[#0F1B2E] border-[#0F1B2E] text-white'
                          : 'border-[#E2E6EC] text-[#243B5D] hover:border-[#C5CBD4]'
                      )}
                    >
                      {qf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Results count + Sort + View toggle */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden lg:inline font-body text-sm text-[#7A8494]">
                  {filteredHotels.length} properties
                </span>

                {/* Sort Dropdown */}
                <div className="sort-dropdown-container relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E6EC] rounded-xl font-body text-sm text-[#1A2B47] hover:border-[#C5CBD4] transition-colors bg-white"
                  >
                    <span className="hidden sm:inline">
                      {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </span>
                    <span className="sm:hidden">Sort</span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        'text-[#7A8494] transition-transform duration-200',
                        sortDropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-[#E2E6EC] py-1.5 z-40"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as SortOption);
                              setSortDropdownOpen(false);
                              setPage(1);
                            }}
                            className={cn(
                              'w-full text-left px-4 py-2.5 font-body text-sm transition-colors hover:bg-[#F8F9FB]',
                              sortBy === option.value
                                ? 'text-[#E85D4A] font-semibold bg-[#FEF2F0]'
                                : 'text-[#1A2B47]'
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-[#F0F2F5] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition-all duration-200',
                      viewMode === 'list'
                        ? 'bg-[#0F1B2E] text-white shadow-sm'
                        : 'text-[#7A8494] hover:text-[#1A2B47]'
                    )}
                    aria-label="List view"
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      'p-2 rounded-md transition-all duration-200',
                      viewMode === 'map'
                        ? 'bg-[#0F1B2E] text-white shadow-sm'
                        : 'text-[#7A8494] hover:text-[#1A2B47]'
                    )}
                    aria-label="Map view"
                  >
                    <Map size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Active Filter Pills ── */}
        {activeFilterCount > 0 && (
          <div className="bg-white border-b border-[#F0F2F5]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body text-xs text-[#7A8494]">Active:</span>
                {filters.priceRange[0] > 0 || filters.priceRange[1] < 600 ? (
                  <ActivePill
                    label={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}
                    onRemove={() =>
                      setFilters((f) => ({ ...f, priceRange: [0, 600] }))
                    }
                  />
                ) : null}
                {filters.starRatings.map((s) => (
                  <ActivePill
                    key={s}
                    label={`${s} Star${s > 1 ? 's' : ''}`}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        starRatings: f.starRatings.filter((r) => r !== s),
                      }))
                    }
                  />
                ))}
                {filters.amenities.map((a) => (
                  <ActivePill
                    key={a}
                    label={a}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        amenities: f.amenities.filter((x) => x !== a),
                      }))
                    }
                  />
                ))}
                {filters.guestRatings.map((gr) => {
                  const grLabel = GUEST_RATING_OPTIONS.find((o) => o.value === gr)?.label || gr;
                  return (
                    <ActivePill
                      key={gr}
                      label={grLabel}
                      onRemove={() =>
                        setFilters((f) => ({
                          ...f,
                          guestRatings: f.guestRatings.filter((x) => x !== gr),
                        }))
                      }
                    />
                  );
                })}
                {filters.propertyTypes.map((pt) => (
                  <ActivePill
                    key={pt}
                    label={pt}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        propertyTypes: f.propertyTypes.filter((x) => x !== pt),
                      }))
                    }
                  />
                ))}
                {filters.freeCancellation && (
                  <ActivePill
                    label="Free cancellation"
                    onRemove={() =>
                      setFilters((f) => ({ ...f, freeCancellation: false }))
                    }
                  />
                )}
                {filters.breakfastIncluded && (
                  <ActivePill
                    label="Breakfast included"
                    onRemove={() =>
                      setFilters((f) => ({ ...f, breakfastIncluded: false }))
                    }
                  />
                )}
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="font-body text-xs text-[#E85D4A] hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
          {viewMode === 'list' ? (
            <div className="flex gap-6">
              {/* Filter Sidebar - Desktop */}
              <div className="hidden lg:block w-[300px] shrink-0">
                <div className="sticky top-[140px] max-h-[calc(100dvh-160px)] overflow-y-auto pr-1">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    isOpen={false}
                    onClose={() => {}}
                    resultCount={filteredHotels.length}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {filteredHotels.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-[#F0F2F5] flex items-center justify-center mb-5">
                        <SearchIcon size={32} className="text-[#C5CBD4]" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#1A2B47] mb-2">
                        No properties match your filters
                      </h3>
                      <p className="font-body text-sm text-[#7A8494] max-w-md mb-6">
                        Try adjusting your filters or search criteria to see more results.
                      </p>
                      <button
                        onClick={() => setFilters(INITIAL_FILTERS)}
                        className="px-6 py-3 border border-[#E2E6EC] rounded-xl font-body text-sm font-semibold text-[#1A2B47] hover:border-[#1A2B47] hover:bg-[#F8F9FB] transition-all"
                      >
                        Clear All Filters
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {paginatedHotels.map((hotel, i) => (
                        <HotelCard
                          key={hotel.id}
                          hotel={hotel}
                          index={i}
                          viewMode="list"
                          isActive={activeHotelId === hotel.id}
                          onHover={() => setActiveHotelId(hotel.id)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                {filteredHotels.length > 0 && (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <p className="font-body text-sm text-[#7A8494]">
                      Showing {paginatedHotels.length} of {filteredHotels.length} properties
                    </p>
                    {hasMore ? (
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 px-8 py-3.5 border border-[#E2E6EC] rounded-xl font-body text-sm font-semibold text-[#1A2B47] hover:border-[#1A2B47] hover:bg-[#F8F9FB] transition-all disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Properties'
                        )}
                      </button>
                    ) : (
                      <p className="font-body text-sm text-[#C5CBD4]">
                        You&apos;ve seen all properties
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Map View ── */
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100dvh-220px)] min-h-[500px]">
              {/* Map */}
              <div className="flex-1 min-h-[300px] lg:min-h-0">
                <MapView
                  hotels={filteredHotels}
                  activeHotelId={activeHotelId}
                  onHotelHover={setActiveHotelId}
                  onHotelSelect={(hotel) => {
                    setActiveHotelId(hotel.id);
                  }}
                />
              </div>

              {/* Side list */}
              <div className="w-full lg:w-[380px] shrink-0 overflow-y-auto rounded-2xl bg-[#F8F9FB] border border-[#E2E6EC] p-3 space-y-2">
                <p className="font-body text-sm font-medium text-[#1A2B47] px-2 pt-1">
                  {filteredHotels.length} properties
                </p>
                {filteredHotels.map((hotel, i) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    index={i}
                    viewMode="map"
                    isActive={activeHotelId === hotel.id}
                    onHover={() => setActiveHotelId(hotel.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className="lg:hidden">
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          resultCount={filteredHotels.length}
        />
      </div>
    </Layout>
  );
}

/* ─── Active Filter Pill ─── */
function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FEF2F0] text-[#E85D4A] rounded-full font-body text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-[#D14A38] ml-0.5">
        <X size={12} />
      </button>
    </span>
  );
}
