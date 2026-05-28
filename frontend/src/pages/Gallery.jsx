import React, { useState, useEffect } from 'react';
import { galleryService, getMediaUrl } from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { SkeletonCard } from '../components/Common/Loading';
import { Maximize2, X } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Lightbox
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await galleryService.getAll(selectedCategory === 'All' ? '' : selectedCategory);
      if (res.success) {
        setItems(res.data);

        // Fetch categories dynamically on initial render
        if (selectedCategory === 'All') {
          const loadedCats = res.data.map((item) => item.category);
          const uniqueCats = ['All', ...new Set(loadedCats)];
          setCategories(uniqueCats);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-4 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Visual Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">Company Gallery</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          A visual showcase of our modern workspace, creative designer collaborations, engineering hackathons, and server operations.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel h-60 rounded-2xl animate-pulse bg-slate-300 dark:bg-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-bold">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No photos found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setActivePhoto(item)}
              className="group relative h-64 rounded-2xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-850 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={getMediaUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <Maximize2 className="absolute top-4 right-4 text-white/80" size={18} />
                <h4 className="text-base font-bold text-white leading-snug">{item.title || 'Portfolio Image'}</h4>
                <span className="text-[10px] text-primary-400 font-extrabold uppercase mt-1 tracking-wider">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Overlay */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full flex flex-col items-center gap-4">
            
            {/* Close */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full rounded-2xl overflow-hidden glass-panel border border-slate-700/30">
              <img
                src={getMediaUrl(activePhoto.imageUrl)}
                alt={activePhoto.title}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
              
              {(activePhoto.title || activePhoto.description) && (
                <div className="p-6 bg-slate-900 text-white flex flex-col gap-1 border-t border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400">
                    {activePhoto.category}
                  </span>
                  <h3 className="text-xl font-bold font-sans mt-0.5">{activePhoto.title}</h3>
                  {activePhoto.description && (
                    <p className="text-sm text-slate-400 mt-2 font-sans font-normal leading-relaxed">
                      {activePhoto.description}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default Gallery;
