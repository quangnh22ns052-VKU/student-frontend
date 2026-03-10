'use client';
import { useEffect, useState } from 'react';
import { studentApi } from './lib/api';

// Khai báo kiểu dữ liệu Student
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<FormData>({ 
    name: '', email: '', phone: '', age: '' 
  });

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const res = await studentApi.getAll();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert('Vui lòng nhập họ tên và email!');
      return;
    }
    try {
      if (editStudent) {
        await studentApi.update(editStudent.id, form);
      } else {
        await studentApi.create(form);
      }
      setForm({ name: '', email: '', phone: '', age: '' });
      setShowForm(false);
      setEditStudent(null);
      loadStudents();
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    await studentApi.delete(id);
    loadStudents();
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setForm({ 
      name: student.name, 
      email: student.email,
      phone: student.phone, 
      age: String(student.age) 
    });
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Quản Lý Sinh Viên
            </h1>
            <p className="text-gray-500 mt-1">
              Tổng số: {students.length} sinh viên
            </p>
          </div>
          <button
            onClick={() => { 
              setShowForm(true); 
              setEditStudent(null);
              setForm({ name: '', email: '', phone: '', age: '' }); 
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Thêm Sinh Viên
          </button>
        </div>

        {/* Form Thêm/Sửa */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {editStudent ? 'Sửa Sinh Viên' : 'Thêm Sinh Viên Mới'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Họ Tên *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="a@gmail.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Số Điện Thoại</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="0901234567"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tuổi</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="20"
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editStudent ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditStudent(null); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Đang tải dữ liệu...
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Chưa có sinh viên nào. Bấm "+ Thêm Sinh Viên" để bắt đầu!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Họ Tên</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Điện Thoại</th>
                  <th className="px-4 py-3 text-left">Tuổi</th>
                  <th className="px-4 py-3 text-left">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-500">{s.id}</td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{s.age}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  );
}