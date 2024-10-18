import { createBrowserRouter } from 'react-router-dom';
import Login from './views/login.jsx';
import DefaultLayout from './Components/DefaultLayout.jsx';
import GuestLayout from './Components/GuestLayout.jsx';
import Users from './views/users.jsx';
import UserForm from './views/UserForm.jsx';
import ClassesManagement from './views/ClassesManagement.jsx';
import StudentsManagement from './views/StudentsManagement.jsx';
import AbsenceManagementAdmin from './views/AbsenceManagementAdmin.jsx';
import AbsenceManagementTeacher from './views/AbsenceManagementTeacher.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate" />
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
            },
            {
                path: '/classes',
                element: <ClassesManagement />
            },
            {
                path: '/students',
                element: <StudentsManagement />
            },
            {
                path: '/admin/absence-management',
                element: <AbsenceManagementAdmin />
            },
            {
                path: '/teacher/absence-management',
                element: <AbsenceManagementTeacher />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            }
        ]
    },
]);

export default router;
