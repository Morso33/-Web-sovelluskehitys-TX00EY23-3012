import { useEffect, useId } from 'react';

const SingleView = (props) => {
  const { item, setSelectedItem } = props;
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedItem]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={() => setSelectedItem(null)}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', borderRadius: '12px', padding: '24px', maxWidth: '860px', width: '90%', boxShadow: 'var(--shadow)' }}
      >
        <h2 id={titleId}>{item.title}</h2>
        <p style={{ marginBottom: '4px', color: 'var(--text)' }}>{item.description}</p>
        <p style={{ marginBottom: '16px', fontSize: '0.9em', color: 'var(--text)' }}>Owner: {item.username}</p>
        <img src={item.thumbnails?.w640 ?? item.thumbnails?.w320} alt={item.title} style={{ width: '100%', borderRadius: '8px' }} />
        <button
          onClick={() => setSelectedItem(null)}
          style={{ marginTop: '16px', padding: '8px 20px', cursor: 'pointer', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SingleView;
