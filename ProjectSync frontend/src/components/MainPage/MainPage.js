import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure this package is installed
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const handleSubmitComment = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/comments/user/${userDetails.email}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: comment,
        }),
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

  const handleEditComment = async (commentId, newText) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT', // or 'PATCH', depending on your backend
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
      fetchComments(); // Reload comments to show the updated one
      setEditingCommentId(null); // Exit editing mode
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

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
      fetchComments(); // Reload comments to reflect deletion
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  

  return (
    <div className='centered-content'>
      <h1>Welcome to the Main Page, {userDetails.firstName} {userDetails.lastName}</h1>
      <p>ID: {userDetails.id}</p>
      <p>Email: {userDetails.email}</p>
      <p>Role: {userDetails.role}</p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button onClick={handleSubmitComment}>Submit Comment</button>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '20px' }}>
              {editingCommentId === comment.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleEditComment(comment.id, editingText)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Comment:</strong> {comment.content}</p>
                  <p><em>Posted on:</em> {new Date(comment.createdDate).toLocaleString()}</p>
                  <button onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.content); }}>Edit</button>
                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No comments available at the moment</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
