import React, { useState } from 'react';
import { X, Building2, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OrganizationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationCreateModal: React.FC<OrganizationCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createNewOrganization } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('Chief Executive Officer');
  const [industry, setIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const res = await createNewOrganization(name, generatedSlug, title, industry);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to create organization');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#0F141E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white font-heading">Create Organization Tenancy</h2>
          </div>
          <p className="text-xs text-slate-400">
            Establish a new private enterprise workspace. You will be atomically assigned as the Owner.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 my-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Organization Legal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                }
              }}
              placeholder="e.g. Acme Quantum Capital"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Workspace Domain Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. acme-quantum"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Executive Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Managing Partner, Founder, CEO"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Primary Industry / Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. DeepTech & Quantum Systems"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer font-heading"
            >
              <Plus className="h-4 w-4" />
              <span>{isSubmitting ? 'Establishing Workspace...' : 'Establish Organization'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
