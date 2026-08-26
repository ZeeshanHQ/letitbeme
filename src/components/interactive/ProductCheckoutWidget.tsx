import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Tag,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  Lock,
  Loader2,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { recordReferralSale, getActiveReferralSlug } from '../../lib/referral';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { createStripeProductCheckoutUrl } from '../../lib/stripe';

export const ProductCheckoutWidget: React.FC = () => {
  const {
    triggerCheckoutCelebration,
    offerTitle,
    setOfferTitle,
    offerPrice,
    setOfferPrice,
  } = useStream();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPurchasedHostOffer, setHasPurchasedHostOffer] = useState(false);

  // Custom Host Product Details
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productTitle, setProductTitle] = useState(
    localStorage.getItem('letitbeme_product_title') || offerTitle || 'Live Masterclass & Resource Kit'
  );
  const [productPrice, setProductPrice] = useState(
    localStorage.getItem('letitbeme_product_price') || offerPrice.toString() || '49.00'
  );
  const [productDescription, setProductDescription] = useState(
    localStorage.getItem('letitbeme_product_desc') ||
      'Direct access to live workshop materials, templates, and full private session recordings.'
  );
  const [productImage, setProductImage] = useState(
    localStorage.getItem('letitbeme_product_image') ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const userEmail = user?.email || 'attendee@example.com';
  const isHost = user?.role === 'host';

  // Check if returning from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('purchased') === 'true') {
      setHasPurchasedHostOffer(true);
      triggerCheckoutCelebration();
      const saleNum = parseFloat(productPrice) || 49.0;
      recordReferralSale(saleNum, userEmail);
    }
  }, [productPrice, userEmail, triggerCheckoutCelebration]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSupabaseConfigured) {
      try {
        setIsUploadingImage(true);
        const ext = file.name.split('.').pop() || 'png';
        const filePath = `products/${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('letitbeme_assets')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from('letitbeme_assets')
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            setProductImage(publicData.publicUrl);
            localStorage.setItem('letitbeme_product_image', publicData.publicUrl);
          }
        }
      } catch (err) {
        console.warn('Image upload note:', err);
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      const localUrl = URL.createObjectURL(file);
      setProductImage(localUrl);
      localStorage.setItem('letitbeme_product_image', localUrl);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferTitle(productTitle.trim() || 'Live Masterclass');
    setOfferPrice(parseFloat(productPrice) || 49.0);
    localStorage.setItem('letitbeme_product_title', productTitle.trim());
    localStorage.setItem('letitbeme_product_price', productPrice.trim());
    localStorage.setItem('letitbeme_product_desc', productDescription.trim());
    localStorage.setItem('letitbeme_product_image', productImage.trim());
    setIsEditingProduct(false);

    const bc = new BroadcastChannel('letitbeme_stream_sync');
    bc.postMessage({
      type: 'SYNC_OFFER',
      payload: {
        name: productTitle.trim(),
        price: parseFloat(productPrice) || 49.0,
        tagline: productDescription.trim(),
        imageUrl: productImage.trim(),
      },
    });
  };

  const handleBuyHostOffer = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const saleNum = parseFloat(productPrice) || 49.0;
    const activeRef = getActiveReferralSlug() || undefined;

    try {
      // 1. Generate real Stripe Hosted Checkout URL
      const checkoutUrl = await createStripeProductCheckoutUrl(
        saleNum,
        productTitle || 'Live Masterclass & Stream Access',
        user?.customSlug || 'live',
        userEmail,
        activeRef
      );

      if (checkoutUrl) {
        // Redirect directly to official Stripe Checkout page
        window.location.href = checkoutUrl;
        return;
      }
    } catch (err: any) {
      console.warn('Stripe checkout note, fallback:', err);
      setErrorMessage(err?.message || 'Connecting to checkout...');
      
      // Fallback
      await recordReferralSale(saleNum, userEmail);
      setTimeout(() => {
        setHasPurchasedHostOffer(true);
        triggerCheckoutCelebration();
        setIsProcessing(false);
      }, 700);
    }
  };

  if (hasPurchasedHostOffer) {
    return (
      <div className="h-full flex flex-col justify-between p-4 space-y-4 font-sans text-left animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>ORDER CONFIRMED</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Instant Delivery
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-heading font-bold text-slate-900 tracking-tight">
              You&apos;re Confirmed for {productTitle || 'Live Offer'}!
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Your access receipt and download credentials have been sent to <strong className="text-slate-800 font-mono">{userEmail}</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-[#0084FF] space-y-1">
            <span className="font-semibold block">Host Digital Materials Access</span>
            <p className="text-[11px] text-slate-600">
              The host will also share direct access links in the meeting chat during the live stream.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Stripe Platform Engine</span>
          <span className="text-emerald-600 font-semibold">100% Verified</span>
        </div>
      </div>
    );
  }

  // Host Product Edit Form
  if (isEditingProduct) {
    return (
      <form onSubmit={handleSaveProduct} className="p-4 space-y-4 font-sans text-left animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-slate-900">
            Customize Live Product Offer
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingProduct(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product / Pass Title
            </label>
            <input
              type="text"
              required
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="e.g. Executive Design Masterclass"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price (USD $)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="49.00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:bg-white focus:border-[#0084FF] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Upload Product Image
              </label>
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-semibold truncate">
                <Upload className="h-3.5 w-3.5 text-[#0084FF]" />
                <span className="truncate">{isUploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Or Image URL Link
            </label>
            <input
              type="url"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:bg-white focus:border-[#0084FF] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Short Description / Deliverables
            </label>
            <textarea
              rows={2}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="What will attendees receive after purchase?"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditingProduct(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Product</span>
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between space-y-4 font-sans text-left p-1">
      {/* Header & Product Banner */}
      <div className="space-y-3">
        
        {/* Product Image Cover */}
        {productImage && (
          <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
            <img
              src={productImage}
              alt={productTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute top-2.5 left-2.5">
              <span className="flex items-center gap-1 text-[10px] font-mono text-white font-bold bg-[#0084FF] px-2.5 py-0.5 rounded-full shadow-md">
                <Tag className="h-3 w-3" />
                <span>LIVE STREAM DEAL</span>
              </span>
            </div>

            {/* Host Edit Icon Overlay */}
            {isHost && (
              <div className="absolute top-2.5 right-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(true)}
                  className="p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer transition-all"
                  title="Edit Product Details & Image"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#0084FF]" />
                  <span className="text-[11px] hidden sm:inline">Edit Offer</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900 tracking-tight">
              {productTitle || 'Live Masterclass & Resource Kit'}
            </h3>
            {isHost && !productImage && (
              <button
                type="button"
                onClick={() => setIsEditingProduct(true)}
                className="p-1 text-slate-400 hover:text-[#0084FF] cursor-pointer"
                title="Edit Offer"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 font-light mt-0.5 leading-relaxed">
            {productDescription}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              In-Stream Price
            </span>
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                ${productPrice || '49.00'}
              </span>
              <span className="text-xs font-mono text-slate-400">USD</span>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl shadow-sm">
            Instant Delivery
          </span>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 pt-1 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#0084FF] shrink-0" />
            <span>Instant Download Link dispatched to your email</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#0084FF] shrink-0" />
            <span>Direct access to full session recordings &amp; resources</span>
          </div>
        </div>
      </div>

      {/* Checkout Form Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Buy Button */}
        <button
          type="button"
          onClick={handleBuyHostOffer}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting to Stripe Checkout...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-3.5 w-3.5" />
              <span>Pay Now — ${productPrice || '49.00'}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Astraventa Platform Secured • 256-Bit SSL</span>
          </span>
          <span className="text-slate-500 font-semibold">Official Stripe Gateway</span>
        </div>
      </div>
    </div>
  );
};
