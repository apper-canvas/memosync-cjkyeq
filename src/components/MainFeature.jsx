import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // States for note input and storage
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('default');
  const [isPinned, setIsPinned] = useState(false);
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('memosync_notes');
    return savedNotes ? JSON.parse(savedNotes) : [
      {
        id: '1',
        title: 'Welcome to MemoSync!',
        content: 'This is your new favorite note-taking app. Try adding a new note below.',
        color: 'blue',
        isPinned: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Shopping List',
        content: '- Milk\n- Eggs\n- Bread\n- Coffee beans\n- Avocados',
        color: 'green',
        isPinned: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  });
  const noteFormRef = useRef(null);
  const titleInputRef = useRef(null);

  // Color palette for notes
  const colorPalette = [
    { id: 'default', name: 'Default', class: 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700' },
    { id: 'red', name: 'Red', class: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50' },
    { id: 'orange', name: 'Orange', class: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/50' },
    { id: 'yellow', name: 'Yellow', class: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/50' },
    { id: 'green', name: 'Green', class: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50' },
    { id: 'purple', name: 'Purple', class: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50' },
    { id: 'pink', name: 'Pink', class: 'bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800/50' },
  ];

  // Get color class by ID
  const getColorClass = (colorId) => {
    return colorPalette.find(color => color.id === colorId)?.class || colorPalette[0].class;
  };

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('memosync_notes', JSON.stringify(notes));
  }, [notes]);

  // Handle click outside note form to collapse it
  useEffect(() => {
    function handleClickOutside(event) {
      if (noteFormRef.current && !noteFormRef.current.contains(event.target) && isExpanded) {
        if (noteTitle.trim() || noteContent.trim()) {
          handleSaveNote();
        } else {
          resetNoteForm();
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, noteTitle, noteContent, selectedColor, isPinned]);

  // Focus title input when form expands
  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Icon components
  const PlusIcon = getIcon('Plus');
  const PinIcon = getIcon('Pin');
  const TrashIcon = getIcon('Trash2');
  const PaletteIcon = getIcon('Palette');
  const CheckIcon = getIcon('Check');
  const NoIcon = getIcon('X');
  const ArchiveIcon = getIcon('Archive');
  const BellIcon = getIcon('Bell');
  const ImageIcon = getIcon('Image');
  
  // Form handlers
  const expandNoteForm = () => {
    setIsExpanded(true);
  };
  
  const resetNoteForm = () => {
    setIsExpanded(false);
    setNoteTitle('');
    setNoteContent('');
    setSelectedColor('default');
    setIsPinned(false);
  };
  
  const handleSaveNote = () => {
    if (!noteContent.trim() && !noteTitle.trim()) {
      resetNoteForm();
      return;
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      color: selectedColor,
      isPinned,
      createdAt: new Date().toISOString(),
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    toast.success("Note created successfully!");
    resetNoteForm();
  };
  
  const handleDeleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    toast.info("Note deleted");
  };
  
  const handleTogglePin = (noteId) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, isPinned: !note.isPinned } 
          : note
      )
    );
  };
  
  const handleKeyDown = (e) => {
    // Save note on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSaveNote();
    }
  };

  // Group notes into pinned and unpinned
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);
  
  return (
    <div className="space-y-8">
      {/* Note creation form */}
      <motion.div
        ref={noteFormRef}
        className={`mx-auto max-w-2xl rounded-xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden ${isExpanded ? 'shadow-soft dark:shadow-neu-dark' : ''}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <div className={`${getColorClass(selectedColor)}`}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  ref={titleInputRef}
                  type="text"
                  placeholder="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 pt-4 pb-2 bg-transparent font-medium text-lg focus:outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <textarea
            placeholder={isExpanded ? "Take a note..." : "Click to create a note..."}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onClick={expandNoteForm}
            onKeyDown={handleKeyDown}
            rows={isExpanded ? 4 : 1}
            className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none"
          />
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-between p-2 border-t border-surface-200 dark:border-surface-700"
              >
                <div className="flex space-x-1">
                  {/* Color picker dropdown */}
                  <div className="relative group">
                    <button 
                      type="button"
                      className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                      aria-label="Choose color"
                    >
                      <PaletteIcon size={18} />
                    </button>
                    
                    <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft p-2 grid grid-cols-4 gap-1">
                        {colorPalette.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setSelectedColor(color.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${color.class} hover:scale-110 transition-transform`}
                            aria-label={`Select ${color.name}`}
                          >
                            {selectedColor === color.id && <CheckIcon size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Pin toggle */}
                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={`p-2 rounded-full transition-colors ${isPinned ? 'text-accent' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
                    aria-label={isPinned ? "Unpin note" : "Pin note"}
                  >
                    <PinIcon size={18} />
                  </button>
                  
                  {/* Other note options (non-functional) */}
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Add reminder"
                  >
                    <BellIcon size={18} />
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Add image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Archive"
                  >
                    <ArchiveIcon size={18} />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={resetNoteForm}
                    className="px-3 py-1.5 text-sm hover:bg-surface-200 dark:hover:bg-surface-700 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 text-sm bg-primary text-white hover:bg-primary-dark rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Pinned notes section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-surface-500 dark:text-surface-400 flex items-center gap-1">
            <PinIcon size={14} />
            <span>PINNED</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                colorClass={getColorClass(note.color)}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Unpinned notes section */}
      {unpinnedNotes.length > 0 && (
        <div className="space-y-4">
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-surface-500 dark:text-surface-400">
              OTHERS
            </h2>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                colorClass={getColorClass(note.color)}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {notes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
            <PlusIcon className="text-surface-400" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-2">No notes yet</h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
            Create your first note by typing in the form above.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Note Card Component
function NoteCard({ note, colorClass, onDelete, onTogglePin }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', 
      day: 'numeric',
    });
    return formatter.format(date);
  };
  
  // Icon components
  const PinIcon = getIcon('Pin');
  const TrashIcon = getIcon('Trash');
  const ArchiveIcon = getIcon('Archive');
  const PaletteIcon = getIcon('Palette');
  
  return (
    <motion.div
      className={`rounded-xl border overflow-hidden shadow-card hover:shadow-soft dark:hover:shadow-neu-dark transition-shadow ${colorClass}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="p-4">
        {note.title && (
          <h3 className="font-medium text-lg mb-2">{note.title}</h3>
        )}
        <p className="whitespace-pre-line">{note.content}</p>
      </div>
      
      <div className="px-4 pb-2 pt-1 flex items-center justify-between border-t border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400">
        <span className="text-xs">
          {formatDate(note.createdAt)}
        </span>
        
        <div className="flex -mr-1.5">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex"
              >
                <button
                  type="button"
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Delete note"
                >
                  <TrashIcon size={16} />
                </button>
                
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Archive note"
                >
                  <ArchiveIcon size={16} />
                </button>
                
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Change color"
                >
                  <PaletteIcon size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-full transition-colors ${note.isPinned ? 'text-accent' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <PinIcon size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default MainFeature;