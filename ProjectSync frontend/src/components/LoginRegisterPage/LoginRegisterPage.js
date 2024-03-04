import React, { useState, useEffect } from 'react';
import './LoginRegisterPage.css';
import { useNavigate } from 'react-router-dom';

const LoginRegisterPage = () => {
  // State to toggle between login and registration forms
  const [showLogin, setShowLogin] = useState(true);

  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <NavBar setShowLogin={setShowLogin} scrollToSection={scrollToSection} />
      <section id="section-home">
        <div className="section1">
          <div className="wrapper">
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </section>
      {/* Other sections remain unchanged */}
      <section id="section-about">
        {<div className="content-about">
        <br />
        <h1 style={{ marginLeft: '20%' }}>
          ProjectSync: Your Collaboration Hub! 🚀
        </h1>
        <hr />
        <br />
        <h4>
          🤝 Connect: Find your ideal project partner with ease! ProjectSync connects you with collaborators who can elevate your project to new heights.
        </h4>
        <br />
        <h4>
          🌐 Diversity: Embrace the richness of diverse perspectives! Our platform brings together students from various disciplines, backgrounds, and experiences, fostering a melting pot of ideas that fuels creativity and ingenuity.
        </h4>
        <br />
        <h4>
          🚀 Ignite Innovation: Unleash your full potential by working on projects that inspire you. ProjectSync is about unleashing creativity, problem-solving skills, and passion for learning.
        </h4>
        <br />
        <h4>
          🌐 Global Reach: Break down geographical barriers and collaborate with students worldwide. Expand your horizons, gain cross-cultural insights, and make connections that transcend borders.
        </h4>
      </div>}
      </section>
      <section id="section-contact">
           <div className="content-contact">
           <h4><i className="bi bi-instagram"></i>  Instagram: Dive into our world of projects, behind-the-scenes looks, and daily inspiration. Follow us on Instagram [@ProjectSync] and be part of our visually creative journey.</h4>
<br />
            <h4><i className="bi bi-discord"></i> Discord: Join our Discord community [ProjectSync Community]! It's the perfect place to discuss your ideas, get help from the community, and connect with like-minded individuals. Let's chat, share, and collaborate.
<br /></h4>
<br />
<h4><i className="bi bi-tiktok"></i> TikTok: For quick tips, fun project insights, and engaging content, don't forget to check us out on TikTok [@ProjectSync]. Follow us for a dose of creativity and innovation in bite-sized videos.</h4>
<br />
           </div>
      </section>
    </div>
  );
};

const NavBar = ({ setShowLogin }) => {
    // Function to handle click event for scrolling
    const scrollToSection = (sectionId) => {
      const section = document.querySelector(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    // Function to handle sign in, sign up, and contact actions
    const handleAuthAction = (showLoginForm) => {
      setShowLogin(showLoginForm);
      scrollToSection('#section-home'); // Scrolls to the home section upon action
    };
  
    return (
      <nav className="nav">
        <div className="nav-logo">
          <p>ProjectSync.</p>
        </div>
        <div className="nav-menu" id="navMenu">
          <ul>
            <li><a href="#section-about" className="link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('#section-about');
            }}>About</a></li>
            <li>
              <a href="#section-contact" className="link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('#section-contact');
              }}>Contact</a>
            </li>
          </ul>
        </div>
        <div className="nav-button">
          <button className="btn white-btn" onClick={() => handleAuthAction(true)}>Sign In</button>
          <button className="btn" onClick={() => handleAuthAction(false)}>Sign Up</button>
        </div>
      </nav>
    );
  };

  const LoginForm = ({ onSuccess }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // User is already logged in, redirect to the main page
        navigate('/mainpage');
      }
    }, [navigate]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      };

      try {
        const response = await fetch('http://localhost:8080/login', requestOptions);
  
        // Log the response for debugging
        console.log('Login response:', response);
  
        if (!response.ok) {
          throw new Error('Login failed. Please check your credentials.');
        }
  
        const data = await response.json();
  
        // Log the received token for debugging
        console.log('Received JWT token:', data.token);
  
        // Store the token in local storage
        localStorage.setItem('jwtToken', data.token);
  
        // Redirect to '/mainpage'
        navigate('/mainpage');
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'An error occurred. Please try again.');
      }
  
    };
 

    return (
        <div className="login-container" id="login">
            <form onSubmit={handleSubmit}>
                <div className="top">
                    <span>Don't have an account? <a href="#">Sign Up</a></span>
                    <header>Login</header>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="input-box">
                    <input type="email" className="input-field" placeholder="Email" name="email" value={credentials.email} onChange={handleChange} required />
                    <i className="bx bx-envelope"></i>
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" name="password" value={credentials.password} onChange={handleChange} required />
                    <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-box">
                    <input type="submit" className="submit" value="Sign In" />
                </div>
            </form>
        </div>
    );
};


  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
  
      try {
        const response = await fetch('http://localhost:8080/api/v1/registration', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to register. Please try again later.');
        }
        const data = await response.json();
        console.log('Registration successful:', data);
        // Handle successful registration here (e.g., redirect or show success message)
      } catch (error) {
        console.error('Registration error:', error);
        // Handle registration error here (e.g., show error message)
      }
    };
  
    return (
      <form className="register-container" id="register" onSubmit={handleSubmit}>
        <div className="top">
          <span>Have an account? <a href="#">Login</a></span>
          <header>Sign Up</header>
        </div>
        <div className="two-forms">
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Firstname" name="firstName" value={formData.firstName} onChange={handleChange} />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Lastname" name="lastName" value={formData.lastName} onChange={handleChange} />
            <i className="bx bx-user"></i>
          </div>
        </div>
        <div className="input-box">
          <input type="text" className="input-field" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
          <i className="bx bx-envelope"></i>
        </div>
        <div className="input-box">
          <input type="password" className="input-field" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          <i className="bx bx-lock-alt"></i>
        </div>
        <div className="input-box">
          <input type="submit" className="submit" value="Register" />
        </div>
      </form>
      
    );
  };


export default LoginRegisterPage;