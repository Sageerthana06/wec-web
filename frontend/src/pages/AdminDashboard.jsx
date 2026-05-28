import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import {
  servicesService,
  productsService,
  galleryService,
  messageService,
  companyService,
  authService,
  getMediaUrl
} from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { showToast } from '../components/Common/Toast';
import { LoadingSpinner } from '../components/Common/Loading';
import {
  Settings,
  Mail,
  Grid,
  ShoppingBag,
  Image,
  LogOut,
  Trash2,
  CheckCircle,
  Plus,
  Edit,
  Save,
  MessageSquare,
  Globe,
  Upload,
  Calendar,
  Lock
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const { details: companyDetails, refreshDetails } = useCompany();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('inquiries');

  // Loading States
  const [loading, setLoading] = useState(true);

  // Data States
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Stats State
  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    gallery: 0,
    messages: 0,
  });

  // Modal / Add / Edit forms states
  const [editCompanyForm, setEditCompanyForm] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);

  // Service form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceFormMode, setServiceFormMode] = useState('add'); // 'add' or 'edit'
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: 'Activity',
    status: 'active',
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);

  // Product form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormMode, setProductFormMode] = useState('add'); // 'add' or 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'General',
    status: 'active',
  });
  const [productImageFile, setProductImageFile] = useState(null);

  // Gallery form states
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryFormMode, setGalleryFormMode] = useState('add'); // 'add' or 'edit'
  const [currentGalleryId, setCurrentGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'General',
    description: '',
    order: 0,
  });
  const [galleryImageFile, setGalleryImageFile] = useState(null);

  // Password update form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [messagesRes, servicesRes, productsRes, galleryRes] = await Promise.all([
        messageService.getAll(),
        servicesService.getAll(true),
        productsService.getAll({}, true),
        galleryService.getAll(),
      ]);

      if (messagesRes.success) setMessages(messagesRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
      if (productsRes.success) setProducts(productsRes.data);
      if (galleryRes.success) setGallery(galleryRes.data);

      setStats({
        services: servicesRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        gallery: galleryRes.data?.length || 0,
        messages: messagesRes.data?.length || 0,
      });

      // Populate company edit form initial state
      if (companyDetails) {
        setEditCompanyForm({
          name: companyDetails.name || '',
          description: companyDetails.description || '',
          mission: companyDetails.mission || '',
          vision: companyDetails.vision || '',
          address: companyDetails.address || '',
          phone: companyDetails.phone || '',
          email: companyDetails.email || '',
          whatsapp: companyDetails.whatsapp || '',
          mapEmbedUrl: companyDetails.mapEmbedUrl || '',
          socialLinks: {
            facebook: companyDetails.socialLinks?.facebook || '',
            twitter: companyDetails.socialLinks?.twitter || '',
            instagram: companyDetails.socialLinks?.instagram || '',
            linkedin: companyDetails.socialLinks?.linkedin || '',
            youtube: companyDetails.socialLinks?.youtube || '',
          },
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      showToast('error', 'Failed to retrieve administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, companyDetails]);

  // Handle inquiry status toggle (Mark Read/Unread)
  const toggleMessageStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
      const res = await messageService.markAsRead(id, nextStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status: nextStatus } : msg))
        );
        showToast('success', `Message status updated to ${nextStatus}.`);
      }
    } catch (error) {
      showToast('error', error.message || 'Status update failed.');
    }
  };

  // Handle inquiry delete
  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await messageService.delete(id);
      if (res.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setStats((prev) => ({ ...prev, messages: prev.messages - 1 }));
        showToast('success', 'Message deleted successfully.');
      }
    } catch (error) {
      showToast('error', error.message || 'Deletion failed.');
    }
  };

  // Company Details Form submit
  const handleCompanyUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editCompanyForm.name);
      formData.append('description', editCompanyForm.description);
      formData.append('mission', editCompanyForm.mission);
      formData.append('vision', editCompanyForm.vision);
      formData.append('address', editCompanyForm.address);
      formData.append('phone', editCompanyForm.phone);
      formData.append('email', editCompanyForm.email);
      formData.append('whatsapp', editCompanyForm.whatsapp);
      formData.append('mapEmbedUrl', editCompanyForm.mapEmbedUrl);
      formData.append('socialLinks', JSON.stringify(editCompanyForm.socialLinks));

      if (companyLogoFile) {
        formData.append('logo', companyLogoFile);
      }

      const res = await companyService.updateDetails(formData);
      if (res.success) {
        showToast('success', 'Company settings updated successfully.');
        setCompanyLogoFile(null);
        refreshDetails(); // reload context settings
      }
    } catch (error) {
      showToast('error', error.message || 'Updating details failed.');
    }
  };

  // Add/Edit Service
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', serviceForm.title);
      formData.append('description', serviceForm.description);
      formData.append('icon', serviceForm.icon);
      formData.append('status', serviceForm.status);

      if (serviceImageFile) {
        formData.append('image', serviceImageFile);
      }

      let res;
      if (serviceFormMode === 'add') {
        res = await servicesService.create(formData);
        if (res.success) {
          showToast('success', 'Service created successfully.');
          setServices((prev) => [res.data, ...prev]);
          setStats((prev) => ({ ...prev, services: prev.services + 1 }));
        }
      } else {
        res = await servicesService.update(currentServiceId, formData);
        if (res.success) {
          showToast('success', 'Service updated successfully.');
          setServices((prev) =>
            prev.map((s) => (s._id === currentServiceId ? res.data : s))
          );
        }
      }
      setShowServiceForm(false);
      setServiceForm({ title: '', description: '', icon: 'Activity', status: 'active' });
      setServiceImageFile(null);
    } catch (error) {
      showToast('error', error.message || 'Service submit failed.');
    }
  };

  const handleEditServiceClick = (service) => {
    setServiceFormMode('edit');
    setCurrentServiceId(service._id);
    setServiceForm({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || 'Activity',
      status: service.status || 'active',
    });
    setServiceImageFile(null);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      const res = await servicesService.delete(id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        setStats((prev) => ({ ...prev, services: prev.services - 1 }));
        showToast('success', 'Service deleted successfully.');
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to delete service.');
    }
  };

  // Add/Edit Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('status', productForm.status);

      if (productImageFile) {
        formData.append('image', productImageFile);
      } else if (productFormMode === 'add') {
        showToast('error', 'Please upload a product image.');
        return;
      }

      let res;
      if (productFormMode === 'add') {
        res = await productsService.create(formData);
        if (res.success) {
          showToast('success', 'Product created successfully.');
          setProducts((prev) => [res.data, ...prev]);
          setStats((prev) => ({ ...prev, products: prev.products + 1 }));
        }
      } else {
        res = await productsService.update(currentProductId, formData);
        if (res.success) {
          showToast('success', 'Product updated successfully.');
          setProducts((prev) =>
            prev.map((p) => (p._id === currentProductId ? res.data : p))
          );
        }
      }
      setShowProductForm(false);
      setProductForm({ name: '', description: '', price: 0, category: 'General', status: 'active' });
      setProductImageFile(null);
    } catch (error) {
      showToast('error', error.message || 'Product submit failed.');
    }
  };

  const handleEditProductClick = (product) => {
    setProductFormMode('edit');
    setCurrentProductId(product._id);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || 'General',
      status: product.status || 'active',
    });
    setProductImageFile(null);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await productsService.delete(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setStats((prev) => ({ ...prev, products: prev.products - 1 }));
        showToast('success', 'Product deleted successfully.');
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to delete product.');
    }
  };

  // Add/Edit Gallery item
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryImageFile && galleryFormMode === 'add') {
      showToast('error', 'Please upload a gallery image.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      formData.append('category', galleryForm.category);
      formData.append('description', galleryForm.description);
      formData.append('order', galleryForm.order);
      if (galleryImageFile) {
        formData.append('image', galleryImageFile);
      }

      let res;
      if (galleryFormMode === 'add') {
        res = await galleryService.create(formData);
        if (res.success) {
          showToast('success', 'Gallery item uploaded successfully.');
          setGallery((prev) => [...prev, res.data].sort((a, b) => a.order - b.order));
          setStats((prev) => ({ ...prev, gallery: prev.gallery + 1 }));
        }
      } else {
        res = await galleryService.update(currentGalleryId, formData);
        if (res.success) {
          showToast('success', 'Gallery item updated successfully.');
          setGallery((prev) =>
            prev.map((g) => (g._id === currentGalleryId ? res.data : g)).sort((a, b) => a.order - b.order)
          );
        }
      }
      
      setShowGalleryForm(false);
      setGalleryForm({ title: '', category: 'General', description: '', order: 0 });
      setGalleryImageFile(null);
    } catch (error) {
      showToast('error', error.message || 'Gallery operation failed.');
    }
  };

  const handleEditGalleryClick = (item) => {
    setGalleryFormMode('edit');
    setCurrentGalleryId(item._id);
    setGalleryForm({
      title: item.title || '',
      category: item.category || 'General',
      description: item.description || '',
      order: item.order || 0,
    });
    setGalleryImageFile(null);
    setShowGalleryForm(true);
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      const res = await galleryService.delete(id);
      if (res.success) {
        setGallery((prev) => prev.filter((item) => item._id !== id));
        setStats((prev) => ({ ...prev, gallery: prev.gallery - 1 }));
        showToast('success', 'Image deleted from gallery.');
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to delete gallery item.');
    }
  };

  // Password update submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'New password and confirm password fields must match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmittingPassword(true);
      const res = await authService.updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (res.success) {
        showToast('success', 'Admin security password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showToast('error', error.message || 'Security update failed.');
    } finally {
      setSubmittingPassword(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-slate-400 animate-pulse-subtle">Accessing secure system data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      {/* Dashboard Heading Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">Admin Control Dashboard</h1>
          <p className="text-sm text-slate-450 dark:text-slate-400 mt-1">
            Manage your company details, modify services and products lists, and read incoming messages.
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            showToast('success', 'Logged out successfully');
            navigate('/');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Exit Panel</span>
        </button>
      </div>

      {/* Analytics Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard hover={false} className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-850">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Messages</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats.messages}</h3>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-850">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
            <Grid size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Services</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats.services}</h3>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-850">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Products</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats.products}</h3>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-850">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
            <Image size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gallery Images</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats.gallery}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Tab Controls */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 mb-8 gap-2">
        {[
          { id: 'inquiries', label: 'Messages', icon: Mail },
          { id: 'company', label: 'Company Details', icon: Settings },
          { id: 'services', label: 'Services', icon: Grid },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'gallery', label: 'Gallery', icon: Image },
          { id: 'security', label: 'Security', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${active
                ? 'border-primary-500 text-primary-500 dark:text-primary-400 bg-primary-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850/50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: INQUIRIES ================= */ }
  {
    activeTab === 'inquiries' && (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">Customer Inquiries</h2>
          <span className="text-xs text-slate-400 font-bold">{messages.length} inquiries received</span>
        </div>

        {messages.length === 0 ? (
          <GlassCard hover={false} className="p-8 text-center text-slate-500">
            No inquiries found. Contact forms are fully functional.
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const unread = msg.status === 'unread';
              return (
                <GlassCard
                  key={msg._id}
                  hover={false}
                  className={`border transition-colors ${unread
                      ? 'border-primary-500/30 bg-primary-500/[0.02] dark:bg-primary-500/[0.01]'
                      : 'border-slate-200 dark:border-slate-800'
                    }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Bar */}
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-850 dark:text-white">{msg.name}</h4>
                          {unread && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-primary-500 text-white uppercase tracking-wider animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-450">{msg.email} | {msg.phone || 'No Phone'}</span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar size={14} />
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })}
                      </span>
                    </div>

                    {/* Content Subject & Body */}
                    <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Subject: {msg.subject}</span>
                      <p className="text-sm text-slate-650 dark:text-slate-350 mt-1 whitespace-pre-line leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                      <button
                        onClick={() => toggleMessageStatus(msg._id, msg.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${unread
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                            : 'bg-slate-200 dark:bg-slate-800 border-transparent hover:bg-slate-300 dark:hover:bg-slate-700'
                          }`}
                      >
                        {unread ? 'Mark as Read' : 'Mark as Unread'}
                      </button>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    )
  }

  {/* ================= TAB 2: COMPANY DETAILS ================= */ }
  {
    activeTab === 'company' && editCompanyForm && (
      <form onSubmit={handleCompanyUpdate} className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">Update Company Settings</h2>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/15"
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left side Form */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <GlassCard hover={false} className="flex flex-col gap-5 p-6 border border-slate-200 dark:border-slate-850">
              <h3 className="font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2">Public Branding</h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  value={editCompanyForm.name}
                  onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                  required
                  className="px-4 py-2.5 rounded-xl border glass-input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Short Description / Pitch</label>
                <textarea
                  value={editCompanyForm.description}
                  onChange={(e) => setEditCompanyForm({ ...editCompanyForm, description: e.target.value })}
                  required
                  rows="3"
                  className="px-4 py-2.5 rounded-xl border glass-input resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mission Statement</label>
                  <textarea
                    value={editCompanyForm.mission}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, mission: e.target.value })}
                    required
                    rows="3"
                    className="px-4 py-2.5 rounded-xl border glass-input resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Vision Statement</label>
                  <textarea
                    value={editCompanyForm.vision}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, vision: e.target.value })}
                    required
                    rows="3"
                    className="px-4 py-2.5 rounded-xl border glass-input resize-none"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex flex-col gap-5 p-6 border border-slate-200 dark:border-slate-850">
              <h3 className="font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2">Direct Contact Channels</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Contact Phone Number</label>
                  <input
                    type="text"
                    value={editCompanyForm.phone}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, phone: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">WhatsApp Number (e.g. +1234567890)</label>
                  <input
                    type="text"
                    value={editCompanyForm.whatsapp}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, whatsapp: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={editCompanyForm.email}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, email: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Physical Address</label>
                  <input
                    type="text"
                    value={editCompanyForm.address}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, address: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Google Map Embed iframe URL</label>
                <input
                  type="text"
                  value={editCompanyForm.mapEmbedUrl}
                  onChange={(e) => setEditCompanyForm({ ...editCompanyForm, mapEmbedUrl: e.target.value })}
                  placeholder="https://google.com/maps/embed..."
                  className="px-4 py-2.5 rounded-xl border glass-input text-xs"
                />
              </div>
            </GlassCard>
          </div>

          {/* Right side Logo and Social links */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassCard hover={false} className="flex flex-col items-center gap-4 p-6 border border-slate-200 dark:border-slate-850">
              <h3 className="font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2 w-full text-center">Company Logo</h3>

              {companyLogoFile ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-dashed border-primary-500">
                  <span className="text-[10px] text-primary-500 font-bold p-1 text-center truncate">{companyLogoFile.name}</span>
                </div>
              ) : companyDetails?.logo ? (
                <img
                  src={getMediaUrl(companyDetails.logo)}
                  alt="Logo preview"
                  className="w-24 h-24 object-contain rounded-2xl p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                  No Logo
                </div>
              )}

              <label className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 cursor-pointer transition-colors text-slate-600 dark:text-slate-300">
                <Upload size={14} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCompanyLogoFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </GlassCard>

            <GlassCard hover={false} className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-slate-850">
              <h3 className="font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2">Social Networking Links</h3>

              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                <div key={platform} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{platform}</label>
                  <input
                    type="url"
                    placeholder={`https://${platform}.com/...`}
                    value={editCompanyForm.socialLinks[platform] || ''}
                    onChange={(e) =>
                      setEditCompanyForm({
                        ...editCompanyForm,
                        socialLinks: {
                          ...editCompanyForm.socialLinks,
                          [platform]: e.target.value,
                        },
                      })
                    }
                    className="px-3.5 py-2 rounded-lg border glass-input text-xs"
                  />
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </form>
    )
  }

  {/* ================= TAB 3: SERVICES ================= */ }
  {
    activeTab === 'services' && (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">Manage Services</h2>
          {!showServiceForm && (
            <button
              onClick={() => {
                setServiceFormMode('add');
                setServiceForm({ title: '', description: '', icon: 'Activity', status: 'active' });
                setServiceImageFile(null);
                setShowServiceForm(true);
              }}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/15"
            >
              <Plus size={16} />
              <span>Add Service</span>
            </button>
          )}
        </div>

        {/* Service Add/Edit Form Overlay */}
        {showServiceForm && (
          <GlassCard hover={false} className="border border-primary-500/35 p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 capitalize">{serviceFormMode} Service</h3>
            <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Service Title *</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    required
                    className="px-3.5 py-2 rounded-lg border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Service Icon Name (Lucide name)</label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="px-3.5 py-2 rounded-lg border glass-input dark:bg-slate-900"
                  >
                    {['Activity', 'Globe', 'Smartphone', 'Figma', 'Cloud', 'Lock', 'Database', 'Code'].map((ico) => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="serviceStatus"
                        checked={serviceForm.status === 'active'}
                        onChange={() => setServiceForm({ ...serviceForm, status: 'active' })}
                        className="accent-primary-500"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="serviceStatus"
                        checked={serviceForm.status === 'inactive'}
                        onChange={() => setServiceForm({ ...serviceForm, status: 'inactive' })}
                        className="accent-primary-500"
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Description *</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    rows="4"
                    className="px-3.5 py-2 rounded-lg border glass-input resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Cover Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setServiceImageFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setShowServiceForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {serviceFormMode === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Services List Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <GlassCard key={s._id} hover={false} className="flex flex-col justify-between border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-xs">
                      {s.icon.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{s.title}</h4>
                      <span className={`text-[10px] font-extrabold uppercase ${s.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditServiceClick(s)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                      title="Edit service"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(s._id)}
                      className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                      title="Delete service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mt-2">
                  {s.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  {/* ================= TAB 4: PRODUCTS ================= */ }
  {
    activeTab === 'products' && (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">Manage Products</h2>
          {!showProductForm && (
            <button
              onClick={() => {
                setProductFormMode('add');
                setProductForm({ name: '', description: '', price: 0, category: 'General', status: 'active' });
                setProductImageFile(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/15"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* Product form overlay */}
        {showProductForm && (
          <GlassCard hover={false} className="border border-primary-500/35 p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 capitalize">{productFormMode} Product</h3>
            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="px-3.5 py-2 rounded-lg border glass-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      required
                      className="px-3.5 py-2 rounded-lg border glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Category *</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                      className="px-3.5 py-2 rounded-lg border glass-input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="productStatus"
                        checked={productForm.status === 'active'}
                        onChange={() => setProductForm({ ...productForm, status: 'active' })}
                        className="accent-primary-500"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="productStatus"
                        checked={productForm.status === 'inactive'}
                        onChange={() => setProductForm({ ...productForm, status: 'inactive' })}
                        className="accent-primary-500"
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Description *</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                    rows="4"
                    className="px-3.5 py-2 rounded-lg border glass-input resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProductImageFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {productFormMode === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Products List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <GlassCard key={p._id} hover={false} className="flex flex-col justify-between p-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-full">
              <div className="relative aspect-video w-full">
                <img
                  src={getMediaUrl(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover bg-slate-900"
                />
                <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {p.category}
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                    <span className="font-extrabold text-primary-500 text-base">${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span className={`text-[10px] font-extrabold uppercase ${p.status === 'active' ? 'text-emerald-500' : 'text-slate-450'}`}>
                    {p.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  {/* ================= TAB 5: GALLERY ================= */ }
  {
    activeTab === 'gallery' && (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">Manage Gallery</h2>
          {!showGalleryForm && (
            <button
              onClick={() => {
                setGalleryFormMode('add');
                setGalleryForm({ title: '', category: 'General', description: '', order: 0 });
                setGalleryImageFile(null);
                setShowGalleryForm(true);
              }}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/15"
            >
              <Plus size={16} />
              <span>Upload Image</span>
            </button>
          )}
        </div>

        {/* Gallery form overlay */}
        {showGalleryForm && (
          <GlassCard hover={false} className="border border-primary-500/35 p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 capitalize">{galleryFormMode} Gallery Image</h3>
            <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Image Title (Optional)</label>
                  <input
                    type="text"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="e.g. Creative Hackathon 2026"
                    className="px-3.5 py-2 rounded-lg border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Category *</label>
                  <input
                    type="text"
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    placeholder="e.g. Office, Events, Technology"
                    required
                    className="px-3.5 py-2 rounded-lg border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Upload Image File {galleryFormMode === 'add' && '*'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setGalleryImageFile(e.target.files[0]);
                      }
                    }}
                    required={galleryFormMode === 'add'}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Order (Lower numbers appear first)</label>
                  <input
                    type="number"
                    value={galleryForm.order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, order: parseInt(e.target.value) || 0 })}
                    className="px-3.5 py-2 rounded-lg border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Short Description (Optional)</label>
                  <textarea
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    rows="3"
                    placeholder="Context about when/where this photo was captured"
                    className="px-3.5 py-2 rounded-lg border glass-input resize-none"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGalleryForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {galleryFormMode === 'add' ? 'Upload Image' : 'Save Changes'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Gallery display cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div key={item._id} className="relative rounded-xl overflow-hidden aspect-square group shadow border border-slate-200 dark:border-slate-800 bg-slate-900">
              <img
                src={getMediaUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditGalleryClick(item)}
                  className="p-1.5 rounded bg-blue-500 text-white shadow hover:bg-blue-600"
                  title="Edit image"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => handleDeleteGallery(item._id)}
                  className="p-1.5 rounded bg-rose-500 text-white shadow hover:bg-rose-600"
                  title="Delete image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="absolute top-2 left-2 flex gap-1 opacity-100 transition-opacity">
                <span className="px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                  {item.order !== undefined ? item.order : 0}
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-slate-950/70 backdrop-blur-xs text-white text-[10px] flex flex-col">
                <span className="font-bold truncate">{item.title || 'Untitled Image'}</span>
                <span className="text-[9px] text-primary-400 mt-0.5">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  {/* ================= TAB 6: SECURITY / PASSWORDS ================= */ }
  {
    activeTab === 'security' && (
      <div className="max-w-xl">
        <GlassCard hover={false} className="p-6 border border-slate-200 dark:border-slate-850">
          <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-2 mb-5">Change Access Password</h3>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                placeholder="Enter current active password"
                className="px-4 py-2.5 rounded-xl border glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                placeholder="At least 6 characters"
                className="px-4 py-2.5 rounded-xl border glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                placeholder="Repeat new password"
                className="px-4 py-2.5 rounded-xl border glass-input"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={submittingPassword}
                className="w-full flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow disabled:opacity-70 transition-all hover:scale-102"
              >
                <Lock size={16} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    )
  }

    </div >
  );
};

export default AdminDashboard;
