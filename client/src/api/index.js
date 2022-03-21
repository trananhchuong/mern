import axios from 'axios';

export const URL = 'http://localhost:5000';
export const URL2 = 'http://localhost:5001';

export const fetchPosts = () => axios.get(`${URL}/posts`);
export const createPost = (payload) => axios.post(`${URL}/posts`, payload);
export const updatePost = (payload) =>
  axios.post(`${URL}/posts/update`, payload);
