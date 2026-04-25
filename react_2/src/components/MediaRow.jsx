import { useUserContext } from '../contexts/UserContext';

const MediaRow = ({ items, setSelectedItem }) => {
  const { user } = useUserContext();

  return (
    <div className="flex gap-4 flex-wrap justify-center py-4">
      {items.map((item) => {
        const isOwner = user && (user.role === 'admin' || user.user_id === item.user_id);

        return (
          <div
            key={item.id}
            className="border border-[var(--border)] rounded-lg overflow-hidden w-[200px] text-left bg-[var(--bg)] shadow-sm"
          >
            <button
              onClick={() => setSelectedItem(item)}
              className="w-full cursor-pointer p-0 border-0 bg-transparent text-left"
            >
              <img
                src={item.thumbnails?.w160}
                alt={item.title}
                className="w-full block"
              />
              <p className="m-2 font-bold text-[var(--text-h)]">{item.title}</p>
              <p className="mx-2 mb-2 text-[0.85em] text-[var(--text)]">
                by {item.username}
              </p>
            </button>
            <div className="flex flex-wrap gap-2 px-2 pb-2">
              <button
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-3 py-1 text-sm hover:shadow-[var(--shadow)] transition-shadow"
              >
                Show
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() =>
                      // TODO: implement modify functionality
                      console.log('Modify item', item.media_id ?? item.id)
                    }
                    className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-3 py-1 text-sm hover:shadow-[var(--shadow)] transition-shadow"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() =>
                      // TODO: implement delete functionality
                      console.log('Delete item', item.media_id ?? item.id)
                    }
                    className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-3 py-1 text-sm hover:shadow-[var(--shadow)] transition-shadow"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaRow;
