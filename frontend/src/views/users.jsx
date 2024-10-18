import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                getUsers(); // Refresh the list after deleting a user
            })
            .catch(error => {
                console.error('There was an error deleting the user!', error);
            });
    };

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
            .then(({ data }) => {
                console.log('Fetched users:', data); // Debug log
                if (data && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else {
                    console.error('Unexpected data format for users:', data);
                    setUsers([]); // Ensure users is always an array
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
                setLoading(false); // Handle error state as well
                setUsers([]); // Ensure users is always an array even on error
            });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Teachers</h1>
                <Link className="btn-add" to="/users/new" style={{ backgroundColor: 'darkblue', color: 'white', padding: '8px 16px', textDecoration: 'none', borderRadius: '5px' }}>
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="3" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {users.length > 0 ? (
                                users.filter(x => x.name !== 'admin').map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <Link className="btn-edit" to={'/users/' + u.id} style={{ backgroundColor: 'darkblue', color: 'white', padding: '8px 16px', textDecoration: 'none', borderRadius: '5px' }}>
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button className="btn-delete" onClick={() => onDeleteClick(u)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
