import React, { useState, useEffect } from 'react';
import { Database, Download, Terminal, Copy, Check, RefreshCw, Table, Flame, FileCode } from 'lucide-react';

export const DatabaseAdmin = ({ dbStatus, onRefresh }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const [sqlSchema, setSqlSchema] = useState('');
  const [firebaseBp, setFirebaseBp] = useState('');
  const [loadingSql, setLoadingSql] = useState(false);
  const [loadingBp, setLoadingBp] = useState(false);
  const [activeTable, setActiveTable] = useState('orders');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchSqlSchema();
    fetchFirebaseBlueprint();
    fetchTableRecords(activeTable);
  }, [activeTable]);

  const fetchSqlSchema = async () => {
    setLoadingSql(true);
    try {
      const res = await fetch('/api/db/export-sql');
      if (res.ok) {
        const text = await res.text();
        setSqlSchema(text);
      }
    } catch (err) {
      console.error('SQL export fetch error:', err);
    } finally {
      setLoadingSql(false);
    }
  };

  const fetchFirebaseBlueprint = async () => {
    setLoadingBp(true);
    try {
      const res = await fetch('/api/db/firebase-blueprint');
      if (res.ok) {
        const text = await res.text();
        setFirebaseBp(text);
      }
    } catch (err) {
      console.error('Firebase Blueprint fetch error:', err);
    } finally {
      setLoadingBp(false);
    }
  };

  const fetchTableRecords = async (tableName) => {
    try {
      if (tableName === 'orders') {
        const res = await fetch('/api/orders');
        if (res.ok) setTableData(await res.json());
      } else if (tableName === 'services') {
        const res = await fetch('/api/services');
        if (res.ok) setTableData(await res.json());
      }
    } catch (err) {
      console.error('Table fetch error:', err);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(firebaseBp);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-white">Database & Firebase Migration Hub</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  dbStatus?.connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Firebase Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{dbStatus?.message}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Status</span>
            </button>

            <a
              href="/api/db/export-firebase"
              download="firebase_firestore_dump.json"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow flex items-center space-x-2 transition"
            >
              <Flame className="w-4 h-4" />
              <span>Export Firebase Dump (.json)</span>
            </a>

            <a
              href="/api/db/export-sql"
              download="freelance_db_schema.sql"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow flex items-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export MySQL DDL (.sql)</span>
            </a>
          </div>
        </div>

        {/* Firebase & Database Spec Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Target</span>
            <span className="font-mono text-amber-400 font-bold">Firebase Firestore</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Schema Representation</span>
            <span className="font-mono text-cyan-300 font-bold">firebase-blueprint.json</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Security Rules</span>
            <span className="font-mono text-pink-300 font-bold">firestore.rules</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Secondary Storage</span>
            <span className="font-mono text-emerald-400 font-bold">MySQL InnoDB UTF8MB4</span>
          </div>
        </div>
      </div>

      {/* Interactive Table Data Browser */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Table className="w-5 h-5 text-indigo-400" />
              <span>Live Database & Firestore Record Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">Inspect raw records ready to import into Firebase Firestore</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['orders', 'services'].map((tbl) => (
              <button
                key={tbl}
                onClick={() => setActiveTable(tbl)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  activeTable === tbl
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tbl} ({dbStatus?.recordCounts?.[tbl] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
          <pre className="p-4 text-[11px] font-mono text-cyan-300 max-h-80 overflow-y-auto">
            {JSON.stringify(tableData, null, 2)}
          </pre>
        </div>
      </div>

      {/* Grid: Firebase Blueprint + MySQL DDL Viewers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Firebase Blueprint Viewer */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Firebase Blueprint (`firebase-blueprint.json`)</h3>
            </div>
            <button
              onClick={handleCopyBlueprint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition"
            >
              {copiedBlueprint ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBlueprint ? 'Copied!' : 'Copy Blueprint'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-amber-300 max-h-80 overflow-y-auto leading-relaxed">
            {loadingBp ? 'Loading Firebase Blueprint...' : firebaseBp}
          </div>
        </div>

        {/* MySQL DDL Dump */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">MySQL DDL Dump (`schema.sql`)</h3>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-300 max-h-80 overflow-y-auto leading-relaxed">
            {loadingSql ? 'Loading SQL Schema script...' : sqlSchema}
          </div>
        </div>

      </div>

    </div>
  );
};
