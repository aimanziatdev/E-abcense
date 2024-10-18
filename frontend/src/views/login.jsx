import { useRef } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import logo from '../assets/logo.png'; 
import background from '../assets/background.svg'; 


export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        axiosClient.post("/login", payload)
          .then(({ data }) => {
              setUser(data.user);
              setToken(data.token);
          })
          .catch(err => {
              const response = err.response;
              if (response && response.status === 422) {
                  console.log(response.data.errors);
              }
          });
    };

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
                        backgroundColor: 'darkblue', 
                        padding: '1rem 2rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        color: 'white',
                        position: 'fixed',  
                        width: '100%',      
                        top: 0,             
                        zIndex: 1000        
                    }}>

                <h1 style={{
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
<span style={{ color: '#DAA520' }}>
                      {/* Display the logo image as the "E" */}
                      <img src={logo} alt="Logo" style={{ height: '70px', verticalAlign: 'middle', marginRight: '-20px' }} />-ABSENCE
                    </span>                </h1>
                <p style={{
                    fontSize: '20px',
                    maxWidth: '800px' // Restricts paragraph width for better readability
                }}>
Votre outil fiable pour gérer les absences efficacement.                </p>
                
            </div>
            <div className="login-signup-form animated fadeInDown" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
                <div className="form" style={{ marginTop: '110px', padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h1 className="title">
                        Login To Your Account
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <input ref={emailRef} type="email" placeholder="Email" />
                        <input ref={passwordRef} type="password" placeholder="Password" />
                        <button className="btn btn-block" style={{ backgroundColor: 'darkblue', color: 'white' }}>Login</button>
                    </form>
                </div>
            </div></>
    );
}
