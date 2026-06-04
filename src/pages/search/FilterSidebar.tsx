import { useState } from 'react';
import { X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/types/search';
import { PROPERTY_TYPES, AMENITIES_LIST, GUEST_RATING_OPTIONS } from '@/data/hotelData';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  resultCount,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    'price',
    'star',
    'guest',
    'type',
    'amenities',
    'policy',
  ]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const updateFilters = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const activeFilterCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 600 ? 1 : 0) +
    filters.starRatings.length +
    filters.guestRatings.length +
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.freeCancellation ? 1 : 0) +
    (filters.breakfastIncluded ? 1 : 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(15,27,46,0.4)] z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-[140px] right-0 lg:right-auto z-[70] lg:z-auto',
          'w-[360px] max-w-[85vw] lg:w-full lg:max-w-none',
          'h-[100dvh] lg:h-[calc(100dvh-160px)]',
          'bg-white lg:bg-transparent',
          'shadow-2xl lg:shadow-none',
          'transform transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          'lg:block'
        )}
        style={{ display: isOpen ? 'flex' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E2E6EC] lg:hidden shrink-0">
          <h2 className="font-body text-lg font-semibold text-[#0F1B2E]">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F0F2F5] rounded-full transition-colors"
          >
            <X size={20} className="text-[#7A8494]" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Price Range */}
          <FilterSection
            label="Price Range"
            isOpen={openSections.includes('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="px-1">
              <Slider
                value={filters.priceRange}
                onValueChange={(val) =>
                  updateFilters({ priceRange: [val[0], val[1]] })
                }
                min={0}
                max={600}
                step={10}
                className="my-4"
              />
              <div className="flex items-center justify-between">
                <div className="px-3 py-2 bg-[#F8F9FB] rounded-lg border border-[#E2E6EC]">
                  <span className="font-body text-xs text-[#7A8494]">Min</span>
                  <p className="font-body text-sm font-semibold text-[#1A2B47]">
                    ${filters.priceRange[0]}
                  </p>
                </div>
                <div className="w-4 h-px bg-[#E2E6EC]" />
                <div className="px-3 py-2 bg-[#F8F9FB] rounded-lg border border-[#E2E6EC]">
                  <span className="font-body text-xs text-[#7A8494]">Max</span>
                  <p className="font-body text-sm font-semibold text-[#1A2B47]">
                    ${filters.priceRange[1]}
                  </p>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Star Rating */}
          <FilterSection
            label="Star Rating"
            isOpen={openSections.includes('star')}
            onToggle={() => toggleSection('star')}
          >
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FB] cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={filters.starRatings.includes(stars)}
                    onCheckedChange={() =>
                      updateFilters({
                        starRatings: toggleArrayItem(filters.starRatings, stars),
                      })
                    }
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-[#E8A838] text-[#E8A838]"
                      />
                    ))}
                  </div>
                  <span className="font-body text-sm text-[#4A5468]">
                    {stars} {stars === 1 ? 'Star' : 'Stars'}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Guest Rating */}
          <FilterSection
            label="Guest Rating"
            isOpen={openSections.includes('guest')}
            onToggle={() => toggleSection('guest')}
          >
            <div className="space-y-2">
              {GUEST_RATING_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FB] cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={filters.guestRatings.includes(option.value)}
                    onCheckedChange={() =>
                      updateFilters({
                        guestRatings: toggleArrayItem(filters.guestRatings, option.value),
                      })
                    }
                  />
                  <span className="font-body text-sm text-[#4A5468]">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Property Type */}
          <FilterSection
            label="Property Type"
            isOpen={openSections.includes('type')}
            onToggle={() => toggleSection('type')}
          >
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <label
                  key={type}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all',
                    filters.propertyTypes.includes(type)
                      ? 'border-[#E85D4A] bg-[#FEF2F0]'
                      : 'border-[#E2E6EC] hover:border-[#C5CBD4]'
                  )}
                >
                  <Checkbox
                    checked={filters.propertyTypes.includes(type)}
                    onCheckedChange={() =>
                      updateFilters({
                        propertyTypes: toggleArrayItem(filters.propertyTypes, type),
                      })
                    }
                    className="shrink-0"
                  />
                  <span className="font-body text-xs text-[#4A5468] truncate">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Amenities */}
          <FilterSection
            label="Amenities"
            isOpen={openSections.includes('amenities')}
            onToggle={() => toggleSection('amenities')}
          >
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_LIST.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F8F9FB] cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() =>
                      updateFilters({
                        amenities: toggleArrayItem(filters.amenities, amenity),
                      })
                    }
                    className="shrink-0"
                  />
                  <span className="font-body text-xs text-[#4A5468]">{amenity}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Booking Policy */}
          <FilterSection
            label="Booking Policy"
            isOpen={openSections.includes('policy')}
            onToggle={() => toggleSection('policy')}
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FB] cursor-pointer transition-colors">
                <Checkbox
                  checked={filters.freeCancellation}
                  onCheckedChange={(checked) =>
                    updateFilters({ freeCancellation: checked as boolean })
                  }
                />
                <span className="font-body text-sm text-[#4A5468]">Free cancellation</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FB] cursor-pointer transition-colors">
                <Checkbox
                  checked={filters.breakfastIncluded}
                  onCheckedChange={(checked) =>
                    updateFilters({ breakfastIncluded: checked as boolean })
                  }
                />
                <span className="font-body text-sm text-[#4A5468]">Breakfast included</span>
              </label>
            </div>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-5 border-t border-[#E2E6EC] bg-white lg:bg-transparent space-y-3">
          {activeFilterCount > 0 && (
            <button
              onClick={() =>
                onFiltersChange({
                  priceRange: [0, 600],
                  starRatings: [],
                  guestRatings: [],
                  propertyTypes: [],
                  amenities: [],
                  freeCancellation: false,
                  breakfastIncluded: false,
                })
              }
              className="w-full py-2 font-body text-sm font-medium text-[#7A8494] hover:text-[#E85D4A] transition-colors"
            >
              Clear All ({activeFilterCount})
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] lg:hidden"
          >
            Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Accordion Section Wrapper ─── */
function FilterSection({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#F0F2F5] pb-4 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-1"
      >
        <span className="font-body text-sm font-semibold text-[#1A2B47]">{label}</span>
        {isOpen ? (
          <ChevronUp size={16} className="text-[#7A8494]" />
        ) : (
          <ChevronDown size={16} className="text-[#7A8494]" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}
