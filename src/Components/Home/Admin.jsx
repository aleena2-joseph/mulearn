import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  updateDoc, serverTimestamp, query, where
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  ChevronDown, Plus, Edit2, Trash2, File, Image, X,
  Calendar, Clock, Users, Mail, Phone, User, Download,
  Eye, FileText, BookOpen
} from 'lucide-react';

const TINYMCE_CDN = 'https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js';

function useTinyMCE() {
  const [ready, setReady] = useState(!!window.tinymce);
  useEffect(() => {
    if (window.tinymce) { setReady(true); return; }
    const s = document.createElement('script');
    s.src = TINYMCE_CDN;
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

function RichEditor({ value, onChange, id = 'tinymce-report-editor' }) {
  const editorReady = useTinyMCE();
  const initialized = useRef(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorReady || initialized.current) return;
    initialized.current = true;

    window.tinymce.init({
      selector: `#${id}`,
      height: 420,
      menubar: false,
      base_url: 'https://cdn.jsdelivr.net/npm/tinymce@6',
      suffix: '.min',
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'charmap',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'table', 'wordcount'
      ],
      toolbar:
        'undo redo | fontfamily fontsize | ' +
        'bold italic underline strikethrough | forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | ' +
        'table link | removeformat | fullscreen',
      font_family_formats:
        'Arial=arial,helvetica,sans-serif;' +
        'Georgia=georgia,palatino;' +
        'Times New Roman=times new roman,times;' +
        'Courier New=courier new,courier;' +
        'Verdana=verdana,geneva;' +
        'Trebuchet MS=trebuchet ms,geneva;' +
        'Impact=impact,chicago;' +
        'Comic Sans MS=comic sans ms,sans-serif',
      font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 28pt 32pt 36pt 48pt 72pt',
      content_style: `
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 16px; color: #1e293b; }
        p { margin: 0 0 10px 0; }
      `,
      setup(editor) {
        editorRef.current = editor;
        editor.on('init', () => {
          editor.setContent(value || '');
        });
        editor.on('change keyup', () => {
          onChange(editor.getContent());
        });
      }
    });

    return () => {
      if (window.tinymce) {
        window.tinymce.remove(`#${id}`);
        initialized.current = false;
        editorRef.current = null;
      }
    };
  }, );

  if (!editorReady) {
    return (
      <div className="w-full border border-slate-300 rounded-lg h-48 flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
          Loading editor...
        </div>
      </div>
    );
  }

  return <textarea id={id} defaultValue={value || ''} />;
}

