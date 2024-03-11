import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ handleLogout, setActiveContent }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <div className='centered-content'>
      <nav className="navbar navbar-expand-lg navbar-light" id="title">
        <h2>ProjectSync.</h2>
        <button className="navbar-toggler" type="button" onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li>
              <a className="nav-link" href="#" onClick={() => setActiveContent('home')}>Home</a>
            </li>
            <li>
              <a className="nav-link" href="#" onClick={() => setActiveContent('posts')}>Posts</a>
            </li>
            <li>
              <a className="nav-link" href="#" onClick={() => setActiveContent('myprofile')}>My profile</a>
            </li>
            <li>
              <a className="nav-link" href="#" onClick={() => setActiveContent('collaborators')}>Collaborators</a>
            </li>
            <li>
              <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
