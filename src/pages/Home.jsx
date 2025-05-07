import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Motion variants for smooth animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  },
  exit: { opacity: 0 }
};

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome to MemoSync! Your notes are ready.");
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Icon components
  const StickyNoteIcon = getIcon('StickyNote');
  const SearchIcon = getIcon('Search');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const ArchiveIcon = getIcon('Archive');
  const TrashIcon = getIcon('Trash2');
  const TagsIcon = getIcon('Tags');
  
  // Mock categories
  const categories = [
    { id: 'notes', name: 'All Notes', icon: StickyNoteIcon, count: 12 },
    { id: 'search', name: 'Search', icon: SearchIcon, count: null },
    { id: 'grid', name: 'Grid View', icon: LayoutGridIcon, count: null },
    { id: 'archive', name: 'Archive', icon: ArchiveIcon, count: 3 },
    { id: 'trash', name: 'Trash', icon: TrashIcon, count: 5 },
    { id: 'labels', name: 'Labels', icon: TagsIcon, count: 8 },
  ];
  
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Sidebar */}
      <motion.aside 
        className="lg:col-span-3 xl:col-span-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hidden lg:block sticky top-24 card p-4">
          <h2 className="text-lg font-bold mb-4">Categories</h2>
          <nav>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors
                      ${category.id === 'notes' 
                        ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    <category.icon size={18} />
                    <span>{category.name}</span>
                    {category.count !== null && (
                      <span className="ml-auto text-xs bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide py-2">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button 
                key={category.id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors
                  ${category.id === 'notes' 
                    ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light' 
                    : 'bg-white dark:bg-surface-800 shadow-card'}`}
              >
                <category.icon size={16} />
                <span>{category.name}</span>
                {category.count !== null && (
                  <span className="text-xs bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded-full">
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <motion.section 
        className="lg:col-span-9 xl:col-span-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-surface-600">Loading your notes...</p>
          </div>
        ) : (
          <MainFeature />
        )}
      </motion.section>
    </motion.div>
  );
}

export default Home;