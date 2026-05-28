import React, { useState, useEffect } from 'react';
import { productsService, getMediaUrl } from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { SkeletonCard } from '../components/Common/Loading';
import { Search, ShoppingCart, X, MessageSquare } from 'lucide-react';
import { showToast } from '../components/Common/Toast';
import { useCompany } from '../context/CompanyContext';

const Products = () => {
  const { details } = useCompany();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Active modal details
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productsService.getAll({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchQuery,
      });
      if (res.success) {
        setProducts(res.data);

        // Populate categories dynamically from raw data if it's the first render
        if (selectedCategory === 'All' && !searchQuery) {
          const fetchedCats = res.data.map(p => p.category);
          const uniqueCats = ['All', ...new Set(fetchedCats)];
          setCategories(uniqueCats);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleWhatsAppOrder = (product) => {
    const whatsappNum = details?.whatsapp || '1234567890';
    let cleanNum = whatsappNum.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '94' + cleanNum.substring(1);
    }
    const text = encodeURIComponent(`Hi! I'm interested in ordering the product "${product.name}" on your website. Please share availability details.`);
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
    showToast('success', 'Redirecting to WhatsApp support...');
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">

        {/* Header */}
        <div className="text-center flex flex-col gap-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Products Catalog</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">Our Software & Templates</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Unlock instant deployment with our fully-equipped developer boilerplates, design systems, and software scripts.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          {/* Category list buttons */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border glass-input focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="absolute left-3.5 top-3.5 text-slate-400">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-bold">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No products match your search/filter parameters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <GlassCard
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="flex flex-col h-full overflow-hidden p-0 rounded-2xl group border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={getMediaUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {product.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-500 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-primary-500 font-bold">
                    <span>View Details</span>
                    <ShoppingCart size={16} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <div className="relative w-full max-w-2xl glass-panel-heavy rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto">
                <div className="aspect-video w-full relative">
                  <img
                    src={getMediaUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-4 left-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {selectedProduct.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Description</h4>
                    <p className="text-sm sm:text-base text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleWhatsAppOrder(selectedProduct)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 hover:scale-102 transition-all duration-300"
                    >
                      <MessageSquare size={18} />
                      Order via WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        showToast('info', 'Closing product preview');
                      }}
                      className="px-6 py-3.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
