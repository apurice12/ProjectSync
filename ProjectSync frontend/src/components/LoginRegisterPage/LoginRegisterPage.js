import React, { useState } from 'react';
import './LoginRegisterPage.css';

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
        <h2>
          🤝 Conect: Find your ideal project partner with ease! ProjectSync connects you with collaborators who can elevate your project to new heights.
        </h2>
        <br />
        <h2>
          🌐 Diversity: Embrace the richness of diverse perspectives! Our platform brings together students from various disciplines, backgrounds, and experiences, fostering a melting pot of ideas that fuels creativity and ingenuity.
        </h2>
        <br />
        <h2>
          🚀 Ignite Innovation: Unleash your full potential by working on projects that inspire you. ProjectSync is about unleashing creativity, problem-solving skills, and passion for learning.
        </h2>
        <br />
        <h2>
          🌐 Global Reach: Break down geographical barriers and collaborate with students worldwide. Expand your horizons, gain cross-cultural insights, and make connections that transcend borders.
        </h2>
      </div>}
      </section>
      <section id="section-contact">
           <div className="content-contact">
           <h2><i class="bi bi-instagram"></i>  Instagram: Dive into our world of projects, behind-the-scenes looks, and daily inspiration. Follow us on Instagram [@ProjectSync] and be part of our visually creative journey.</h2>
<br />
            <h2><i class="bi bi-discord"></i> Discord: Join our Discord community [ProjectSync Community]! It's the perfect place to discuss your ideas, get help from the community, and connect with like-minded individuals. Let's chat, share, and collaborate.
<br /></h2>
<br />
<h2><i class="bi bi-tiktok"></i> TikTok: For quick tips, fun project insights, and engaging content, don't forget to check us out on TikTok [@ProjectSync]. Follow us for a dose of creativity and innovation in bite-sized videos.</h2>
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

const LoginForm = () => {
    return (
      <div className="login-container" id="login">
        <div className="top">
          <span>Don't have an account? <a href="#">Sign Up</a></span>
          <header>Login</header>
        </div>
        <div className="input-box">
          <input type="text" className="input-field" placeholder="Username or Email" />
          <i className="bx bx-user"></i>
        </div>
        <div className="input-box">
          <input type="password" className="input-field" placeholder="Password" />
          <i className="bx bx-lock-alt"></i>
        </div>
        <div className="input-box">
          <input type="submit" className="submit" value="Sign In" />
        </div>
        <div className="two-col">
          <div className="one">
            <input type="checkbox" id="login-check" />
            <label htmlFor="login-check"> Remember Me</label>
          </div>
          <div className="two">
            <a href="#" style={{ color: 'white' }}>Forgot password?</a>
          </div>
        </div>
      </div>
    );
  };

const RegisterForm = () => {
    return (
      <div className="register-container" id="register">
        <div className="top">
          <span>Have an account? <a href="#">Login</a></span>
          <header>Sign Up</header>
        </div>
        <div className="two-forms">
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Firstname" />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Lastname" />
            <i className="bx bx-user"></i>
          </div>
        </div>
        <div className="input-box">
          <input type="text" className="input-field" placeholder="Email" />
          <i className="bx bx-envelope"></i>
        </div>
        <div className="input-box">
          <input type="password" className="input-field" placeholder="Password" />
          <i className="bx bx-lock-alt"></i>
        </div>
        <div className="input-box">
          <input type="submit" className="submit" value="Register" />
        </div>
        <div className="two-col">
          <div className="one">
            <input type="checkbox" id="register-check" />
            <label htmlFor="register-check"> Remember Me</label>
          </div>
          <div className="two">
            <a href="#">Terms & conditions</a>
          </div>
        </div>
      </div>
    );
  };

export default LoginRegisterPage;