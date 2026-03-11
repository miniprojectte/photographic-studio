const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const XLSX = require('xlsx');
const Booking = require('../models/bookingModel');
const Session = require('../models/sessionModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

// Helper: admin guard
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
    }
    next();
}

// GET /api/reports/monthly?year=2025&month=3
router.get('/monthly', protect, requireAdmin, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // 1-based

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const [bookings, sessions, users] = await Promise.all([
            Booking.find({ createdAt: { $gte: startDate, $lt: endDate } })
                .populate('user', 'name email').lean(),
            Session.find({ date: { $gte: startDate, $lt: endDate } })
                .populate('client', 'name email').lean(),
            User.find({ createdAt: { $gte: startDate, $lt: endDate } })
                .select('-password').lean(),
        ]);

        // Revenue from completed sessions
        const revenue = sessions
            .filter(s => s.status === 'Completed')
            .reduce((sum, s) => sum + (s.price || 0), 0);

        // Booking breakdown by session type
        const bookingsByType = bookings.reduce((acc, b) => {
            acc[b.sessionType] = (acc[b.sessionType] || 0) + 1;
            return acc;
        }, {});

        // Booking status breakdown
        const bookingsByStatus = bookings.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1;
            return acc;
        }, {});

        // Session status breakdown
        const sessionsByStatus = sessions.reduce((acc, s) => {
            acc[s.status] = (acc[s.status] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            period: { year, month, label: startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) },
            summary: {
                totalBookings: bookings.length,
                totalSessions: sessions.length,
                newUsers: users.length,
                totalRevenue: revenue,
            },
            bookingsByType,
            bookingsByStatus,
            sessionsByStatus,
            bookings: bookings.map(b => ({
                id: b._id,
                name: b.name,
                email: b.email,
                phone: b.phone,
                sessionType: b.sessionType,
                date: b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'N/A',
                status: b.status,
                createdOn: new Date(b.createdAt).toLocaleDateString('en-IN'),
                user: b.user?.name || 'Guest',
            })),
            sessions: sessions.map(s => ({
                id: s._id,
                client: s.client?.name || 'Unknown',
                email: s.client?.email || 'N/A',
                sessionType: s.sessionType,
                date: s.date ? new Date(s.date).toLocaleDateString('en-IN') : 'N/A',
                status: s.status,
                price: s.price || 0,
                location: s.location?.address || s.location?.city || 'Studio',
                notes: s.notes || '',
            })),
            newUsers: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                joinedOn: new Date(u.createdAt).toLocaleDateString('en-IN'),
            })),
        });
    } catch (err) {
        console.error('Monthly report error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// GET /api/reports/yearly?year=2025
router.get('/yearly', protect, requireAdmin, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        const [bookings, sessions, users] = await Promise.all([
            Booking.find({ createdAt: { $gte: startDate, $lt: endDate } })
                .populate('user', 'name email').lean(),
            Session.find({ date: { $gte: startDate, $lt: endDate } })
                .populate('client', 'name email').lean(),
            User.find({ createdAt: { $gte: startDate, $lt: endDate } })
                .select('-password').lean(),
        ]);

        // Monthly breakdown
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyBreakdown = monthNames.map((name, idx) => {
            const mBookings = bookings.filter(b => new Date(b.createdAt).getMonth() === idx);
            const mSessions = sessions.filter(s => new Date(s.date).getMonth() === idx);
            const mRevenue = mSessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + (s.price || 0), 0);
            const mUsers = users.filter(u => new Date(u.createdAt).getMonth() === idx);
            return { month: name, bookings: mBookings.length, sessions: mSessions.length, revenue: mRevenue, newUsers: mUsers.length };
        });

        const totalRevenue = sessions
            .filter(s => s.status === 'Completed')
            .reduce((sum, s) => sum + (s.price || 0), 0);

        const bookingsByType = bookings.reduce((acc, b) => { acc[b.sessionType] = (acc[b.sessionType] || 0) + 1; return acc; }, {});
        const bookingsByStatus = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
        const sessionsByStatus = sessions.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

        // Top clients by revenue
        const clientRevenue = {};
        sessions.filter(s => s.status === 'Completed' && s.client).forEach(s => {
            const key = s.client._id.toString();
            if (!clientRevenue[key]) clientRevenue[key] = { name: s.client.name, email: s.client.email, revenue: 0, sessions: 0 };
            clientRevenue[key].revenue += s.price || 0;
            clientRevenue[key].sessions += 1;
        });
        const topClients = Object.values(clientRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

        res.json({
            success: true,
            period: { year, label: `${year} Annual Report` },
            summary: {
                totalBookings: bookings.length,
                totalSessions: sessions.length,
                newUsers: users.length,
                totalRevenue,
            },
            monthlyBreakdown,
            bookingsByType,
            bookingsByStatus,
            sessionsByStatus,
            topClients,
            bookings: bookings.map(b => ({
                id: b._id,
                name: b.name,
                email: b.email,
                phone: b.phone,
                sessionType: b.sessionType,
                date: b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'N/A',
                status: b.status,
                createdOn: new Date(b.createdAt).toLocaleDateString('en-IN'),
                month: monthNames[new Date(b.createdAt).getMonth()],
                user: b.user?.name || 'Guest',
            })),
            sessions: sessions.map(s => ({
                id: s._id,
                client: s.client?.name || 'Unknown',
                email: s.client?.email || 'N/A',
                sessionType: s.sessionType,
                date: s.date ? new Date(s.date).toLocaleDateString('en-IN') : 'N/A',
                month: monthNames[new Date(s.date).getMonth()],
                status: s.status,
                price: s.price || 0,
                location: s.location?.address || s.location?.city || 'Studio',
            })),
            newUsers: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                joinedOn: new Date(u.createdAt).toLocaleDateString('en-IN'),
                month: monthNames[new Date(u.createdAt).getMonth()],
            })),
        });
    } catch (err) {
        console.error('Yearly report error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// ── Helper: build workbook sheets ────────────────────────────────

function buildWorkbook(data, type) {
    const wb = XLSX.utils.book_new();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (type === 'monthly') {
        // Sheet 1: Summary
        const summaryRows = [
            ['MN Studio – Monthly Report'],
            [`Period: ${data.period.label}`],
            [`Generated: ${new Date().toLocaleString('en-IN')}`],
            [],
            ['SUMMARY', ''],
            ['Total Bookings', data.summary.totalBookings],
            ['Total Sessions', data.summary.totalSessions],
            ['New Members', data.summary.newUsers],
            ['Total Revenue (₹)', data.summary.totalRevenue],
            [],
            ['BOOKINGS BY SESSION TYPE', ''],
            ...Object.entries(data.bookingsByType).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
            [],
            ['BOOKINGS BY STATUS', ''],
            ...Object.entries(data.bookingsByStatus).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
            [],
            ['SESSIONS BY STATUS', ''],
            ...Object.entries(data.sessionsByStatus).map(([k, v]) => [k, v]),
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
        ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

        // Sheet 2: Bookings
        const bHeaders = ['#', 'Client Name', 'Email', 'Phone', 'Session Type', 'Booking Date', 'Registered By', 'Status', 'Created On'];
        const bData = data.bookings.map((b, i) => [
            i + 1, b.name, b.email, b.phone,
            b.sessionType?.charAt(0).toUpperCase() + b.sessionType?.slice(1),
            b.date, b.user,
            b.status?.charAt(0).toUpperCase() + b.status?.slice(1),
            b.createdOn,
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([bHeaders, ...bData]);
        ws2['!cols'] = [{ wch: 5 }, { wch: 22 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 14 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Bookings');

        // Sheet 3: Sessions
        const sHeaders = ['#', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location', 'Notes'];
        const sData = data.sessions.map((s, i) => [
            i + 1, s.client, s.email, s.sessionType, s.date, s.status, s.price, s.location, s.notes,
        ]);
        const ws3 = XLSX.utils.aoa_to_sheet([sHeaders, ...sData]);
        ws3['!cols'] = [{ wch: 5 }, { wch: 22 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, ws3, 'Sessions');

        // Sheet 4: New Members
        const uHeaders = ['#', 'Name', 'Email', 'Role', 'Joined On'];
        const uData = data.newUsers.map((u, i) => [i + 1, u.name, u.email, u.role, u.joinedOn]);
        const ws4 = XLSX.utils.aoa_to_sheet([uHeaders, ...uData]);
        ws4['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 12 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'New Members');

    } else {
        // Sheet 1: Annual Summary
        const summaryRows = [
            ['MN Studio – Annual Report'],
            [`Year: ${data.period.year}`],
            [`Generated: ${new Date().toLocaleString('en-IN')}`],
            [],
            ['ANNUAL SUMMARY', ''],
            ['Total Bookings', data.summary.totalBookings],
            ['Total Sessions', data.summary.totalSessions],
            ['New Members', data.summary.newUsers],
            ['Total Revenue (Rs)', data.summary.totalRevenue],
            [],
            ['BOOKINGS BY SESSION TYPE', ''],
            ...Object.entries(data.bookingsByType).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
            [],
            ['BOOKINGS BY STATUS', ''],
            ...Object.entries(data.bookingsByStatus).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
            [],
            ['SESSIONS BY STATUS', ''],
            ...Object.entries(data.sessionsByStatus).map(([k, v]) => [k, v]),
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
        ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Annual Summary');

        // Sheet 2: Monthly Breakdown
        const mbH = ['Month', 'Bookings', 'Sessions', 'Revenue (Rs)', 'New Members'];
        const mbD = data.monthlyBreakdown.map(m => [m.month, m.bookings, m.sessions, m.revenue, m.newUsers]);
        mbD.push(['TOTAL',
            data.monthlyBreakdown.reduce((s, m) => s + m.bookings, 0),
            data.monthlyBreakdown.reduce((s, m) => s + m.sessions, 0),
            data.monthlyBreakdown.reduce((s, m) => s + m.revenue, 0),
            data.monthlyBreakdown.reduce((s, m) => s + m.newUsers, 0),
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([mbH, ...mbD]);
        ws2['!cols'] = [{ wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Breakdown');

        // Sheet 3: Top Clients
        const tcH = ['#', 'Client', 'Email', 'Total Revenue (Rs)', 'Sessions Completed'];
        const tcD = data.topClients.map((c, i) => [i + 1, c.name, c.email, c.revenue, c.sessions]);
        const ws3 = XLSX.utils.aoa_to_sheet([tcH, ...tcD]);
        ws3['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 22 }];
        XLSX.utils.book_append_sheet(wb, ws3, 'Top Clients');

        // Sheet 4: All Bookings
        const bH = ['#', 'Month', 'Client Name', 'Email', 'Phone', 'Session Type', 'Date', 'Status', 'Created On'];
        const bD = data.bookings.map((b, i) => [
            i + 1, b.month, b.name, b.email, b.phone,
            b.sessionType?.charAt(0).toUpperCase() + b.sessionType?.slice(1),
            b.date, b.status?.charAt(0).toUpperCase() + b.status?.slice(1), b.createdOn,
        ]);
        const ws4 = XLSX.utils.aoa_to_sheet([bH, ...bD]);
        ws4['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 22 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'All Bookings');

        // Sheet 5: All Sessions
        const sH = ['#', 'Month', 'Client', 'Email', 'Session Type', 'Date', 'Status', 'Revenue (Rs)', 'Location'];
        const sD = data.sessions.map((s, i) => [
            i + 1, s.month, s.client, s.email, s.sessionType, s.date, s.status, s.price, s.location,
        ]);
        const ws5 = XLSX.utils.aoa_to_sheet([sH, ...sD]);
        ws5['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 22 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws5, 'All Sessions');

        // Sheet 6: New Members
        const uH = ['#', 'Month', 'Name', 'Email', 'Role', 'Joined On'];
        const uD = data.newUsers.map((u, i) => [i + 1, u.month, u.name, u.email, u.role, u.joinedOn]);
        const ws6 = XLSX.utils.aoa_to_sheet([uH, ...uD]);
        ws6['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 25 }, { wch: 30 }, { wch: 12 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, ws6, 'New Members');
    }

    return wb;
}

// GET /api/reports/monthly/excel?year=2025&month=3&token=JWT
router.get('/monthly/excel', protect, requireAdmin, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const [bookings, sessions, users] = await Promise.all([
            Booking.find({ createdAt: { $gte: startDate, $lt: endDate } }).populate('user', 'name email').lean(),
            Session.find({ date: { $gte: startDate, $lt: endDate } }).populate('client', 'name email').lean(),
            User.find({ createdAt: { $gte: startDate, $lt: endDate } }).select('-password').lean(),
        ]);

        const revenue = sessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + (s.price || 0), 0);
        const bookingsByType = bookings.reduce((acc, b) => { acc[b.sessionType] = (acc[b.sessionType] || 0) + 1; return acc; }, {});
        const bookingsByStatus = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
        const sessionsByStatus = sessions.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
        const label = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const data = {
            period: { year, month, label },
            summary: { totalBookings: bookings.length, totalSessions: sessions.length, newUsers: users.length, totalRevenue: revenue },
            bookingsByType, bookingsByStatus, sessionsByStatus,
            bookings: bookings.map(b => ({ name: b.name, email: b.email, phone: b.phone, sessionType: b.sessionType, date: b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'N/A', status: b.status, createdOn: new Date(b.createdAt).toLocaleDateString('en-IN'), user: b.user?.name || 'Guest' })),
            sessions: sessions.map(s => ({ client: s.client?.name || 'Unknown', email: s.client?.email || 'N/A', sessionType: s.sessionType, date: s.date ? new Date(s.date).toLocaleDateString('en-IN') : 'N/A', status: s.status, price: s.price || 0, location: s.location?.address || s.location?.city || 'Studio', notes: s.notes || '' })),
            newUsers: users.map(u => ({ name: u.name, email: u.email, role: u.role, joinedOn: new Date(u.createdAt).toLocaleDateString('en-IN') })),
        };

        const wb = buildWorkbook(data, 'monthly');
        const filename = `MN_Studio_Monthly_Report_${label.replace(' ', '_')}.xlsx`;
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buf.length);
        res.send(buf);
    } catch (err) {
        console.error('Monthly Excel error:', err);
        res.status(500).json({ success: false, error: 'Failed to generate Excel' });
    }
});

// GET /api/reports/yearly/excel?year=2025&token=JWT
router.get('/yearly/excel', protect, requireAdmin, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const [bookings, sessions, users] = await Promise.all([
            Booking.find({ createdAt: { $gte: startDate, $lt: endDate } }).populate('user', 'name email').lean(),
            Session.find({ date: { $gte: startDate, $lt: endDate } }).populate('client', 'name email').lean(),
            User.find({ createdAt: { $gte: startDate, $lt: endDate } }).select('-password').lean(),
        ]);

        const totalRevenue = sessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + (s.price || 0), 0);
        const bookingsByType = bookings.reduce((acc, b) => { acc[b.sessionType] = (acc[b.sessionType] || 0) + 1; return acc; }, {});
        const bookingsByStatus = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
        const sessionsByStatus = sessions.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

        const monthlyBreakdown = monthNames.map((name, idx) => {
            const mb = bookings.filter(b => new Date(b.createdAt).getMonth() === idx);
            const ms = sessions.filter(s => new Date(s.date).getMonth() === idx);
            return { month: name, bookings: mb.length, sessions: ms.length, revenue: ms.filter(s => s.status === 'Completed').reduce((sum, s) => sum + (s.price || 0), 0), newUsers: users.filter(u => new Date(u.createdAt).getMonth() === idx).length };
        });

        const clientRevenue = {};
        sessions.filter(s => s.status === 'Completed' && s.client).forEach(s => {
            const key = s.client._id.toString();
            if (!clientRevenue[key]) clientRevenue[key] = { name: s.client.name, email: s.client.email, revenue: 0, sessions: 0 };
            clientRevenue[key].revenue += (s.price || 0);
            clientRevenue[key].sessions += 1;
        });
        const topClients = Object.values(clientRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

        const data = {
            period: { year, label: `${year} Annual Report` },
            summary: { totalBookings: bookings.length, totalSessions: sessions.length, newUsers: users.length, totalRevenue },
            monthlyBreakdown, bookingsByType, bookingsByStatus, sessionsByStatus, topClients,
            bookings: bookings.map(b => ({ month: monthNames[new Date(b.createdAt).getMonth()], name: b.name, email: b.email, phone: b.phone, sessionType: b.sessionType, date: b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'N/A', status: b.status, createdOn: new Date(b.createdAt).toLocaleDateString('en-IN') })),
            sessions: sessions.map(s => ({ month: monthNames[new Date(s.date).getMonth()], client: s.client?.name || 'Unknown', email: s.client?.email || 'N/A', sessionType: s.sessionType, date: s.date ? new Date(s.date).toLocaleDateString('en-IN') : 'N/A', status: s.status, price: s.price || 0, location: s.location?.address || s.location?.city || 'Studio' })),
            newUsers: users.map(u => ({ month: monthNames[new Date(u.createdAt).getMonth()], name: u.name, email: u.email, role: u.role, joinedOn: new Date(u.createdAt).toLocaleDateString('en-IN') })),
        };

        const wb = buildWorkbook(data, 'yearly');
        const filename = `MN_Studio_Annual_Report_${year}.xlsx`;
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buf.length);
        res.send(buf);
    } catch (err) {
        console.error('Yearly Excel error:', err);
        res.status(500).json({ success: false, error: 'Failed to generate Excel' });
    }
});

module.exports = router;
