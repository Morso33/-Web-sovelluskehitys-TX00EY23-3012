const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getMedia = async () => {
  return fetchData(import.meta.env.VITE_MEDIA_API + '/media');
};

export { fetchData, getMedia };
