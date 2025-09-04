const apiUrl = 'http://localhost:7777';

export default {
  videoReq: {
    get: async (sortBy, searchTerm, filterBy) => {
      const blob = await fetch(
        `${apiUrl}/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
      );
      return await blob.json();
    },
    post: async (formData) => {
      const bolb = await fetch(`${apiUrl}/video-request`, {
        method: 'POST',
        body: formData,
      });
      return await bolb.json();
    },
    update: async (id, status, resVideo) => {
      const res = await fetch(`${apiUrl}/video-request`, {
        method: 'PUT',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id, status, resVideo }),
      });
      return await res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${apiUrl}/video-request`, {
        method: 'DELETE',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return await res.json();
    },
  },
  votes: {
    update: async (id, vote_type, user_id) => {
      const bolb = await fetch(`${apiUrl}/video-request/vote`, {
        method: 'PUT',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id, vote_type, user_id }),
      });
      return await bolb.json();
    },
  },
  users: {
    login: async (formData) => {
      const blob = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        body: formData
      });
      return await blob.json();
    },
  },
};