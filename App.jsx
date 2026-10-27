import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Search, 
  Plus, 
  Sparkles, 
  Star, 
  Clock, 
  Heart, 
  Trash2, 
  Edit3, 
  Filter, 
  Trophy, 
  CheckCircle2, 
  PlayCircle, 
  Bookmark, 
  XCircle, 
  ListPlus,
  Monitor,
  X,
  RotateCcw,
  SlidersHorizontal,
  FolderDown,
  ChevronDown
} from 'lucide-react';

// Preset Platforms with badge colors
const PLATFORMS = [
  { id: 'GB', name: 'Game Boy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'GBA', name: 'Game Boy Advance', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'SNES', name: 'Super Nintendo', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'N64', name: 'Nintendo 64', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'PS1', name: 'PlayStation 1', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'PS2', name: 'PlayStation 2', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'PSP', name: 'PlayStation Portable', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'PC', name: 'PC / Emulation', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 'Arcade', name: 'Arcade MAME', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
];

const STATUSES = [
  { id: 'Playing', label: 'Playing', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: PlayCircle },
  { id: 'Completed', label: 'Completed', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40', icon: Trophy },
  { id: 'Backlog', label: 'Backlog', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: Bookmark },
  { id: 'Wishlist', label: 'Wishlist', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: ListPlus },
  { id: 'Dropped', label: 'Dropped', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40', icon: XCircle }
];

const SAMPLE_GAMES = [
  {
    id: '1',
    title: 'The Legend of Zelda: Ocarina of Time',
    platform: 'N64',
    status: 'Completed',
    rating: 5,
    hoursPlayed: 38,
    isFavorite: true,
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    notes: 'Ran using Ship of Harkinian HD texture pack. Unbelievable nostalgic replay!'
  },
  {
    id: '2',
    title: 'Castlevania: Symphony of the Night',
    platform: 'PS1',
    status: 'Completed',
    rating: 5,
    hoursPlayed: 24,
    isFavorite: true,
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    notes: 'Inverted castle completed with 200.6% map coverage.'
  },
  {
    id: '3',
    title: 'Pokemon Emerald Version',
    platform: 'GBA',
    status: 'Playing',
    rating: 4,
    hoursPlayed: 19,
    isFavorite: false,
    coverUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80',
    notes: 'Playing on mGBA with speedup for Battle Frontier grinding.'
  },
  {
    id: '4',
    title: 'Silent Hill 2',
    platform: 'PS2',
    status: 'Backlog',
    rating: 0,
    hoursPlayed: 0,
    isFavorite: false,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    notes: 'PCSX2 widescreen patch ready. Saving for October playthrough.'
  },
  {
    id: '5',
    title: 'Chrono Trigger',
    platform: 'SNES',
    status: 'Completed',
    rating: 5,
    hoursPlayed: 32,
    isFavorite: true,
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    notes: 'Got ending #1 (Beyond Time). Perfect OST.'
  },
  {
    id: '6',
    title: 'Persona 3 Portable',
    platform: 'PSP',
    status: 'Playing',
    rating: 4,
    hoursPlayed: 45,
    isFavorite: false,
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    notes: 'FeMC route with HD UI mod on PPSSPP.'
  }
];

export default function App() {
  // LocalStorage initialization
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('retro_games_collection');
      return saved ? JSON.parse(saved) : SAMPLE_GAMES;
    } catch (e) {
      return SAMPLE_GAMES;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('title'); // title, rating, hours

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    platform: 'GBA',
    status: 'Backlog',
    rating: 5,
    hoursPlayed: 0,
    isFavorite: false,
    coverUrl: '',
    notes: ''
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('retro_games_collection', JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [games]);

  // Open modal for New or Edit
  const openModal = (game = null) => {
    if (game) {
      setEditingGame(game);
      setFormData(game);
    } else {
      setEditingGame(null);
      setFormData({
        title: '',
        platform: 'GBA',
        status: 'Backlog',
        rating: 5,
        hoursPlayed: 0,
        isFavorite: false,
        coverUrl: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const defaultCover = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

    if (editingGame) {
      setGames(games.map(g => g.id === editingGame.id ? { 
        ...formData, 
        coverUrl: formData.coverUrl.trim() || defaultCover 
      } : g));
    } else {
      const newGame = {
        ...formData,
        id: Date.now().toString(),
        coverUrl: formData.coverUrl.trim() || defaultCover
      };
      setGames([newGame, ...games]);
    }
    closeModal();
  };

  // Delete Game
  const handleDelete = (id) => {
    setGames(games.filter(g => g.id !== id));
  };

  // Toggle Favorite
  const toggleFavorite = (id) => {
    setGames(games.map(g => g.id === id ? { ...g, isFavorite: !g.isFavorite } : g));
  };

  // Reset to Sample Data
  const handleResetData = () => {
    if (window.confirm('Reset collection back to sample games?')) {
      setGames(SAMPLE_GAMES);
    }
  };

  // Filter & Sort Logic
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            game.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = selectedPlatform === 'All' || game.platform === selectedPlatform;
      const matchesStatus = selectedStatus === 'All' || game.status === selectedStatus;
      const matchesFav = !onlyFavorites || game.isFavorite;

      return matchesSearch && matchesPlatform && matchesStatus && matchesFav;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'hours') return b.hoursPlayed - a.hoursPlayed;
      return a.title.localeCompare(b.title);
    });
  }, [games, searchQuery, selectedPlatform, selectedStatus, onlyFavorites, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = games.length;
    const completed = games.filter(g => g.status === 'Completed').length;
    const playing = games.filter(g => g.status === 'Playing').length;
    const totalHours = games.reduce((acc, curr) => acc + (Number(curr.hoursPlayed) || 0), 0);
    
    // Find favorite platform by count
    const platformCounts = games.reduce((acc, g) => {
      acc[g.platform] = (acc[g.platform] || 0) + 1;
      return acc;
    }, {});
    
    let topPlatform = '-';
    let maxCount = 0;
    Object.entries(platformCounts).forEach(([plat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPlatform = plat;
      }
    });

    return { total, completed, playing, totalHours, topPlatform };
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500 selection:text-white pb-12">
      {/* Neon Retro Scanline Header Banner */}
      <header className="relative border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-pink-600 to-indigo-600 rounded-xl shadow-lg shadow-pink-500/20 border border-pink-400/30">
              <Gamepad2 className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent uppercase font-mono">
                RetroVault
              </h1>
              <p className="text-xs text-slate-400 font-medium">Emulation & Backlog Logbook</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 transition-all flex items-center gap-2 border border-pink-400/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Game
            </button>
            
            <button
              onClick={handleResetData}
              title="Reset Sample Data"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all border border-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total Games</span>
              <Gamepad2 className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black font-mono text-slate-100">{stats.total}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Completed</span>
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-mono text-purple-400">{stats.completed}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Hours Logged</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-cyan-400">{stats.totalHours}<span className="text-sm font-normal text-slate-500 ml-1">hrs</span></div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Top System</span>
              <Monitor className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 truncate">{stats.topPlatform}</div>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search games, platforms, mods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100 placeholder-slate-500 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {/* Favorites Toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  onlyFavorites 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400' : ''}`} />
                Favorites Only
              </button>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="title">Sort by Title</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="hours">Sort by Playtime</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Platform Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Platforms</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedPlatform('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedPlatform === 'All'
                    ? 'bg-slate-200 text-slate-950 border-slate-200 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                All
              </button>
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selectedPlatform === p.id
                      ? `${p.color} bg-opacity-40 font-bold ring-1 ring-pink-500/30`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status Pills */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedStatus('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedStatus === 'All'
                    ? 'bg-slate-200 text-slate-950 border-slate-200 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                All
              </button>
              {STATUSES.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatus(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      selectedStatus === s.id
                        ? `${s.color} font-bold ring-1 ring-pink-500/30`
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Collection Grid */}
        {filteredGames.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800/80 text-slate-500 rounded-full flex items-center justify-center mx-auto">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">No games found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                Try clearing your search filters or add a new retro gem to your vault.
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-all"
            >
              Add First Game
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(game => {
              const platformObj = PLATFORMS.find(p => p.id === game.platform) || { color: 'bg-slate-800 text-slate-300 border-slate-700' };
              const statusObj = STATUSES.find(s => s.id === game.status) || STATUSES[0];
              const StatusIcon = statusObj.icon;

              return (
                <div 
                  key={game.id}
                  className="group bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-pink-500/5"
                >
                  {/* Card Cover Art */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                    
                    {/* Favorite Button Overlay */}
                    <button
                      onClick={() => toggleFavorite(game.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/50 hover:border-pink-500 text-slate-300 hover:text-pink-400 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${game.isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>

                    {/* Platform Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide border backdrop-blur-md ${platformObj.color}`}>
                        {game.platform}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="font-bold text-slate-100 text-base group-hover:text-pink-400 transition-colors line-clamp-1">
                          {game.title}
                        </h2>
                      </div>

                      {/* Status & Rating line */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1 ${statusObj.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {game.status}
                        </span>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < game.rating ? 'fill-amber-400' : 'text-slate-700'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Notes / Mods */}
                      {game.notes && (
                        <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                          "{game.notes}"
                        </p>
                      )}
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{game.hoursPlayed} hrs</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(game)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Edit Game"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(game.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Game"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-pink-400" />
                {editingGame ? 'Edit Game Entry' : 'Add Retro Game'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Game Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Super Metroid"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100"
                  >
                    {STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Rating (0 - 5 Stars)
                  </label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 focus:outline-none"
                      >
                        <Star 
                          className={`w-5 h-5 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Hours Played
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hoursPlayed}
                    onChange={(e) => setFormData({ ...formData, hoursPlayed: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Cover Artwork URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Notes & Emulation Mods
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Texture packs used, save file backup location, controller mapping info..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-slate-100 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="favToggle"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="rounded border-slate-800 text-pink-500 focus:ring-pink-500 bg-slate-950"
                />
                <label htmlFor="favToggle" className="text-sm font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <Heart className={`w-4 h-4 ${formData.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-500'}`} />
                  Mark as Favorite
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-pink-500/20 transition-all"
                >
                  {editingGame ? 'Save Changes' : 'Add to Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}