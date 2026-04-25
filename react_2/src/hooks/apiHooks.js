import { useCallback } from 'react';

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

const useLike = () => {
  const getLikeCountByMediaId = useCallback(async (mediaId) => {
    const response = await fetch(`${MEDIA_API}/likes/count/${mediaId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, []);

  const getLikeByUser = useCallback(async (mediaId, token) => {
    const response = await fetch(`${MEDIA_API}/likes/bymedia/user/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, []);

  const postLike = useCallback(async (mediaId, token) => {
    const response = await fetch(`${MEDIA_API}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ media_id: mediaId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, []);

  const deleteLike = useCallback(async (likeId, token) => {
    const response = await fetch(`${MEDIA_API}/likes/${likeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, []);

  return { getLikeCountByMediaId, getLikeByUser, postLike, deleteLike };
};

export { useLike };
