import { useEffect, useState } from 'react';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';
import { fetchData, getMedia } from '../utils/fetchData';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaArray, setMediaArray] = useState([]);

  useEffect(() => {
    const fetchMediaWithUsers = async () => {
      const media = await getMedia();
      const mediaWithUsers = await Promise.all(
        media.map(async (item) => {
          const result = await fetchData(
            import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
          );
          return { ...item, username: result.username };
        }),
      );
      setMediaArray(mediaWithUsers);
    };
    fetchMediaWithUsers();
  }, []);

  return (
    <>
      <h2>My Media</h2>
      <p>Loading...</p>
      <MediaRow items={mediaArray} setSelectedItem={setSelectedItem} />
      {selectedItem && (
        <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />
      )}
    </>
  );
};
export default Home;
