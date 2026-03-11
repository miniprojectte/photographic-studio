'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { reportsAPI } from '@/app/utils/api';
import {
    FileSpreadsheet,
    Calendar,
    TrendingUp,
    Download,
    ArrowLeft,
    RefreshCw,
    Users,
    Camera,
    IndianRupee,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
    BarChart3,
    FileText,
    Loader2,
    AlertCircle,
} from 'lucide-react';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);
const BASE_URL = 'http://localhost:5000/api';

// ── CSV helpers (pure browser, zero dependencies) ─────────────────

// Escape a CSV cell value
function csvCell(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Convert array-of-arrays to CSV string
function toCSV(rows) {
    return rows.map(row => row.map(csvCell).join(',')).join('\n');
}

// Trigger a CSV download using a data URI (always works in all browsers)
function downloadCSV(csvContent, filename) {
    const uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', filename);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ── Monthly CSV ───────────────────────────────────────────────────
function generateMonthlyCSV(data) {
    const rows = [
        ['MN Studio - Monthly Report'],
        [`Period: ${data.period.label}`],
        [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
        [],
        ['=== SUMMARY ==='],
        ['Total Bookings', data.summary.totalBookings],
        ['Total Sessions', data.summary.totalSessions],
        ['New Members', data.summary.newUsers],
        [`Total Revenue (Rs)`, data.summary.totalRevenue],
        [],
        ['=== BOOKINGS BY SESSION TYPE ==='],
        ['Session Type', 'Count'],
        ...Object.entries(data.bookingsByType).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
        [],
        ['=== BOOKINGS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.bookingsByStatus).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
        [],
        ['=== SESSIONS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.sessionsByStatus).map(([k, v]) => [k, v]),
        [],
        ['=== BOOKINGS DETAIL ==='],
        ['#', 'Client Name', 'Email', 'Phone', 'Session Type', 'Booking Date', 'Registered By', 'Status', 'Created On'],
        ...data.bookings.map((b, i) => [
            i + 1, b.name, b.email, b.phone,
            b.sessionType?.charAt(0).toUpperCase() + b.sessionType?.slice(1),
            b.date, b.user,
            b.status?.charAt(0).toUpperCase() + b.status?.slice(1),
            b.createdOn,
        ]),
        [],
        ['=== SESSIONS DETAIL ==='],
        ['#', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location', 'Notes'],
        ...data.sessions.map((s, i) => [
            i + 1, s.client, s.email, s.sessionType, s.date,
            s.status, s.price, s.location, s.notes,
        ]),
        [],
        ['=== NEW MEMBERS ==='],
        ['#', 'Name', 'Email', 'Role', 'Joined On'],
        ...data.newUsers.map((u, i) => [i + 1, u.name, u.email, u.role, u.joinedOn]),
    ];

    const label = data.period.label.replace(/\s+/g, '_');
    downloadCSV(toCSV(rows), `MN_Studio_Monthly_Report_${label}.csv`);
}

// ── Yearly CSV ────────────────────────────────────────────────────
function generateYearlyCSV(data) {
    const totals = data.monthlyBreakdown?.reduce(
        (acc, m) => ({
            bookings: acc.bookings + m.bookings,
            sessions: acc.sessions + m.sessions,
            revenue: acc.revenue + m.revenue,
            newUsers: acc.newUsers + m.newUsers,
        }),
        { bookings: 0, sessions: 0, revenue: 0, newUsers: 0 }
    ) || {};

    const rows = [
        ['MN Studio - Annual Report'],
        [`Year: ${data.period.year}`],
        [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
        [],
        ['=== ANNUAL SUMMARY ==='],
        ['Total Bookings', data.summary.totalBookings],
        ['Total Sessions', data.summary.totalSessions],
        ['New Members', data.summary.newUsers],
        ['Total Revenue (Rs)', data.summary.totalRevenue],
        [],
        ['=== BOOKINGS BY SESSION TYPE ==='],
        ['Session Type', 'Count'],
        ...Object.entries(data.bookingsByType).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
        [],
        ['=== BOOKINGS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.bookingsByStatus).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
        [],
        ['=== SESSIONS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.sessionsByStatus).map(([k, v]) => [k, v]),
        [],
        ['=== MONTHLY BREAKDOWN ==='],
        ['Month', 'Bookings', 'Sessions', 'Revenue (Rs)', 'New Members'],
        ...(data.monthlyBreakdown || []).map(m => [m.month, m.bookings, m.sessions, m.revenue, m.newUsers]),
        ['TOTAL', totals.bookings, totals.sessions, totals.revenue, totals.newUsers],
        [],
        ['=== TOP CLIENTS BY REVENUE ==='],
        ['#', 'Client', 'Email', 'Total Revenue (Rs)', 'Sessions Completed'],
        ...(data.topClients || []).map((c, i) => [i + 1, c.name, c.email, c.revenue, c.sessions]),
        [],
        ['=== ALL BOOKINGS ==='],
        ['#', 'Month', 'Client Name', 'Email', 'Phone', 'Session Type', 'Date', 'Status', 'Created On'],
        ...data.bookings.map((b, i) => [
            i + 1, b.month, b.name, b.email, b.phone,
            b.sessionType?.charAt(0).toUpperCase() + b.sessionType?.slice(1),
            b.date, b.status?.charAt(0).toUpperCase() + b.status?.slice(1), b.createdOn,
        ]),
        [],
        ['=== ALL SESSIONS ==='],
        ['#', 'Month', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location'],
        ...data.sessions.map((s, i) => [
            i + 1, s.month, s.client, s.email, s.sessionType, s.date, s.status, s.price, s.location,
        ]),
        [],
        ['=== NEW MEMBERS ==='],
        ['#', 'Month', 'Name', 'Email', 'Role', 'Joined On'],
        ...data.newUsers.map((u, i) => [i + 1, u.month, u.name, u.email, u.role, u.joinedOn]),
    ];

    downloadCSV(toCSV(rows), `MN_Studio_Annual_Report_${data.period.year}.csv`);
}

// ── Stat Card Component ───────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, prefix = '' }) {
    return (
        <motion.div
            className="p-5 rounded-xl bg-[#1A1A1A] border border-white/5 relative overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ background: `radial-gradient(circle at 0% 0%, ${color} 0%, transparent 70%)` }} />
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white">
                {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
            <p className="text-sm text-white/40 mt-1">{label}</p>
        </motion.div>
    );
}

// ── Breakdown Table ───────────────────────────────────────────────
function BreakdownTable({ title, data, icon: Icon }) {
    if (!data || Object.keys(data).length === 0) return null;
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    return (
        <div className="bg-[#1A1A1A] rounded-xl border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-[#C45D3E]" />
                <h3 className="font-semibold text-white text-sm">{title}</h3>
            </div>
            <div className="space-y-3">
                {Object.entries(data).map(([key, val]) => {
                    const pct = total > 0 ? (val / total) * 100 : 0;
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="text-white/70 capitalize">{key}</span>
                                <span className="text-white font-medium">{val}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-[#C45D3E] to-[#D4A853]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Monthly Breakdown Table (yearly) ──────────────────────────────
function MonthlyTable({ data }) {
    if (!data || data.length === 0) return null;
    const totals = data.reduce((acc, m) => ({
        bookings: acc.bookings + m.bookings,
        sessions: acc.sessions + m.sessions,
        revenue: acc.revenue + m.revenue,
        newUsers: acc.newUsers + m.newUsers,
    }), { bookings: 0, sessions: 0, revenue: 0, newUsers: 0 });

    return (
        <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C45D3E]" />
                    <h3 className="font-semibold text-white">Monthly Performance Breakdown</h3>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            {['Month', 'Bookings', 'Sessions', 'Revenue', 'New Members'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-white/40 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((row, idx) => (
                            <tr key={row.month} className="hover:bg-white/[0.02] transition-colors"
                                style={{ opacity: row.bookings + row.sessions === 0 ? 0.4 : 1 }}>
                                <td className="px-5 py-3 text-white font-medium">{row.month}</td>
                                <td className="px-5 py-3 text-white/70">{row.bookings}</td>
                                <td className="px-5 py-3 text-white/70">{row.sessions}</td>
                                <td className="px-5 py-3 text-[#D4A853] font-medium">₹{row.revenue.toLocaleString('en-IN')}</td>
                                <td className="px-5 py-3 text-white/70">{row.newUsers}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-white/[0.03] border-t border-white/10">
                            <td className="px-5 py-3 text-white font-bold">Total</td>
                            <td className="px-5 py-3 text-white font-bold">{totals.bookings}</td>
                            <td className="px-5 py-3 text-white font-bold">{totals.sessions}</td>
                            <td className="px-5 py-3 text-[#D4A853] font-bold">₹{totals.revenue.toLocaleString('en-IN')}</td>
                            <td className="px-5 py-3 text-white font-bold">{totals.newUsers}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function AdminReportsPage() {
    const router = useRouter();
    const [reportType, setReportType] = useState('monthly'); // 'monthly' | 'yearly'
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-based
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        setError('');
        setReportData(null);
        try {
            let data;
            if (reportType === 'monthly') {
                data = await reportsAPI.getMonthlyReport(selectedYear, selectedMonth);
            } else {
                data = await reportsAPI.getYearlyReport(selectedYear);
            }
            if (data.success) setReportData(data);
            else setError(data.message || 'Failed to fetch report');
        } catch (e) {
            setError(e.message || 'Failed to connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!reportData) return;
        const token = localStorage.getItem('token') || '';
        const params = new URLSearchParams({
            type: reportType,
            year: selectedYear,
            month: selectedMonth,
            token,
        });
        // Navigate to the Next.js API route — it returns a proper CSV attachment
        window.location.href = `/api/reports/csv?${params.toString()}`;
    };

    return (
        <AdminProtection>
            <div className="min-h-screen bg-[#0D0D0D] text-white relative">

                {/* Ambient glows */}
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(196,93,62,0.3) 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.2) 0%, transparent 70%)' }} />
                </div>

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Link href="/admin"
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                    <ArrowLeft className="w-4 h-4 text-white/60" />
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center">
                                        <FileSpreadsheet className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-white text-sm">Reports & Analytics</h1>
                                        <p className="text-[10px] text-white/40">Generate & Export Excel Reports</p>
                                    </div>
                                </div>
                            </div>

                            {reportData && (
                                <motion.button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 disabled:opacity-60 transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {exporting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Download className="w-4 h-4" /> Download CSV</>
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                    {/* Page Title */}
                    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl font-bold text-white mb-1">Studio Reports</h2>
                        <p className="text-white/50 text-sm">
                            Generate detailed monthly or yearly reports and export them as CSV files
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        className="bg-[#161616] rounded-2xl border border-white/5 p-6 mb-8"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#C45D3E]" />
                            Configure Report
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {/* Report Type */}
                            <div className="md:col-span-2">
                                <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Report Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'monthly', label: 'Monthly', icon: Calendar },
                                        { id: 'yearly', label: 'Yearly', icon: TrendingUp },
                                    ].map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => { setReportType(id); setReportData(null); setError(''); }}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all text-sm ${reportType === id
                                                ? 'bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white shadow-lg shadow-[#C45D3E]/20'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Year</label>
                                <div className="relative">
                                    <select
                                        value={selectedYear}
                                        onChange={e => { setSelectedYear(+e.target.value); setReportData(null); }}
                                        className="w-full appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C45D3E] transition-colors cursor-pointer"
                                    >
                                        {YEARS.map(y => <option key={y} value={y} className="bg-[#1A1A1A]">{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                </div>
                            </div>

                            {/* Month (only for monthly) */}
                            <AnimatePresence>
                                {reportType === 'monthly' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                    >
                                        <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Month</label>
                                        <div className="relative">
                                            <select
                                                value={selectedMonth}
                                                onChange={e => { setSelectedMonth(+e.target.value); setReportData(null); }}
                                                className="w-full appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C45D3E] transition-colors cursor-pointer"
                                            >
                                                {MONTHS.map((m, idx) => (
                                                    <option key={m} value={idx + 1} className="bg-[#1A1A1A]">{m}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={fetchReport}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-semibold rounded-xl shadow-lg shadow-[#C45D3E]/20 hover:shadow-[#C45D3E]/30 disabled:opacity-60 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><RefreshCw className="w-4 h-4" /> Generate Report</>
                                )}
                            </motion.button>

                            {reportData && (
                                <motion.button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-semibold rounded-xl hover:bg-[#22C55E]/20 disabled:opacity-60 transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {exporting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
                                    ) : (
                                        <><FileSpreadsheet className="w-4 h-4" /> Download CSV</>
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-16 h-16 rounded-2xl bg-[#C45D3E]/10 flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 text-[#C45D3E] animate-spin" />
                            </div>
                            <p className="text-white/50">Fetching data from database...</p>
                        </div>
                    )}

                    {/* Report Data Preview */}
                    <AnimatePresence>
                        {reportData && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Period Badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium">
                                            {reportData.period.label}
                                        </span>
                                        <span className="text-white/30 text-sm">
                                            {reportType === 'yearly'
                                                ? `${reportData.summary.totalBookings} bookings · ${reportData.summary.totalSessions} sessions`
                                                : `Preview only — click "Download CSV" to export all data`}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-white/30 text-xs">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        Report ready
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard label="Total Bookings" value={reportData.summary.totalBookings} icon={Calendar} color="#C45D3E" />
                                    <StatCard label="Total Sessions" value={reportData.summary.totalSessions} icon={Camera} color="#22C55E" />
                                    <StatCard label="New Members" value={reportData.summary.newUsers} icon={Users} color="#3B82F6" />
                                    <StatCard label="Total Revenue" value={reportData.summary.totalRevenue} icon={IndianRupee} color="#D4A853" prefix="₹" />
                                </div>

                                {/* Monthly Breakdown (yearly only) */}
                                {reportType === 'yearly' && reportData.monthlyBreakdown && (
                                    <MonthlyTable data={reportData.monthlyBreakdown} />
                                )}

                                {/* Breakdown Charts */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <BreakdownTable title="Bookings by Session Type" data={reportData.bookingsByType} icon={Camera} />
                                    <BreakdownTable title="Bookings by Status" data={reportData.bookingsByStatus} icon={CheckCircle} />
                                    <BreakdownTable title="Sessions by Status" data={reportData.sessionsByStatus} icon={Clock} />
                                </div>

                                {/* Top Clients (yearly only) */}
                                {reportType === 'yearly' && reportData.topClients?.length > 0 && (
                                    <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                                        <div className="p-5 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-[#D4A853]" />
                                                <h3 className="font-semibold text-white">Top Clients by Revenue</h3>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        {['#', 'Client', 'Email', 'Revenue', 'Sessions'].map(h => (
                                                            <th key={h} className="px-5 py-3 text-left text-white/40 font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {reportData.topClients.map((c, i) => (
                                                        <tr key={c.email} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-5 py-3 text-white/40">{i + 1}</td>
                                                            <td className="px-5 py-3 text-white font-medium">{c.name}</td>
                                                            <td className="px-5 py-3 text-white/60">{c.email}</td>
                                                            <td className="px-5 py-3 text-[#D4A853] font-semibold">₹{c.revenue.toLocaleString('en-IN')}</td>
                                                            <td className="px-5 py-3 text-white/60">{c.sessions}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Recent Bookings Preview (first 5) */}
                                {reportData.bookings?.length > 0 && (
                                    <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#C45D3E]" />
                                                <h3 className="font-semibold text-white">
                                                    Bookings Preview
                                                    <span className="ml-2 text-xs text-white/30 font-normal">(showing 5 of {reportData.bookings.length})</span>
                                                </h3>
                                            </div>
                                            <span className="text-xs text-white/30">Full data in CSV export</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        {['Client', 'Email', 'Session Type', 'Date', 'Status'].map(h => (
                                                            <th key={h} className="px-5 py-3 text-left text-white/40 font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {reportData.bookings.slice(0, 5).map((b, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-5 py-3 text-white font-medium">{b.name}</td>
                                                            <td className="px-5 py-3 text-white/60">{b.email}</td>
                                                            <td className="px-5 py-3 text-white/70 capitalize">{b.sessionType}</td>
                                                            <td className="px-5 py-3 text-white/60">{b.date}</td>
                                                            <td className="px-5 py-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                                    b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                                        b.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                                                            'bg-yellow-500/20 text-yellow-400'
                                                                    }`}>{b.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Empty state */}
                                {reportData.bookings?.length === 0 && reportData.sessions?.length === 0 && (
                                    <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-white/5">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <FileSpreadsheet className="w-8 h-8 text-white/20" />
                                        </div>
                                        <h3 className="text-white font-medium mb-2">No data for this period</h3>
                                        <p className="text-white/40 text-sm">There are no bookings or sessions recorded for {reportData.period.label}.</p>
                                    </div>
                                )}

                                {/* Export CTA */}
                                <motion.div
                                    className="p-6 rounded-2xl bg-gradient-to-r from-[#22C55E]/10 to-[#16A34A]/5 border border-[#22C55E]/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                                                <FileSpreadsheet className="w-5 h-5 text-[#22C55E]" />
                                                Export Complete Report
                                            </h3>
                                            <p className="text-white/50 text-sm">
                                                {reportType === 'monthly'
                                                    ? 'Download a single CSV with Summary, Bookings, Sessions and New Members'
                                                    : 'Download a single CSV with Annual Summary, Monthly Breakdown, Top Clients, All Bookings and Sessions'}
                                            </p>
                                        </div>
                                        <motion.button
                                            onClick={handleExport}
                                            disabled={exporting}
                                            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-60 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {exporting ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Generating XLSX...</>
                                            ) : (
                                                <><Download className="w-4 h-4" /> Download CSV</>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty / initial state */}
                    {!reportData && !loading && !error && (
                        <motion.div
                            className="text-center py-24"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#C45D3E]/20 to-[#D4A853]/10 flex items-center justify-center">
                                <FileSpreadsheet className="w-12 h-12 text-[#C45D3E]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Ready to Generate Reports</h3>
                            <p className="text-white/40 max-w-md mx-auto mb-8">
                                Select a report type and time period above, then click "Generate Report" to preview and export your studio data as an Excel spreadsheet.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
                                {[
                                    { icon: Calendar, title: 'Monthly Report', desc: '4 Sheets: Summary, Bookings, Sessions, New Members', color: '#C45D3E' },
                                    { icon: TrendingUp, title: 'Yearly Report', desc: '6 Sheets: Annual Summary, Monthly Breakdown, Top Clients & more', color: '#D4A853' },
                                ].map(item => (
                                    <div key={item.title} className="p-4 bg-[#161616] rounded-xl border border-white/5">
                                        <item.icon className="w-5 h-5 mb-3" style={{ color: item.color }} />
                                        <p className="text-white font-medium text-sm mb-1">{item.title}</p>
                                        <p className="text-white/40 text-xs">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </AdminProtection>
    );
}