// ─── PDF Generator ────────────────────────────────────────────────────────────
const generateReportPDF = (report, eventName) => {
  const formatTs = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generatedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${report.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  @media print {
    @page { margin: 0.5cm 0.8cm; size: A4; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none !important; }
  }

  body {
    font-family: 'EB Garamond', 'Times New Roman', serif;
    font-size: 12pt;
    color: #1a1a2e;
    background: #fff;
    padding: 32px 40px;
    max-width: 860px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .cover {
    border-top: 4px solid #1e3a5f;
    padding-top: 28px;
    margin-bottom: 36px;
  }
  .org-line {
    font-size: 9pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #1e3a5f;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .report-label {
    font-size: 9pt;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 18px;
  }
  h1.report-title {
    font-size: 26pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .event-name {
    font-size: 12pt;
    color: #475569;
    font-style: italic;
    margin-bottom: 20px;
  }

  .meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 32px;
    font-size: 10pt;
  }
  .meta-table td {
    padding: 6px 12px 6px 0;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    width: 50%;
  }
  .meta-table td:first-child { font-weight: 600; color: #1e3a5f; padding-right: 8px; width: 30%; }

  .divider { border: none; border-top: 1.5px solid #1e3a5f; margin: 24px 0; }

  .report-body { font-size: 12pt; color: #1a1a2e; line-height: 1.75; }
  .report-body p { margin-bottom: 10px; }
  .report-body h1 { font-size: 18pt; margin: 20px 0 8px; color: #0f172a; }
  .report-body h2 { font-size: 15pt; margin: 18px 0 6px; color: #0f172a; }
  .report-body h3 { font-size: 13pt; margin: 14px 0 4px; color: #0f172a; }
  .report-body ul, .report-body ol { margin: 8px 0 8px 24px; }
  .report-body li { margin-bottom: 4px; }
  .report-body table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10pt; }
  .report-body td, .report-body th { border: 1px solid #cbd5e1; padding: 6px 10px; }
  .report-body th { background: #1e3a5f; color: #fff; font-weight: 600; }
  .report-body strong { font-weight: 700; }
  .report-body em { font-style: italic; }
  .report-body a { color: #1e3a5f; text-decoration: underline; }
  .report-body blockquote { border-left: 3px solid #1e3a5f; margin: 12px 0; padding: 8px 16px; color: #475569; font-style: italic; }

  .footer {
    margin-top: 48px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #94a3b8;
  }

  .print-btn {
    position: fixed;
    top: 16px; right: 16px;
    background: #1e3a5f;
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 6px;
    font-size: 11pt;
    cursor: pointer;
    font-family: sans-serif;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .print-btn:hover { background: #2563eb; }
</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>

<div class="cover">
  <h1 class="report-title">${report.title}</h1>
  <div class="event-name">Event: ${eventName}</div>
</div>

<table class="meta-table">
  ${report.date ? `<tr><td>Event Date</td><td>${report.date}</td></tr>` : ''}
  <tr><td>Report Date</td><td>${formatTs(report.createdAt) || generatedOn}</td></tr>
  <tr><td>Generated On</td><td>${generatedOn}</td></tr>
</table>

<hr class="divider"/>

<div class="report-body">
  ${report.body || '<p><em>No content provided.</em></p>'}
</div>

<div class="footer">
  <span>μLearn — AJCE</span>
  <span>Generated ${generatedOn}</span>
</div>

</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_Report.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

// ─── Main Admin Component ──────────────────────────────────────────────────────
const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // FIX: isPastEvent and registrationOpen added to initial formData
  const [formData, setFormData] = useState({ name: '', description: '', file: null, isPastEvent: false, registrationOpen: true });
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [reports, setReports] = useState({});
  const [viewingReport, setViewingReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [reportFormData, setReportFormData] = useState({ title: '', date: '', body: '' });
  const [reportLoading, setReportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsCheckingAuth(false);
      if (!user) navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try { await signOut(auth); navigate('/login'); }
    catch (e) { alert('Logout failed: ' + e.message); }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'events'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(list.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    } catch (e) { alert('Error fetching events: ' + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) fetchEvents(); }, [isAuthenticated]);

  const fetchEventRegistrations = async (eventId) => {
    try {
      setLoadingRegistrations(true);
      const q = query(collection(db, 'eventRegistrations'), where('eventId', '==', eventId));
      const snap = await getDocs(q);
      setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.registeredAt?.seconds - a.registeredAt?.seconds));
    } catch (e) { alert('Error fetching registrations: ' + e.message); }
    finally { setLoadingRegistrations(false); }
  };

  const handleViewRegistrations = async (event) => {
    setViewingRegistrations(event);
    await fetchEventRegistrations(event.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png','image/gif','application/pdf'].includes(file.type)) {
      alert('Only JPG, PNG, GIF, PDF allowed'); e.target.value = ''; return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB'); e.target.value = ''; return;
    }
    setFormData(prev => ({ ...prev, file }));
  };

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    const data = await res.json();
    if (!data.secure_url) throw new Error('No URL returned');
    return { downloadURL: data.secure_url, fileName: data.public_id || 'unknown' };
  };

  const handleAddEvent = async () => {
    if (!formData.name.trim() || !formData.description.trim()) { alert('Fill all fields'); return; }
    if (!formData.file) { alert('Please upload a file'); return; }
    try {
      setLoading(true);
      const { downloadURL, fileName } = await uploadFile(formData.file);
      await addDoc(collection(db, 'events'), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fileUrl: downloadURL,
        fileName,
        fileType: formData.file.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPastEvent: formData.isPastEvent,
        registrationOpen: formData.isPastEvent ? false : formData.registrationOpen,
      });
      // FIX: reset includes isPastEvent and registrationOpen
      setFormData({ name: '', description: '', file: null, isPastEvent: false, registrationOpen: true });
      const fi = document.getElementById('file-input');
      if (fi) fi.value = '';
      alert('Event added');
      setActiveSection('view-events');
      fetchEvents();
    } catch (e) { alert('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'events', eventId));
      alert('Event deleted');
      fetchEvents();
    } catch (e) { alert('Delete error: ' + e.message); }
    finally { setLoading(false); }
  };

  const startEditing = (event) => {
    setEditingEvent(event.id);
    // FIX: include isPastEvent and registrationOpen when populating edit form
    setFormData({
      name: event.name,
      description: event.description,
      file: null,
      isPastEvent: event.isPastEvent || false,
      registrationOpen: event.registrationOpen !== false,
    });
    setActiveSection('add-event');
  };

  const handleUpdateEvent = async () => {
    if (!formData.name.trim() || !formData.description.trim()) { alert('Fill all fields'); return; }
    try {
      setLoading(true);
      const current = events.find(e => e.id === editingEvent);
      let fileUrl = current.fileUrl || '';
      let fileName = current.fileName || 'unknown';
      let fileType = current.fileType || 'unknown';
      if (formData.file) {
        const res = await uploadFile(formData.file);
        fileUrl = res.downloadURL; fileName = res.fileName; fileType = formData.file.type;
      }
      await updateDoc(doc(db, 'events', editingEvent), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fileUrl,
        fileName,
        fileType,
        updatedAt: serverTimestamp(),
        isPastEvent: formData.isPastEvent,
        registrationOpen: formData.isPastEvent ? false : formData.registrationOpen,
      });
      // FIX: reset includes isPastEvent and registrationOpen
      setFormData({ name: '', description: '', file: null, isPastEvent: false, registrationOpen: true });
      setEditingEvent(null);
      const fi = document.getElementById('file-input');
      if (fi) fi.value = '';
      alert('Event updated');
      setActiveSection('view-events');
      fetchEvents();
    } catch (e) { alert('Update error: ' + e.message); }
    finally { setLoading(false); }
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    // FIX: full reset including new fields
    setFormData({ name: '', description: '', file: null, isPastEvent: false, registrationOpen: true });
    setActiveSection('view-events');
    const fi = document.getElementById('file-input');
    if (fi) fi.value = '';
  };

  // FIX: new toggle registration handler
  const handleToggleRegistration = async (event) => {
    try {
      await updateDoc(doc(db, 'events', event.id), {
        registrationOpen: !event.registrationOpen,
        updatedAt: serverTimestamp()
      });
      fetchEvents();
    } catch (e) { alert('Error: ' + e.message); }
  };

  const fetchReport = async (eventId) => {
    if (reports[eventId] !== undefined) return reports[eventId];
    try {
      const q = query(collection(db, 'reports'), where('eventId', '==', eventId));
      const snap = await getDocs(q);
      const report = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
      setReports(prev => ({ ...prev, [eventId]: report }));
      return report;
    } catch (e) { console.error('Fetch report error:', e); return null; }
  };

  useEffect(() => {
    if (events.length > 0) events.forEach(ev => fetchReport(ev.id));
  }, );

  const handleOpenAddReport = (event) => {
    setEditingReport({ eventId: event.id, reportId: null });
    setReportFormData({ title: '', date: '', body: '' });
  };

  const handleOpenEditReport = (event, report) => {
    setEditingReport({ eventId: event.id, reportId: report.id });
    setReportFormData({ title: report.title || '', date: report.date || '', body: report.body || '' });
  };

  const handleSaveReport = async () => {
    if (!reportFormData.title.trim()) { alert('Title is required'); return; }
    if (!reportFormData.body || reportFormData.body.replace(/<[^>]*>/g, '').trim() === '') {
      alert('Report content cannot be empty'); return;
    }
    try {
      setReportLoading(true);
      const { eventId, reportId } = editingReport;
      const payload = {
        eventId,
        title: reportFormData.title.trim(),
        date: reportFormData.date,
        body: reportFormData.body,
        updatedAt: serverTimestamp()
      };
      if (reportId) {
        await updateDoc(doc(db, 'reports', reportId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'reports'), payload);
      }
      setReports(prev => ({ ...prev, [eventId]: undefined }));
      await fetchReport(eventId);
      setEditingReport(null);
      alert(reportId ? 'Report updated' : 'Report created');
    } catch (e) { alert('Error saving report: ' + e.message); }
    finally { setReportLoading(false); }
  };

  const handleViewReport = async (event) => {
    const report = await fetchReport(event.id);
    if (report) setViewingReport({ ...report, _eventName: event.name });
  };

  const handleDownloadReport = async (event) => {
    const report = await fetchReport(event.id);
    if (!report) { alert('No report found'); return; }
    generateReportPDF(report, event.name);
  };

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  const isImageFile = (t) => t?.startsWith('image/');
  const isPdfFile = (t) => t === 'application/pdf';

  const exportRegistrationsToCSV = () => {
    if (!registrations.length) { alert('No registrations to export'); return; }
    const headers = ['Name','Email','Phone','MUID','Registration Date'];
    const csv = [headers.join(','), ...registrations.map(r => [
      r.userName||'', r.email||'', r.phone||'', r.muid||'', formatDate(r.registeredAt)
    ].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${viewingRegistrations.name}_registrations.csv`;
    a.click();
  };

  if (isCheckingAuth) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Verifying authentication...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">µ</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">µLearn Admin Panel</h1>
                <p className="text-sm text-slate-500">Manage your events, registrations and reports</p>
              </div>
            </div>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Strip */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { label: 'Total Events', value: events.length, color: 'blue', icon: <Calendar className="h-4 w-4" /> },
            { label: 'Open Registrations', value: events.filter(e => e.registrationOpen !== false && !e.isPastEvent).length, color: 'emerald', icon: <Users className="h-4 w-4" /> },
            { label: 'Past Events', value: events.filter(e => e.isPastEvent).length, color: 'slate', icon: <Clock className="h-4 w-4" /> },
            { label: 'Reports', value: Object.values(reports).filter(Boolean).length, color: 'violet', icon: <FileText className="h-4 w-4" /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
              <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center text-${color}-600`}>{icon}</div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Events Management Accordion */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div
            className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
            onClick={() => setActiveSection(activeSection === 'events' ? '' : 'events')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"><Calendar className="h-5 w-5 text-white" /></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Events Management</h2>
                <p className="text-sm text-slate-500">Create and manage your events</p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transform transition-transform ${activeSection === 'events' ? 'rotate-180' : ''}`} />
          </div>
          {activeSection === 'events' && (
            <div className="p-6 bg-slate-50">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveSection('add-event');
                    setEditingEvent(null);
                    setFormData({ name: '', description: '', file: null, isPastEvent: false, registrationOpen: true });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:shadow-md transition-all font-medium"
                >
                  <Plus className="h-4 w-4" /> Create New Event
                </button>
                <button onClick={() => setActiveSection('view-events')} className="bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-all font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View All Events ({events.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Event Form */}
        {activeSection === 'add-event' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 ${editingEvent ? 'bg-amber-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  {editingEvent ? <Edit2 className="h-5 w-5 text-amber-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                  <p className="text-sm text-slate-500">Fill in the event details below</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter event name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Describe your event" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event File {editingEvent && '(Leave empty to keep current file)'}</label>
                  <input type="file" id="file-input" accept="image/*,.pdf" onChange={handleFileChange} className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                  <p className="text-xs text-slate-500 mt-2">Supported: JPG, PNG, GIF, PDF (Max 10MB)</p>
                </div>

                {/* FIX: Event Type toggles ABOVE submit buttons */}
                <div className="flex flex-wrap items-center gap-6 py-3 px-4 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div
                      onClick={() => setFormData(p => ({ ...p, isPastEvent: !p.isPastEvent, registrationOpen: p.isPastEvent ? true : false }))}
                      className={`w-10 h-5 rounded-full transition-colors relative ${formData.isPastEvent ? 'bg-slate-500' : 'bg-blue-500'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.isPastEvent ? 'left-5' : 'left-0.5'}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{formData.isPastEvent ? '📁 Past Event' : '📅 Upcoming Event'}</span>
                  </label>
                  {!formData.isPastEvent && (
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <div
                        onClick={() => setFormData(p => ({ ...p, registrationOpen: !p.registrationOpen }))}
                        className={`w-10 h-5 rounded-full transition-colors relative ${formData.registrationOpen ? 'bg-emerald-500' : 'bg-red-400'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.registrationOpen ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{formData.registrationOpen ? '🟢 Registration Open' : '🔴 Registration Closed'}</span>
                    </label>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={editingEvent ? handleUpdateEvent : handleAddEvent} disabled={loading} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    {loading ? 'Processing...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  {editingEvent && (
                    <button onClick={cancelEditing} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Events */}
        {activeSection === 'view-events' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {/* FIX: search bar correctly placed here, inline with heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">All Events</h3>
                <p className="text-sm text-slate-500 mt-1">Manage your event collection</p>
              </div>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-9 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
                <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-slate-600">Loading events...</p></div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="h-8 w-8 text-slate-400" /></div>
                <p className="text-slate-600 font-medium">No events found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events
                  .filter(e => !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(event => {
                    const report = reports[event.id];
                    const hasReport = !!report;
                    return (
                      <div key={event.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-all bg-gradient-to-r from-white to-slate-50">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            {/* FIX: status badges in card header */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold text-lg text-slate-800">{event.name}</h4>
                              {event.isPastEvent && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">📁 Past</span>
                              )}
                              {!event.isPastEvent && (
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${event.registrationOpen !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                  {event.registrationOpen !== false ? '🟢 Open' : '🔴 Closed'}
                                </span>
                              )}
                              {hasReport && (
                                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                  <FileText className="h-3 w-3" /> Report
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                              <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>{formatDate(event.createdAt)}</span></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setViewingEvent(event)} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-100 transition-colors flex items-center gap-1.5 font-medium"><Eye className="h-3.5 w-3.5" /> View</button>
                              <button onClick={() => handleViewRegistrations(event)} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md text-sm hover:bg-emerald-100 transition-colors flex items-center gap-1.5 font-medium"><Users className="h-3.5 w-3.5" /> Registrations</button>
                              {event.fileUrl && (
                                <a href={event.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-medium"><Download className="h-3.5 w-3.5" /> File</a>
                              )}
                              {hasReport ? (
                                <>
                                  <button onClick={() => handleViewReport(event)} className="bg-violet-50 text-violet-700 px-3 py-1.5 rounded-md text-sm hover:bg-violet-100 transition-colors flex items-center gap-1.5 font-medium"><BookOpen className="h-3.5 w-3.5" /> View Report</button>
                                  <button onClick={() => handleOpenEditReport(event, report)} className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md text-sm hover:bg-amber-100 transition-colors flex items-center gap-1.5 font-medium"><Edit2 className="h-3.5 w-3.5" /> Edit Report</button>
                                  <button onClick={() => handleDownloadReport(event)} className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-md text-sm hover:bg-teal-100 transition-colors flex items-center gap-1.5 font-medium"><Download className="h-3.5 w-3.5" /> Download Report</button>
                                </>
                              ) : (
                                <button onClick={() => handleOpenAddReport(event)} className="bg-violet-50 text-violet-700 px-3 py-1.5 rounded-md text-sm hover:bg-violet-100 transition-colors flex items-center gap-1.5 font-medium border border-violet-200 border-dashed"><Plus className="h-3.5 w-3.5" /> Add Report</button>
                              )}
                              {/* FIX: toggle registration button added correctly in card, not in report modal */}
                              {!event.isPastEvent && (
                                <button
                                  onClick={() => handleToggleRegistration(event)}
                                  className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 font-medium ${event.registrationOpen !== false ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                >
                                  {event.registrationOpen !== false
                                    ? <><X className="h-3.5 w-3.5" /> Close Reg.</>
                                    : <><Plus className="h-3.5 w-3.5" /> Open Reg.</>}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEditing(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ══ REPORT FORM MODAL ══ */}
        {editingReport && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-violet-700 to-purple-700 text-white px-6 py-5 flex justify-between items-center rounded-t-2xl z-10">
                <div>
                  <h3 className="text-xl font-bold">{editingReport.reportId ? 'Edit Report' : 'Create Report'}</h3>
                  <p className="text-violet-200 text-sm mt-0.5">{events.find(e => e.id === editingReport.eventId)?.name}</p>
                </div>
                <button onClick={() => setEditingReport(null)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={reportFormData.title}
                    onChange={e => setReportFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-base"
                    placeholder="e.g. AI Workshop 2025 — Post-Event Report"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Date <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="date"
                    value={reportFormData.date}
                    onChange={e => setReportFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Content <span className="text-red-500">*</span>
                    <span className="text-slate-400 font-normal ml-2">— use the toolbar for font, size, tables, colors & more</span>
                  </label>
                  <div className="rounded-lg overflow-hidden border border-slate-300">
                    <RichEditor
                      key={editingReport.reportId || 'new-report'}
                      value={reportFormData.body}
                      onChange={(html) => setReportFormData(p => ({ ...p, body: html }))}
                      id="tinymce-report-editor"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">The downloaded PDF will reflect your exact formatting — font family, font size, bold, tables, colors, alignment, and more.</p>
                </div>
                <div className="flex gap-3 pt-2 border-t border-slate-100">
                  <button onClick={handleSaveReport} disabled={reportLoading} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    {reportLoading ? 'Saving...' : editingReport.reportId ? 'Update Report' : 'Create Report'}
                  </button>
                  <button onClick={() => setEditingReport(null)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ VIEW REPORT MODAL ══ */}
        {viewingReport && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-violet-700 to-purple-700 text-white px-6 py-5 flex justify-between items-center rounded-t-2xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold mb-2 uppercase tracking-wider"><FileText className="h-3 w-3" /> Event Report</div>
                  <h3 className="text-xl font-bold">{viewingReport.title}</h3>
                  <p className="text-violet-200 text-sm mt-0.5">{viewingReport._eventName}</p>
                </div>
                <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex flex-wrap gap-6 text-sm">
                  {viewingReport.date && (
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /><span className="text-slate-500">Event Date:</span><span className="font-medium text-slate-800">{viewingReport.date}</span></div>
                  )}
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /><span className="text-slate-500">Created:</span><span className="font-medium text-slate-800">{formatDate(viewingReport.createdAt)}</span></div>
                </div>
                <div
                  className="border border-slate-200 rounded-lg p-6 bg-white"
                  style={{ fontFamily: "'Times New Roman', serif", fontSize: '12pt', lineHeight: '1.75', color: '#1a1a2e' }}
                  dangerouslySetInnerHTML={{ __html: viewingReport.body || '<p><em>No content.</em></p>' }}
                />
                {/* FIX: removed broken event-scoped toggle button from here */}
                <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-200 mt-5">
                  <button
                    onClick={() => {
                      const event = events.find(e => e.id === viewingReport.eventId);
                      handleOpenEditReport(event, viewingReport);
                      setViewingReport(null);
                    }}
                    className="bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Report
                  </button>
                  <button onClick={() => generateReportPDF(viewingReport, viewingReport._eventName)} className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button onClick={() => setViewingReport(null)} className="ml-auto bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ EVENT DETAILS MODAL ══ */}
        {viewingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold">{viewingEvent.name}</h3>
                  <p className="text-blue-100 text-sm mt-1">Event Details</p>
                </div>
                <button onClick={() => setViewingEvent(null)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><File className="h-4 w-4" /> Description</h4>
                  <p className="text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">{viewingEvent.description}</p>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Event Information</h4>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                    <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-slate-500" /><span className="text-slate-600">Created:</span><span className="font-medium text-slate-800">{formatDate(viewingEvent.createdAt)}</span></div>
                    <div className="flex items-center gap-3"><File className="h-4 w-4 text-slate-500" /><span className="text-slate-600">File Type:</span><span className="font-medium text-slate-800">{viewingEvent.fileType || 'Unknown'}</span></div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">Status:</span>
                      {viewingEvent.isPastEvent
                        ? <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">📁 Past Event</span>
                        : <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${viewingEvent.registrationOpen !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {viewingEvent.registrationOpen !== false ? '🟢 Registration Open' : '🔴 Registration Closed'}
                          </span>
                      }
                    </div>
                  </div>
                </div>
                {viewingEvent.fileUrl && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">{isImageFile(viewingEvent.fileType) ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />} Uploaded File</h4>
                    {isImageFile(viewingEvent.fileType) ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden"><img src={viewingEvent.fileUrl} alt={viewingEvent.name} className="w-full h-auto" /></div>
                    ) : isPdfFile(viewingEvent.fileType) ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden"><iframe src={viewingEvent.fileUrl} className="w-full h-96" title="PDF Viewer" /></div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <File className="h-16 w-16 mx-auto text-slate-400 mb-3" />
                        <a href={viewingEvent.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"><Download className="h-4 w-4" /> Download File</a>
                      </div>
                    )}
                  </div>
                )}

                {/* Report Section in Event Modal */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-violet-600" /> Event Report</h4>
                  {(() => {
                    const report = reports[viewingEvent.id];
                    if (report === undefined) return <div className="bg-slate-50 rounded-lg p-4 text-center text-sm text-slate-500">Loading report...</div>;
                    if (!report) return (
                      <div className="bg-violet-50 border border-violet-200 border-dashed rounded-lg p-6 flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-violet-300" />
                        <p className="text-slate-600 font-medium">No report created for this event yet</p>
                        <button onClick={() => { setViewingEvent(null); handleOpenAddReport(viewingEvent); }} className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 font-medium text-sm"><Plus className="h-4 w-4" /> Create Report</button>
                      </div>
                    );
                    return (
                      <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold text-slate-800 text-base">{report.title}</p>
                            {report.date && <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</p>}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => { setViewingEvent(null); handleViewReport(viewingEvent); }} className="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-md text-xs hover:bg-violet-200 transition-colors flex items-center gap-1 font-medium"><Eye className="h-3 w-3" /> View</button>
                            <button onClick={() => { setViewingEvent(null); handleOpenEditReport(viewingEvent, report); }} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md text-xs hover:bg-amber-200 transition-colors flex items-center gap-1 font-medium"><Edit2 className="h-3 w-3" /> Edit</button>
                            <button onClick={() => generateReportPDF(report, viewingEvent.name)} className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md text-xs hover:bg-teal-200 transition-colors flex items-center gap-1 font-medium"><Download className="h-3 w-3" /> PDF</button>
                          </div>
                        </div>
                        <div className="text-slate-600 text-sm line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: report.body || '' }} />
                      </div>
                    );
                  })()}
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                  <button onClick={() => { setViewingEvent(null); startEditing(viewingEvent); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"><Edit2 className="h-4 w-4" /> Edit Event</button>
                  <button onClick={() => setViewingEvent(null)} className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ REGISTRATIONS MODAL ══ */}
        {viewingRegistrations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Event Registrations</h3>
                  <p className="text-emerald-100">{viewingRegistrations.name}</p>
                </div>
                <button onClick={() => { setViewingRegistrations(null); setRegistrations([]); }} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <div className="p-6">
                {loadingRegistrations ? (
                  <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div><p className="text-slate-600">Loading registrations...</p></div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="h-8 w-8 text-slate-400" /></div>
                    <p className="text-slate-800 font-semibold text-lg">No registrations yet</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 rounded-lg border border-emerald-200">
                        <p className="text-sm text-slate-600">Total Registrations</p>
                        <p className="text-2xl font-bold text-emerald-700">{registrations.length}</p>
                      </div>
                      <button onClick={exportRegistrationsToCSV} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm"><Download className="h-4 w-4" /> Export to CSV</button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">MUID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Registered At</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {registrations.map((reg, i) => (
                            <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-slate-600 font-medium">{i + 1}</td>
                              <td className="px-4 py-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-blue-600" /></div><span className="font-medium text-slate-800">{reg.userName}</span></div></td>
                              <td className="px-4 py-4"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-600">{reg.email}</span></div></td>
                              <td className="px-4 py-4"><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-600">{reg.phone}</span></div></td>
                              <td className="px-4 py-4"><span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">{reg.muid}</span></td>
                              <td className="px-4 py-4 text-sm text-slate-600">{formatDate(reg.registeredAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                  <button onClick={() => { setViewingRegistrations(null); setRegistrations([]); }} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors font-semibold">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;