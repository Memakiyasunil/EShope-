import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText, Globe, Shield, HelpCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';

const PAGES = [
  { key: 'about', label: 'About Us', icon: Info },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
  { key: 'terms', label: 'Terms & Conditions', icon: FileText },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'contact', label: 'Contact Info', icon: Globe },
];

const AdminCMS = () => {
  const [activePage, setActivePage] = useState('about');
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      const s = data.settings || data.data || data;
      setContents({
        about: s.cmsAbout || '',
        privacy: s.cmsPrivacy || '',
        terms: s.cmsTerms || '',
        faq: s.cmsFaq || '',
        contact: s.cmsContact || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', {
        cmsAbout: contents.about,
        cmsPrivacy: contents.privacy,
        cmsTerms: contents.terms,
        cmsFaq: contents.faq,
        cmsContact: contents.contact,
      });
      toast.success('Page content saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const activePageData = PAGES.find(p => p.key === activePage);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">CMS Management</h1>
        <p className="text-slate-500 mt-1">Manage static page content across your platform</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <GlassCard className="p-3 h-fit">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 py-2 mb-1">Pages</p>
          <nav className="space-y-1">
            {PAGES.map(page => (
              <button
                key={page.key}
                onClick={() => setActivePage(page.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activePage === page.key
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <page.icon size={16} />
                {page.label}
              </button>
            ))}
          </nav>
        </GlassCard>

        {/* Editor */}
        <GlassCard className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {activePageData && <activePageData.icon size={20} className="text-brand-500" />}
              <h2 className="font-bold text-slate-900 dark:text-white">{activePageData?.label}</h2>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {loading ? (
            <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Use plain text or simple HTML. This content will be displayed on the <strong className="text-slate-700 dark:text-slate-300">{activePageData?.label}</strong> page.
              </p>
              <textarea
                value={contents[activePage] || ''}
                onChange={e => setContents({ ...contents, [activePage]: e.target.value })}
                rows={20}
                className="input-field w-full resize-y font-mono text-sm leading-relaxed"
                placeholder={`Write your ${activePageData?.label} content here. You can use HTML tags for formatting.\n\nExample:\n<h2>Our Mission</h2>\n<p>We are dedicated to...</p>`}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{(contents[activePage] || '').length} characters</p>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-6 flex items-center gap-2">
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default AdminCMS;
