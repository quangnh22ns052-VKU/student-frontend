import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
// });
const api = axios.create({
  baseURL: 'https://student-backend-nf1o.onrender.com',
});

export const studentApi = {
  // Lấy tất cả sinh viên
  getAll: () => api.get('/api/students'),

  // Thêm sinh viên
  create: (data) => api.post('/api/students', data),

  // Sửa sinh viên
  update: (id, data) => api.put(`/api/students/${id}`, data),

  // Xóa sinh viên
  delete: (id) => api.delete(`/api/students/${id}`),
};