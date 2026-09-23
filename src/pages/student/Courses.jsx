import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from '../../api/courseApi.js';
import { applyForCourse } from '../../api/applicationApi.js';

export default function Courses() {
  const [courses, setCourses] = useState([]); const [searchTerm, setSearchTerm] = useState(''); const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null); const [tenthPercentage, setTenthPercentage] = useState(''); const [twelfthPercentage, setTwelfthPercentage] = useState('');
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false); const navigate = useNavigate();
  useEffect(() => { getAllCourses().then(r => setCourses(r.data)).catch(() => setError('Failed to load courses')).finally(() => setLoading(false)); }, []);
  const filtered = courses.filter(c => c.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleApply = async e => { e.preventDefault(); setError(''); setSubmitting(true); try { await applyForCourse({courseId:selectedCourse.id,tenthPercentage:parseFloat(tenthPercentage),twelfthPercentage:parseFloat(twelfthPercentage)}); navigate('/dashboard'); } catch(err){setError(err.response?.data?.message || 'Application failed');} finally {setSubmitting(false);} };
  if (loading) return <div className="page-loader"><div className="spinner-border text-primary" /></div>;

  return <main className="app-page"><div className="page-container">
    {!selectedCourse ? <>
      <section className="programs-header"><div><span className="page-eyebrow">Admissions</span><h1 className="page-title">Find your program</h1><p className="page-subtitle">Explore available courses, eligibility requirements and application fees.</p></div><div className="search-box"><i className="bi bi-search"/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search programs" /></div></section>
      {error && <div className="app-alert app-alert-error"><i className="bi bi-exclamation-circle" />{error}</div>}
      <div className="program-grid">{filtered.map((course, index) => <article className="program-card" key={course.id}>
        <div className="program-card-top"><div className="program-icon"><i className={`bi ${['bi-cpu','bi-code-slash','bi-lightning-charge','bi-bar-chart'][index%4]}`} /></div><span className="seat-pill">{course.availableSeats} seats left</span></div>
        <h2>{course.courseName}</h2><p className="program-caption">Undergraduate program</p>
        <div className="program-meta"><div><i className="bi bi-clock"/><span><small>Duration</small>{course.duration} months</span></div><div><i className="bi bi-mortarboard"/><span><small>Eligibility</small>{course.minimumPercentage}% in 12th</span></div><div><i className="bi bi-wallet2"/><span><small>Application fee</small>₹{course.applicationFee}</span></div></div>
        <button className="btn btn-primary w-100" disabled={course.availableSeats === 0} onClick={()=>{setSelectedCourse(course);setError('')}}>{course.availableSeats === 0 ? 'Applications closed' : 'Apply to this program'} <i className="bi bi-arrow-right ms-2"/></button>
      </article>)}</div>
      {!filtered.length && <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-search"/></div><h3>No programs found</h3><p className="text-muted">Try another search term.</p></div>}
    </> : <div className="application-form-wrap">
      <button className="back-link" onClick={()=>{setSelectedCourse(null);setError('')}}><i className="bi bi-arrow-left"/> Back to programs</button>
      <div className="application-form-card"><div className="application-form-head"><span className="page-eyebrow">New application</span><h1>{selectedCourse.courseName}</h1><p>Enter your academic percentages. Your eligibility will be checked when you submit.</p></div>
        <div className="eligibility-strip"><i className="bi bi-info-circle"/><span>Minimum required in 12th: <strong>{selectedCourse.minimumPercentage}%</strong></span><span>Application fee: <strong>₹{selectedCourse.applicationFee}</strong></span></div>
        {error && <div className="app-alert app-alert-error"><i className="bi bi-exclamation-circle"/>{error}</div>}
        <form onSubmit={handleApply}><div className="row g-3"><div className="col-md-6"><label className="form-label">10th percentage</label><div className="input-suffix"><input className="form-control" type="number" min="0" max="100" step="0.01" value={tenthPercentage} onChange={e=>setTenthPercentage(e.target.value)} required/><span>%</span></div></div><div className="col-md-6"><label className="form-label">12th percentage</label><div className="input-suffix"><input className="form-control" type="number" min="0" max="100" step="0.01" value={twelfthPercentage} onChange={e=>setTwelfthPercentage(e.target.value)} required/><span>%</span></div></div></div><div className="form-actions"><button type="button" className="btn btn-light" onClick={()=>setSelectedCourse(null)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit application'} {!submitting && <i className="bi bi-arrow-right ms-2"/>}</button></div></form>
      </div></div>}
  </div></main>;
}
