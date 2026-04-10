const MediaRow = ({ items, setSelectedItem }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', padding: '16px 0' }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setSelectedItem(item)}
          style={{ cursor: 'pointer', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', width: '200px', padding: 0, background: 'transparent', textAlign: 'left' }}
        >
          <img src={item.thumbnails?.w160} alt={item.title} style={{ width: '100%', display: 'block' }} />
          <p style={{ margin: '8px', fontWeight: 'bold', color: 'var(--text-h)' }}>{item.title}</p>
          <p style={{ margin: '0 8px 8px', fontSize: '0.85em', color: 'var(--text)' }}>by {item.username}</p>
        </button>
      ))}
    </div>
  );
};

export default MediaRow;
