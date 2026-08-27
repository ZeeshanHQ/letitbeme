import React from 'react';
import { Shield, Lock, CheckCircle2, UserCheck } from 'lucide-react';

export const TrustSecuritySection: React.FC = () => {
  const securityItems = [
    {
      icon: Shield,
      title: 'Permission-Gated by Default',
      description: 'Your profile and contact information are protected from unsolicited scraping, cold outreach, and unauthorized third-party discovery.',
    },
    {
      icon: Lock,
      title: 'Isolated Member Data Partitions',
      description: 'Private records, contact details, and digital library files are strictly segregated by account with zero cross-member data pooling.',
    },
    {
      icon: CheckCircle2,
      title: 'Mandatory Human Review',
      description: 'All AI-drafted communications and synthesis require explicit human approval. The platform never acts autonomously on your behalf.',
    },
    {
      icon: UserCheck,
      title: 'Verified Enterprise Tenancy',
      description: 'Organizations operate within structured governance workspaces with defined ownership, member status, and administrative authority.',
    },
  ];

  return (
    <section id="security" className="py-28 sm:py-36 bg-slate-900 text-white select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 space-y-20">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-[-0.03em] leading-tight">
            Institutional security and sovereign data protection.
          </h2>
          <p className="text-base font-light text-slate-400 leading-relaxed">
            Designed from the foundation for enterprise leaders, executive teams, and institutional partners requiring high-assurance privacy standards.
          </p>
        </div>

        {/* 4 Clean Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-light text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
