import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../contexts/contextprovider';

function ClassesManagement() {
    const { token } = useStateContext();
    const [classes, setClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [newClass, setNewClass] = useState({ name: '', user_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8000/api/classes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setClasses(response.data);
                    } else {
                        console.error('Unexpected data format for classes:', response.data);
                        setClasses([]);
                    }
                })
                .catch(error => console.error('Error fetching classes:', error));

            axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (Array.isArray(response.data.users)) {
                        setUsers(response.data.users);
                    } else {
                        console.error('Unexpected data format for users:', response.data);
                        setUsers([]);
                    }
                })
                .catch(error => console.error('Error fetching users:', error));
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClass({ ...newClass, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (token) {
            if (editMode && editingClass) {
                // Update existing class
                axios.put(`http://localhost:8000/api/classes/${editingClass.id}`, newClass, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        setClasses(classes.map(c => c.id === editingClass.id ? response.data : c));
                        setNewClass({ name: '', user_id: '' });
                        setEditMode(false);
                        setEditingClass(null);
                    })
                    .catch(error => console.error('Error updating class:', error));
            } else {
                // Add new class
                axios.post('http://localhost:8000/api/classes', newClass, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        setClasses([...classes, response.data]);
                        setNewClass({ name: '', user_id: '' });
                    })
                    .catch(error => console.error('Error adding class:', error));
            }
        }
    };

    const handleEdit = (classItem) => {
        setNewClass({ name: classItem.name, user_id: classItem.user_id });
        setEditMode(true);
        setEditingClass(classItem);
    };

    const handleDelete = (classId) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            axios.delete(`http://localhost:8000/api/classes/${classId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setClasses(classes.filter(c => c.id !== classId));
                    alert('Class deleted successfully!');
                })
                .catch(error => console.error('Error deleting class:', error));
        }
    };

    return (
        <div style={{ maxWidth: '1500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333' }}>Classes Management</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div className="form-section">
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                        Class Name:
                        <input type="text" name="name" value={newClass.name} onChange={handleInputChange} style={{ width: '10%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#666' }}>
                        Teacher:
                        <select name="user_id" value={newClass.user_id} onChange={handleInputChange} style={{ width: '10%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">Select Teacher</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit" style={{ display: 'block', width: '10%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {editMode ? 'Update Class' : 'Add Class'}
                    </button>
                </div>
            </form>
            <div className="table-container" style={{ marginTop: '20px' }}>
                <div className="table-header" style={{ display: 'flex', backgroundColor: '#f1f1f1', padding: '10px', borderBottom: '2px solid #ccc' }}>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Class</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Teacher</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Actions</div>
                </div>
                {Array.isArray(classes) && classes.map(classItem => {
                    const user = users.find(x => x.id === classItem.user_id);
                    return (
                        <div className="table-row" key={classItem.id} style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ccc' }}>
                            <div className="table-cell" style={{ flex: '1' }}>{classItem.name}</div>
                            <div className="table-cell" style={{ flex: '1' }}>{user ? user.name : 'User not found'}</div>
                            <div className="table-cell action-buttons" style={{ flex: '1', display: 'flex', gap: '15px' }}>
                                <button onClick={() => handleEdit(classItem)} style={{ backgroundColor: 'darkblue', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(classItem.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ClassesManagement;
