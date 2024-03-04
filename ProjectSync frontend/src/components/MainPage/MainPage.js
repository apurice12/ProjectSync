import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this is the correct import based on your jwt-decode version

const MainPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '', // Added role to the state
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails({
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role, // Assuming your token's payload includes a 'role' field
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('jwtToken');
    setUserDetails({
      firstName: '',
      lastName: '',
      email: '',
      role: '', // Reset role on logout
    });
    navigate('/');
  };

  // Destructure for easier access in the JSX
  const { firstName, lastName, email, role } = userDetails;

  return (
    <div>
      <h1>Welcome to the Main Page, {firstName} {lastName}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p> {/* Updated to display the user's role */}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/profile')}>My profile</button>
    </div>
  );
};

export default MainPage;
