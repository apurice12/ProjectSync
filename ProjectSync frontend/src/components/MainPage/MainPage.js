import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import syntax
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    screenName: ''
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Effect hook for authentication and fetching initial data
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails({
          id: decoded.sub, // Assuming 'sub' is the user ID
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
          screenName: decoded.screenName
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
    fetchComments();
  }, [navigate]);

  // Function to fetch comments
  const fetchComments = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  // Handle submit new comment
  const handleSubmitComment = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/comments/user/${userDetails.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment, screenName: userDetails.screenName }), 
      });
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      setComment('');
      alert('Comment posted successfully!');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Handle edit comment
  const handleEditComment = async (commentId, newText) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT', // or 'PATCH'
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newText }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit comment');
      }
      alert('Comment updated successfully!');
      fetchComments(); // Reload comments
      setEditingCommentId(null); // Exit editing mode
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      alert('Comment deleted successfully!');
      fetchComments(); // Reload comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // JSX structure for rendering the MainPage component
  return (
    
    <div className='centered-content'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <h2>ProjectSync.</h2>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
    <li>
   
    </li>
      <li>
        <a className="nav-link" href="#">My profile <span className="sr-only">(current)</span></a>
      </li>
      <li>
        <a className="nav-link" href="#">Posts <span className="sr-only">(current)</span></a>
        
      </li>
      <li>
        <a className="nav-link" href="#">About <span className="sr-only">(current)</span></a>
        
      </li>
      <li>
        <a className="nav-link" href="#">Contact <span className="sr-only">(current)</span></a>
        
      </li>
      <li >
        <a className="nav-link" href="# "onClick={handleLogout}>Logout <span className="sr-only">(current)</span></a>
      </li>
      
    
    </ul>
    <form className="form-inline my-2 my-lg-0">
    
       <input className="form-control mr-sm-2" type="search" placeholder="Search a post..." aria-label="Search" />
      <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>
<div className="container mt-2" id="sus">
<h2>Welcome, {userDetails.screenName}</h2>
  <div className="d-flex flex-row align-items-center">
    <input
      type="text"
      className="form-control me-2"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your post here..."
    />
    <button className="btn btn-primary me-2" onClick={handleSubmitComment}>Submit</button>
  </div>
      <div className="container custom-container custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="row mb-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {
    comment.screenName === userDetails.screenName ? (
      <div>
         <span style={{justifyContent:'space-between', display:'flex',alignItems:'center',gap:10}}><img src={`${process.env.PUBLIC_URL}/profilePicture.png`} alt="Description" className="round-image" />You </span>

      </div>
    ) : (
      <span style={{justifyContent:'space-between', display:'flex',alignItems:'center',gap:10}}><img src={`${process.env.PUBLIC_URL}/profilePicture.png`} alt="Description" className="round-image" />{comment.screenName} </span>


    )
  }
                  
                    <span className="me-2">
                        <i className="bi bi-person-fill"></i> 0/4
                      </span>
                    <span>Posted on {new Date(comment.createdDate).toLocaleString()}</span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{comment.content}</h5>
                    {editingCommentId === comment.id ? (
                      <>
                        <textarea
                          className="form-control"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <button className="btn btn-success mt-2" onClick={() => handleEditComment(comment.id, editingText)}>Save</button>
                        <button className="btn btn-secondary mt-2" onClick={() => setEditingCommentId(null)}>Cancel</button>
                      </>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                      <div style={{ textAlign: 'right' }}> {/* This div ensures content is aligned to the right */}
  {
    comment.screenName === userDetails.screenName ? (
      <div>
        <button className="btn btn-info me-2" onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.content); }}>Edit</button>
        <button className="btn btn-danger me-2" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
      </div>
    ) : (
      <button className="btn btn-success">Apply</button>
    )
  }
</div>

                     
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="row">
            <div className="col-12">
              <p>No posts available at the moment</p>
            </div>
          </div>
        )}
      </div>
      
    </div>
    </div>
  );
        }  
export default MainPage;
