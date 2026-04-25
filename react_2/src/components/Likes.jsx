import { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useLike } from '../hooks/apiHooks';

const Likes = ({ mediaId }) => {
  const { user } = useUserContext();
  const { getLikeCountByMediaId, getLikeByUser, postLike, deleteLike } =
    useLike();
  const [likeCount, setLikeCount] = useState(0);
  const [userLike, setUserLike] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const countData = await getLikeCountByMediaId(mediaId);
        setLikeCount(countData.count ?? 0);
      } catch {
        setLikeCount(0);
      }

      if (user?.token) {
        try {
          const like = await getLikeByUser(mediaId, user.token);
          setUserLike(like);
        } catch {
          setUserLike(null);
        }
      }
    };

    fetchLikes();
  }, [mediaId, user, getLikeCountByMediaId, getLikeByUser]);

  const handleLike = async () => {
    if (!user?.token) return;

    try {
      if (userLike) {
        await deleteLike(userLike.like_id, user.token);
        setUserLike(null);
        setLikeCount((prev) => prev - 1);
      } else {
        const newLike = await postLike(mediaId, user.token);
        setUserLike(newLike);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Like action failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={handleLike}
        disabled={!user}
        aria-label={userLike ? 'Unlike this item' : 'Like this item'}
        className={[
          'cursor-pointer rounded-md border px-4 py-2 text-sm transition-all',
          userLike
            ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
            : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)]',
          !user && 'opacity-50 cursor-not-allowed',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {userLike ? '♥ Liked' : '♡ Like'}
      </button>
      <span className="text-[var(--text)] text-sm">{likeCount} likes</span>
    </div>
  );
};

export default Likes;
