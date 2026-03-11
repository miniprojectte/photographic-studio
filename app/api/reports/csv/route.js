// Next.js API Route: /api/reports/csv
// Server-side CSV generation – returns a proper HTTP file attachment
// Usage: GET /api/reports/csv?type=monthly&year=2026&month=3&token=JWT

const BACKEND = 'http://localhost:5000/api';

function csvCell(val) {
    if (val === null || val === undefined) return '';
    const s = String(val);
    return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCSV(rows) {
    return rows.map(r => r.map(csvCell).join(',')).join('\r\n');
}

function buildMonthlyCSV(data) {
    const rows = [
        ['MN Studio - Monthly Report'],
        [`Period: ${data.period?.label || ''}`],
        [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
        [],
        ['=== SUMMARY ==='],
        ['Total Bookings', data.summary?.totalBookings ?? 0],
        ['Total Sessions', data.summary?.totalSessions ?? 0],
        ['New Members', data.summary?.newUsers ?? 0],
        ['Total Revenue (Rs)', data.summary?.totalRevenue ?? 0],
        [],
        ['=== BOOKINGS BY SESSION TYPE ==='],
        ['Session Type', 'Count'],
        ...Object.entries(data.bookingsByType || {}).map(([k, v]) => [k, v]),
        [],
        ['=== BOOKINGS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.bookingsByStatus || {}).map(([k, v]) => [k, v]),
        [],
        ['=== SESSIONS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.sessionsByStatus || {}).map(([k, v]) => [k, v]),
        [],
        ['=== BOOKINGS DETAIL ==='],
        ['#', 'Client Name', 'Email', 'Phone', 'Session Type', 'Booking Date', 'Registered By', 'Status', 'Created On'],
        ...(data.bookings || []).map((b, i) => [
            i + 1, b.name, b.email, b.phone,
            b.sessionType, b.date, b.user, b.status, b.createdOn,
        ]),
        [],
        ['=== SESSIONS DETAIL ==='],
        ['#', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location', 'Notes'],
        ...(data.sessions || []).map((s, i) => [
            i + 1, s.client, s.email, s.sessionType, s.date,
            s.status, s.price, s.location, s.notes,
        ]),
        [],
        ['=== NEW MEMBERS ==='],
        ['#', 'Name', 'Email', 'Role', 'Joined On'],
        ...(data.newUsers || []).map((u, i) => [i + 1, u.name, u.email, u.role, u.joinedOn]),
    ];
    return toCSV(rows);
}

function buildYearlyCSV(data) {
    const mb = data.monthlyBreakdown || [];
    const totals = mb.reduce(
        (a, m) => ({ bookings: a.bookings + m.bookings, sessions: a.sessions + m.sessions, revenue: a.revenue + m.revenue, newUsers: a.newUsers + m.newUsers }),
        { bookings: 0, sessions: 0, revenue: 0, newUsers: 0 }
    );
    const rows = [
        ['MN Studio - Annual Report'],
        [`Year: ${data.period?.year || ''}`],
        [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
        [],
        ['=== ANNUAL SUMMARY ==='],
        ['Total Bookings', data.summary?.totalBookings ?? 0],
        ['Total Sessions', data.summary?.totalSessions ?? 0],
        ['New Members', data.summary?.newUsers ?? 0],
        ['Total Revenue (Rs)', data.summary?.totalRevenue ?? 0],
        [],
        ['=== BOOKINGS BY SESSION TYPE ==='],
        ['Session Type', 'Count'],
        ...Object.entries(data.bookingsByType || {}).map(([k, v]) => [k, v]),
        [],
        ['=== BOOKINGS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.bookingsByStatus || {}).map(([k, v]) => [k, v]),
        [],
        ['=== SESSIONS BY STATUS ==='],
        ['Status', 'Count'],
        ...Object.entries(data.sessionsByStatus || {}).map(([k, v]) => [k, v]),
        [],
        ['=== MONTHLY BREAKDOWN ==='],
        ['Month', 'Bookings', 'Sessions', 'Revenue (Rs)', 'New Members'],
        ...mb.map(m => [m.month, m.bookings, m.sessions, m.revenue, m.newUsers]),
        ['TOTAL', totals.bookings, totals.sessions, totals.revenue, totals.newUsers],
        [],
        ['=== TOP CLIENTS BY REVENUE ==='],
        ['#', 'Client', 'Email', 'Total Revenue (Rs)', 'Sessions Completed'],
        ...(data.topClients || []).map((c, i) => [i + 1, c.name, c.email, c.revenue, c.sessions]),
        [],
        ['=== ALL BOOKINGS ==='],
        ['#', 'Month', 'Client Name', 'Email', 'Phone', 'Session Type', 'Date', 'Status', 'Created On'],
        ...(data.bookings || []).map((b, i) => [
            i + 1, b.month, b.name, b.email, b.phone,
            b.sessionType, b.date, b.status, b.createdOn,
        ]),
        [],
        ['=== ALL SESSIONS ==='],
        ['#', 'Month', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location'],
        ...(data.sessions || []).map((s, i) => [
            i + 1, s.month, s.client, s.email, s.sessionType, s.date, s.status, s.price, s.location,
        ]),
        [],
        ['=== NEW MEMBERS ==='],
        ['#', 'Month', 'Name', 'Email', 'Role', 'Joined On'],
        ...(data.newUsers || []).map((u, i) => [i + 1, u.month, u.name, u.email, u.role, u.joinedOn]),
    ];
    return toCSV(rows);
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'monthly';
        const year = searchParams.get('year') || new Date().getFullYear();
        const month = searchParams.get('month') || (new Date().getMonth() + 1);
        const token = searchParams.get('token') || '';

        // Fetch from Express backend
        const endpoint = type === 'monthly'
            ? `${BACKEND}/reports/monthly?year=${year}&month=${month}`
            : `${BACKEND}/reports/yearly?year=${year}`;

        const res = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) {
            return new Response(
                `Error fetching report: ${res.status} ${res.statusText}`,
                { status: res.status }
            );
        }

        const data = await res.json();

        const csv = type === 'monthly'
            ? buildMonthlyCSV(data)
            : buildYearlyCSV(data);

        const label = type === 'monthly'
            ? `${data.period?.label?.replace(/\s+/g, '_') || `${year}_${month}`}`
            : year;
        const filename = type === 'monthly'
            ? `MN_Studio_Monthly_Report_${label}.csv`
            : `MN_Studio_Annual_Report_${label}.csv`;

        // BOM (\uFEFF) ensures Excel opens with correct encoding
        const body = '\uFEFF' + csv;

        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('CSV route error:', err);
        return new Response(`Server error: ${err.message}`, { status: 500 });
    }
}
