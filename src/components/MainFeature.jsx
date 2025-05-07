import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Tooltip from './Tooltip';
import ConfirmDialog from './ConfirmDialog';

function MainFeature() {
  // States for note input and storage
  const [isExpanded, setIsExpanded] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showColorPickerForNote, setShowColorPickerForNote] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
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
  const fileInputRef = useRef(null);

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
  const CircleIcon = getIcon('Circle');
  const CalendarIcon = getIcon('Calendar');
  const ClockIcon = getIcon('Clock');
  const DocumentIcon = getIcon('FileText');
  
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
    setShowDeleteDialog(false);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    setNoteToDelete(null);
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
    toast.success(
      notes.find(note => note.id === noteId)?.isPinned 
        ? "Note unpinned" 
        : "Note pinned", 
      { autoClose: 2000 }
    );
  };
  
  const handleChangeNoteColor = (noteId, colorId) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, color: colorId } 
          : note
      )
    );
    setShowColorPickerForNote(null);
    toast.success("Note color updated", { autoClose: 2000 });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      toast.info("Image upload feature coming soon!", {
        icon: <ImageIcon size={16} />,
      });
    }
  };
  
  const handleArchiveNote = (noteId) => {
    // In a real app, this would move the note to an archived section
    toast.info("Note archived", { 
      icon: <ArchiveIcon size={16} />
    });
  };
  
  const handleKeyDown = (e) => {
    // Save note on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSaveNote();
    }
  };
  
  const handleAddReminder = () => {
    setIsReminderModalOpen(true);
  };
  
  const handleSetReminder = (dateTime) => {
    setIsReminderModalOpen(false);
    toast.success("Reminder set for " + new Date(dateTime).toLocaleString(), {
      icon: <BellIcon size={16} />,
    });
  };

  // Group notes into pinned and unpinned
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);
  
  // Hidden file input for image upload
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-8">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
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
                  <div className="relative">
                    <Tooltip content="Choose note color">
                      <button 
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                        aria-label="Choose color"
                      >
                        <PaletteIcon size={18} />
                      </button>
                    </Tooltip>
                    
                    {showColorPicker && (
                      <div className="absolute left-0 bottom-full mb-2 z-10">
                      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft p-2 grid grid-cols-4 gap-1">
                        {colorPalette.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => {
                              setSelectedColor(color.id);
                              setShowColorPicker(false);
                              toast.success(`Note color set to ${color.name}`, { autoClose: 2000 });
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${color.class} hover:scale-110 transition-transform`}
                            aria-label={`Select ${color.name}`}
                            tabIndex={0}
                          >
                            {selectedColor === color.id && <CheckIcon className="text-surface-700 dark:text-surface-200" size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                  
                  {/* Pin toggle */}
                  <button
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setIsPinned(!isPinned)}
                    onClick={() => setIsPinned(!isPinned)}
                    type="button"
                    className={`p-2 rounded-full transition-colors ${isPinned ? 'text-accent' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
                    aria-label={isPinned ? "Unpin note" : "Pin note"}
                  >
                    <PinIcon size={18} />
                  </button>
                  
                  {/* Reminder button */}
                  <button
                    tabIndex={0}
                    onClick={handleAddReminder}
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Add reminder"
                  >
                    <BellIcon size={18} />
                  </button>
                  
                  {/* Image upload button */}
                  <button
                    tabIndex={0}
                    onClick={triggerFileInput}
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Add image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  
                  {/* Archive button */}
                  <button
                    tabIndex={0}
                    onClick={() => {
                      toast.info("Create note first to archive it", { icon: <ArchiveIcon size={16} /> });
                    }}
                    type="button"
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Archive"
                  >
                    <ArchiveIcon size={18} />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    tabIndex={0}
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
                    <CheckIcon size={16} className="mr-1 inline-block" />
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

}

// Reminder Modal Component
function ReminderModal({ isOpen, onClose, onSetReminder }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      onSetReminder(dateTime);
    } else {
      toast.error("Please select both date and time");
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
            <h3 className="text-lg font-medium">Set Reminder</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
            >
              <getIcon("X") size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Date
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-surface-500">
                  <getIcon("Calendar") size={18} />
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Time
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-surface-500">
                  <getIcon("Clock") size={18} />
                </span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-dark"
              >
                Set Reminder
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
// Note Card Component
function NoteCard({ note, colorClass, onDelete, onTogglePin }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const formatDate = (dateString) => {
  // Handle deleting a note with confirmation
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    onDelete(note.id);
    setShowDeleteDialog(false);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };
  
  // Handle archive action
  const handleArchiveClick = () => {
    toast.info("Note archived", { icon: <ArchiveIcon size={16} /> });
  };

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
                  data-testid={`delete-note-${note.id}`}
                  type="button"
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Delete note"
                >
                  <Tooltip content="Delete note">
                    <TrashIcon size={16} />
                  </Tooltip>
                </button>
                
                <button
                  type="button"
                  onClick={handleArchiveClick}
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Archive note"
                >
                  <Tooltip content="Archive note">
                    <ArchiveIcon size={16} />
                  </Tooltip>
                </button>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(!showColorPicker);
                    }}
                    className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Change color"
                  >
                    <Tooltip content="Change color">
                      <PaletteIcon size={16} />
                    </Tooltip>
                  </button>
                  
                  {showColorPicker && (
                    <div className="absolute right-0 bottom-full mb-2 z-20">
                      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft p-2 grid grid-cols-4 gap-1">
                        {colorPalette.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotes(prevNotes => 
                                prevNotes.map(n => 
                                  n.id === note.id ? {...n, color: color.id} : n
                                )
                              );
                              setShowColorPicker(false);
                              toast.success(`Note color updated to ${color.name}`, { autoClose: 2000 });
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${color.class} hover:scale-110 transition-transform`}
                            aria-label={`Select ${color.name}`}
                          >
                            {note.color === color.id && <CheckIcon className="text-surface-700 dark:text-surface-200" size={12} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-full transition-colors ${note.isPinned ? 'text-accent' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onTogglePin(note.id)}
          >
            <Tooltip content={note.isPinned ? "Unpin note" : "Pin note"}>
              <PinIcon size={16} />
            </Tooltip>
          </button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog isOpen={showDeleteDialog} onClose={handleDeleteCancel} onConfirm={() => onDelete(note.id)} title="Delete Note" message="Are you sure you want to delete this note? This action cannot be undone." confirmText="Delete" variant="danger" />
    </motion.div>
  );
}

export default MainFeature;