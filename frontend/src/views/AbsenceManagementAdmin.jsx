import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../contexts/contextprovider';

function AbsenceManagementAdmin() {
    const { token } = useStateContext();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [absences, setAbsences] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        if (token) {
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

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        // Reset students, absences, and dates when class changes
        setStudents([]);
        setAbsences([]);
        setAvailableDates([]);

        // Fetch available dates for the selected class
        if (classId) {
            axios.get(`http://localhost:8000/api/classes/${classId}/absence-dates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setAvailableDates(response.data);
            })
            .catch(error => console.error('Error fetching available dates:', error));
        }
    };

    const fetchData = () => {
        if (selectedClass) {
            axios.get(`http://localhost:8000/api/classes/${selectedClass}/students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setStudents(response.data);
                if (filterDate) {
                    axios.get(`http://localhost:8000/api/classes/${selectedClass}/absences?date=${filterDate}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then(response => {
                        if (response.data && response.data.absences) {
                            setAbsences(response.data.absences);
                        } else {
                            setAbsences([]);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching absences:', error);
                        setAbsences([]);
                    });
                }
            })
            .catch(error => console.error('Error fetching students:', error));
        }
    };

    const handleJustifiedChange = (absenceId, justified) => {
        setAbsences(prev => prev.map(abs => abs.id === absenceId ? { ...abs, justified } : abs));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = absences.map(absence => ({
            id: absence.id,
            justified: absence.justified
        }));
    
        axios.put('http://localhost:8000/api/absences/update-justified', payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            alert('Absences updated successfully!');
        })
        .catch(error => {
            console.error('Error updating absences:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        });
    };

    return (
        <div style={{ maxWidth: '1500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333' }}>Absence Management</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div className="form-section">
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                        Class:
                        <select value={selectedClass} onChange={handleClassChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                        Filter by Date:
                        <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">Select Date</option>
                            {availableDates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                    </label>
                    <button type="button" onClick={fetchData} disabled={!selectedClass} style={{ margin: '10px 0', padding: '8px 16px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Afficher
                    </button>
                </div>
            </form>
            <div className="table-container" style={{ marginTop: '20px' }}>
                <div className="table-header" style={{ display: 'flex', backgroundColor: '#f1f1f1', padding: '10px', borderBottom: '2px solid #ccc' }}>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Student</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Date</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Justified</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Presence</div>
                    <div className="table-cell" style={{ flex: '1', fontWeight: 'bold' }}>Actions</div>
                </div>
                {Array.isArray(absences) && absences.map(absence => {
                    const student = students.find(x => x.id === absence.student_id);
                    return (
                        <div className="table-row" key={absence.id} style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ccc' }}>
                            <div className="table-cell" style={{ flex: '1' }}>{student ? student.name : 'Student not found'}</div>
                            <div className="table-cell" style={{ flex: '1' }}>{absence.date}</div>
                            <div className="table-cell" style={{ flex: '1' }}>{absence.justified ? 'Yes' : 'No'}</div>
                            <div className="table-cell" style={{ flex: '1' }}>{absence.is_present ? 'Present' : 'Absent'}</div>
                            <div className="table-cell action-buttons" style={{ flex: '1', display: 'flex', gap: '15px' }}>
                                {absence.is_present ? null : (
                                    <>
                                        <button type="button" onClick={() => handleJustifiedChange(absence.id, true)} style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Justify</button>
                                        <button type="button" onClick={() => handleJustifiedChange(absence.id, false)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Unjustify</button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
        </div>
    );
}

export default AbsenceManagementAdmin;
