import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  search: string;
  onSearch: (val: string) => void;
  placeholder?: string;
  filters?: { label: string; value: string }[];
  activeFilter?: string;
  onFilter?: (val: string) => void;
}

export default function SearchFilter({ search, onSearch, placeholder = 'Qidirish...', filters, activeFilter, onFilter }: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10"
        />
      </div>
      {filters && onFilter && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => onFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activeFilter === f.value ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
