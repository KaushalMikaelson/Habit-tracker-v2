import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getDailyReport, getWeeklyReport, getMonthlyReport } from '../api/reports';
import { downloadCSV } from '../utils/generateCSV';
import { downloadDOCX } from '../utils/generateDOCX';
import { downloadPDF } from '../utils/generatePDF';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function ExportCard({ title, type, fetchData }) {
  const [loadingType, setLoadingType] = useState(null);
  const dummyChartRef = useRef(null);

  const handleDownload = async (ext) => {
    setLoadingType(ext);
    try {
      const data = await fetchData();
      if (ext === 'csv') downloadCSV(type, data);
      if (ext === 'docx') await downloadDOCX(type, data);
      if (ext === 'pdf') await downloadPDF(type, data, dummyChartRef);
      toast.success(`${ext.toUpperCase()} exported! 📥`);
    } catch (err) {
      toast.error(`Failed to export ${ext.toUpperCase()}`);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => handleDownload('pdf')} disabled={loadingType}>
          {loadingType === 'pdf' ? <Spinner size={16} /> : '📄 PDF'}
        </button>
        <button style={styles.btn} onClick={() => handleDownload('docx')} disabled={loadingType}>
          {loadingType === 'docx' ? <Spinner size={16} /> : '📝 DOCX'}
        </button>
        <button style={styles.btn} onClick={() => handleDownload('csv')} disabled={loadingType}>
          {loadingType === 'csv' ? <Spinner size={16} /> : '📊 CSV'}
        </button>
      </div>
    </div>
  );
}

export default function Reports() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={styles.page}
    >
      <h2 className="text-gradient-green" style={{ marginBottom: '24px' }}>Reports Center</h2>

      <div style={styles.grid}>
        <ExportCard
          title="DAILY REPORT"
          type="Daily"
          fetchData={() => getDailyReport(today)}
        />
        <ExportCard
          title="WEEKLY REPORT"
          type="Weekly"
          fetchData={() => getWeeklyReport(today)}
        />
        <ExportCard
          title="MONTHLY REPORT"
          type="Monthly"
          fetchData={() => getMonthlyReport(new Date().getFullYear(), new Date().getMonth() + 1)}
        />
      </div>

      <div style={styles.card}>
        <h3 style={styles.title}>ALL-TIME EXPORT</h3>
        <button style={{ ...styles.btn, width: '100%', padding: '12px' }} onClick={() => toast('Exporting all raw data...')}>
          📊 Export All Data as CSV
        </button>
      </div>
    </motion.div>
  );
}

const styles = {
  page: { paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { flex: 1, minWidth: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: 0 },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btn: { flex: 1, minWidth: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'inherit' },
};
