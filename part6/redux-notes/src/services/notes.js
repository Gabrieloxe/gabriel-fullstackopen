import axios from 'axios';

const baseUrl = 'http://localhost:3001/notes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async content => {
  const object = { content, important: false };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const clearAll = async () => {
  await axios.delete(baseUrl);
};

const deleteNote = async id => {
  await axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, createNew, clearAll, deleteNote };
