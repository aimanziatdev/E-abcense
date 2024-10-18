import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../contexts/contextprovider';

function AbsenceManagementTeacher() {
    const { token } = useStateContext();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [presence, setPresence] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8000/api/teacher/classes', {
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

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        axios.get(`http://localhost:8000/api/classes/${classId}/students`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setStudents(response.data);
            const newPresence = {};
            response.data.forEach(student => {
                newPresence[student.id] = null;
            });
            setPresence(newPresence);
        })
        .catch(error => console.error('Error fetching students:', error));
    };

    const handlePresenceChange = (studentId, isPresent) => {
        setPresence(prev => ({
            ...prev,
            [studentId]: isPresent
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Map presence data to the structure expected by the backend including class_id
        const absencesToSubmit = Object.entries(presence).map(([studentId, isPresent]) => ({
            student_id: studentId,
            class_id: selectedClass, // Ensure this is included
            is_present: isPresent,
            date: new Date().toISOString().split('T')[0]
        }));
    
        axios.post('http://localhost:8000/api/absences', absencesToSubmit, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            alert('Absences saved successfully!');
            setEditMode(false);  // Exit edit mode after save
        })
        .catch(error => console.error('Error saving absences:', error));
    };
    

    return (
        <div style={{ maxWidth: '1500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333' }}>Absence Management</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div className="form-section">
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                        Class:
                        <select value={selectedClass} onChange={handleClassChange} style={{ width: '10%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Student</th>
                        <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Presence</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{student.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex' }}>
                                <button
                                    onClick={() => handlePresenceChange(student.id, false)}
                                    style={{
                                        marginRight: '5px', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                                        backgroundColor: presence[student.id] === false ? 'red' : undefined,
                                        color: 'black'
                                    }}
                                >
                                    Absent
                                </button>
                                <button
                                    onClick={() => handlePresenceChange(student.id, true)}
                                    style={{
                                        padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                                        backgroundColor: presence[student.id] === true ? 'green' : undefined,
                                        color: 'black'
                                    }}
                                >
                                    Present
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setEditMode(!editMode)} style={{ marginTop: '20px', marginRight: '10px', backgroundColor: '#ffa500', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {editMode ? 'Finish Editing' : 'Edit Absences'}
            </button>
            <button onClick={handleSubmit} style={{ marginTop: '20px', backgroundColor: '#0056b3', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Save Absences
            </button>
        </div>
    );
}

export default AbsenceManagementTeacher;