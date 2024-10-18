import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';  // Import the logo image if you wish to use it here

export default function LandingPage() {
    const navigate = useNavigate();

    const backgroundImageUrl = './src/assets/landing.jpg';

    return (
        <><header style={{ backgroundColor: 'darkblue', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    <span style={{ color: 'white' }}>E-</span>
                    <span style={{ color: '#DAA520' }}>ABSENCE</span>
                </div>
            </div>
        </header><div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start', // Aligns content to the left
            backgroundImage: `url(${backgroundImageUrl})`, // Sets the specified image as background
            backgroundSize: 'cover', // Ensures the background image covers the entire div
            backgroundPosition: 'center', // Centers the background image
            padding: '20px', // Adds padding around the content
            color: 'white' // Sets text color to white for visibility
        }}>

                <h1 style={{
                    fontSize: '48px', // Larger font size
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
                    Welcome to  <span style={{ color: 'white' }}>E-</span><span style={{ color: '#DAA520' }}>ABSENCE</span>
                </h1>
                <p style={{
                    fontSize: '20px',
                    maxWidth: '480px' // Restricts paragraph width for better readability
                }}>
                    Your reliable tool for managing absences efficiently.
                </p>
                <button onClick={() => navigate('/login')} style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: '#DAA520', // Gold color for the button
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px' // Adds space above the button
                }}>
                    Get Started
                </button>
            </div></>
    );
}
