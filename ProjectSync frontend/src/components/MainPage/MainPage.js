import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './MainPage.css'
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';
import Posts from '../ViewPosts/ViewPosts'; 
import MyProfile from '../MyProfile/MyProfile';
import Footer from '../Footer/Footer';
import PostPage from '../PostPage/PostPage';
import { Link } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Collaborators from '../Collaborators/Collaborators';

const MainPage = () => {
  const navigate = useNavigate();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [userDetails, setUserDetails] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    screenName: '',
    profilePicture: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails({
          id: decoded.sub,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
          screenName: decoded.screenName,
        });
        // Restore the last route or default to the main content
        const lastRoute = sessionStorage.getItem('lastRoute') || 'home';
        setActiveContent(lastRoute);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');

  };
  
  const [activeContent, setActiveContent] = useState('home'); // Default to showing home

  const showContent = (content) => {
    setActiveContent(content);
  };
  const handleButtonClick = () => {
    setActiveContent('posts');

  };

  return (
    <div className='main-content'>
      <Navbar handleLogout={handleLogout} setActiveContent={setActiveContent} />
      {activeContent === 'myprofile' && <MyProfile userDetails={userDetails} />}
      {activeContent === 'posts' && <PostPage setActiveContent={setActiveContent} />}
      {activeContent === 'contact' && <div>Contact Component or Content Here</div>}
      {activeContent === 'collaborators' && <Collaborators userDetails={userDetails} />}
      <div className="row h-120" id="main-page">
  {activeContent === 'home' && (
    <>
      <div className="col-md-6 d-flex align-items-center justify-content-center" id="content-left">
  <div>
    <em><h2 className="display-4 text-center">Welcome, {userDetails.firstName}</h2></em>
    <p className="lead text-center my-6">Find Your Project Partner...</p>
    <p className="text-center" id="content-left-paragraph">Join the thriving community of innovators, creators, and thinkers. With ProjectSync, you're only a few clicks away from finding the perfect collaboration for your next big idea.</p>
    <div className="d-flex justify-content-center">
      <button onClick={handleButtonClick} className="btn btn-primary btn-lg">
        Submit Proposal & Find Collaborators
      </button>
    </div>
    <div className="countdown-container text-center">
          <p className="countdown-label">Total Posts:</p>
          <div className="countdown-number">53</div>
        </div>
  </div>
</div>

      {/* Right side with your provided content */}
      <div className={`col-md-6 ${activeContent !== 'home' ? 'offset-md-6' : ''}`} id="viewpost-content">
        <Posts userDetails={userDetails}/>
        {/* Placeholder for future content */}
      </div>
      <div className="col-md-12">
        <Footer />
      </div>
    </>
  )}
</div>
        
      </div>

  );
}

export default MainPage;
