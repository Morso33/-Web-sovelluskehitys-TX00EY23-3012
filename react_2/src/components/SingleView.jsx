import { useEffect, useId } from 'react';
import Likes from './Likes';

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
      className="fixed inset-0 w-full h-full bg-black/70 flex items-center justify-center z-[1000]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg)] rounded-xl p-6 max-w-[860px] w-[90%] shadow-[var(--shadow)]"
      >
        <h2 id={titleId}>{item.title}</h2>
        <p className="mb-1 text-[var(--text)]">{item.description}</p>
        <p className="mb-4 text-[0.9em] text-[var(--text)]">
          Owner: {item.username}
        </p>
        <img
          src={item.thumbnails?.w640 ?? item.thumbnails?.w320}
          alt={item.title}
          className="w-full rounded-lg"
        />
        <Likes mediaId={item.media_id ?? item.id} />
        <button
          onClick={() => setSelectedItem(null)}
          className="mt-4 cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-5 py-2 hover:shadow-[var(--shadow)] transition-shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SingleView;
