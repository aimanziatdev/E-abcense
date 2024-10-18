import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../contexts/contextprovider';

function StudentsManagement() {
    const { token } = useStateContext();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', class_id: '' });
    const [filterClassId, setFilterClassId] = useState('');
    const [activeFilterClassId, setActiveFilterClassId] = useState('');

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8000/api/students', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => console.error('Error fetching students:', error));

            axios.get('http://localhost:8000/api/classes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => console.error('Error fetching classes:', error));
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const handleFilterChange = (e) => {
        setFilterClassId(e.target.value);
    };

    const handleFilterSubmit = () => {
        setActiveFilterClassId(filterClassId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (token && newStudent.name && newStudent.class_id) {
            axios.post('http://localhost:8000/api/students', newStudent, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setStudents([...students, response.data]);
                setNewStudent({ name: '', class_id: '' });  // Reset form
            })
            .catch(error => console.error('Error adding student:', error));
        }
    };

    const handleDelete = (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            axios.delete(`http://localhost:8000/api/students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setStudents(students.filter(s => s.id !== studentId));
                alert('Student deleted successfully!');
            })
            .catch(error => console.error('Error deleting student:', error));
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333', marginBottom: '30px' }}>Students Management</h1>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
                {/* Filter Section */}
                <div>
                    <select
                        value={filterClassId}
                        onChange={handleFilterChange}
                        style={{ padding: '10px', width: '200px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button onClick={handleFilterSubmit} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Filter</button>
                </div>
                {/* Add New Student Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter student's name"
                        value={newStudent.name}
                        onChange={handleInputChange}
                        style={{ padding: '10px', width: '200px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <select
                        name="class_id"
                        value={newStudent.class_id}
                        onChange={handleInputChange}
                        style={{ padding: '10px', width: '200px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Student</button>
                </form>
            </div>
            <div className="table-container" style={{ marginTop: '20px', width: '100%' }}>
                <div className="table-header" style={{ display: 'flex', backgroundColor: '#f1f1f1', padding: '10px', borderBottom: '2px solid #ccc' }}>
                    <div className="table-cell" style={{ flex: 1, fontWeight: 'bold' }}>Name</div>
                    <div className="table-cell" style={{ flex: 1, fontWeight: 'bold' }}>Actions</div>
                </div>
                {students
                    .filter(student => !activeFilterClassId || student.class_id === activeFilterClassId)
                    .map(student => {
                        return (
                            <div className="table-row" key={student.id} style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ccc' }}>
                                <div className="table-cell" style={{ flex: 1 }}>{student.name}</div>
                                <div className="table-cell" style={{ flex: 1, display: 'flex', gap: '15px' }}>
                                    <button onClick={() => handleDelete(student.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default StudentsManagement;
