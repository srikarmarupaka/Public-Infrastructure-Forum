import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, HardDriveUpload, Check, Trash, Trash2, Mail, Users, ClipboardList } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { audits, subscribersCount, approveAudit, deleteAudit, seedInitialData, language } = useApp();

  // Pending audits
  const pendingAudits = audits.filter(a => !a.approvedByAdmin);

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-natural-border pb-4">
        <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-natural-primary tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-natural-primary" />
          <span>Core Team Admin Dashboard</span>
        </h2>
        <p className="text-xs text-natural-secondary mt-1">
          Welcome PIF Core Team. You have read/write access to verify citizen audits, seed initial baseline datasets, and edit public news repositories.
        </p>
      </div>

      {/* Aggregate stats summary specifically for admins */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-natural-accent-light/10 p-4 rounded-xl border border-natural-accent/25 space-y-1">
          <div className="flex items-center space-x-2 text-natural-accent font-bold">
            <ClipboardList className="w-4 h-4" />
            <h4 className="font-semibold text-xs tracking-wide uppercase">Pending Audits</h4>
          </div>
          <h3 className="font-sans font-black text-2xl text-natural-text">{pendingAudits.length} Reports</h3>
          <p className="text-[10px] text-natural-accent">Citizen audits waiting for verification review.</p>
        </div>

        <div className="bg-natural-muted p-4 rounded-xl border border-natural-border space-y-1">
          <div className="flex items-center space-x-2 text-natural-text font-bold">
            <Mail className="w-4 h-4" />
            <h4 className="font-semibold text-xs tracking-wide uppercase">Newsletter Subscribers</h4>
          </div>
          <h3 className="font-sans font-black text-2xl text-natural-text">{subscribersCount} Users</h3>
          <p className="text-[10px] text-natural-secondary">Subscribers registered for monthly circulars.</p>
        </div>

        {/* Database Bootstrapper Seed Button */}
        <div className="bg-[#F0F2EE]/55 p-4 rounded-xl border border-natural-border flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-natural-primary tracking-wide uppercase flex items-center space-x-1">
              <HardDriveUpload className="w-4 h-4" />
              <span>Database Bootstrapper</span>
            </h4>
            <p className="text-[10px] text-natural-secondary">Sync baseline agendas, research articles, and dispatches to this Firestore instance immediately.</p>
          </div>
          <button
            onClick={async () => {
              await seedInitialData();
              alert("Baseline seed files flushed to Firestore collections successfully.");
            }}
            className="w-full text-center py-1.5 bg-natural-primary hover:bg-[#3E4E35] text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Seed Baseline Data
          </button>
        </div>
      </section>

      {/* Verification Moderation Queue */}
      <section className="space-y-4">
        <h3 className="font-sans font-extrabold text-sm text-natural-text flex items-center space-x-1.5">
          <span>Verification Moderation Queue</span>
          <span className="text-xs bg-natural-accent-light text-natural-accent font-mono font-bold px-2 py-0.5 rounded-full">
            {pendingAudits.length} Pending
          </span>
        </h3>

        {pendingAudits.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-natural-border rounded-xl bg-natural-muted">
            <ShieldCheck className="w-8 h-8 text-natural-primary/55 mx-auto animate-pulse" />
            <p className="text-xs text-natural-secondary mt-2 font-mono">No reports waiting for verification. Good job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAudits.map((item, index) => {
              return (
                <div key={item.id || index} className="bg-white border border-natural-border p-4 rounded-xl flex flex-col md:flex-row items-start justify-between gap-4 shadow-2xs">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt="Audit Evidence"
                        className="w-24 h-24 object-cover rounded-lg border border-natural-border shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold tracking-wider bg-natural-muted text-natural-secondary px-1.5 py-0.5 rounded border border-natural-border">
                          {item.infraType}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-natural-secondary">
                          Quality: <b className="text-natural-text">{item.qualityScore}%</b> | Climate: <b className="text-natural-text">{item.climateScore}/10</b>
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-xs text-natural-text block">{item.locationName}</h4>
                      <p className="text-xs text-natural-dark-secondary font-light leading-relaxed">{item.comments}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 self-stretch md:self-auto shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => approveAudit(item.id)}
                      className="px-3 py-1.5 bg-natural-primary hover:bg-[#3E4E35] text-white font-bold text-xs rounded-lg flex items-center space-x-1 shadow-xs font-bold transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => deleteAudit(item.id)}
                      className="px-3 py-1.5 text-natural-dark-secondary bg-white hover:bg-natural-muted border border-natural-border rounded-lg flex items-center space-x-1 transition-all font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
