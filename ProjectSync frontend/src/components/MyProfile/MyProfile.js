import React, { useEffect, useState, useRef } from "react";
import "./MyProfile.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const MyProfile = ({ userDetails }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [tempEditingText, setTempEditingText] = useState(""); // Temporary storage for editing text
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const applicationsRef = useRef(null); // Ref for the applications section
  const cardsArray = Array.from({ length: 10 }, (_, index) => index + 1);
  const [selectedFile, setSelectedFile] = useState(null); // For storing the selected file
  const handleShowModal = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
    setTempEditingText(comment.content); // Initialize temporary editing text
    setShowModal(true);
  };
  function handleFileChange(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setSelectedFile(file); // Update the state with the selected file
  
      // Optionally, if you want to immediately display the selected image
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profile-picture').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/user/${userDetails.email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const persons = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Daisy Miller",
    "Edward Wilson",
    "Fiona Gallagher",
    "George Hall",
    "Hannah Scott",
    "Ian Morris",
    "Jane Foster",
    "Kyle Reed",
    "Liam Cook",
    "Mia Turner",
    "Noah Allen",
    "Olivia Lewis",
    "Peyton Jones",
    "Quinn Evans",
    "Ryan Baker",
    "Sophia Davis",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
    "Tyler Martinez",
  ];
  useEffect(() => {
    fetchComments();
  }, []);
  const scrollToApplications = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    applicationsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
   // Handle edit comment
   const handleEditComment = async (commentId, newText) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          method: "PUT", // or 'PATCH'
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newText }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }
      alert("Comment updated successfully!");
      // Here you might want to re-fetch all comments or update the local state
      updateCommentsAfterEdit(commentId, newText); // Update local state
      setShowModal(false);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      alert("Comment deleted successfully!");
      fetchComments(); // Reload comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const updateCommentsAfterEdit = (commentId, newText) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newText } : comment
      )
    );
  };
  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userDetails.screenName}/profile-picture`, {
        method: 'POST',
        body: formData,
        // Add any necessary headers for authentication
        // headers: {
        //   'Authorization': `Bearer ${yourAuthToken}`
        // },
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload profile picture.');
      }
  
      const result = await response.json();
      alert(result.message); // Assuming the server responds with a JSON object containing a message field
      
    } catch (error) {
      console.error('Error uploading the profile picture:', error);
      window.location.reload();
      alert('Profile picture uploaded succesfully!')
      
    }
  };
 

  
  return (
    <div className="main container">
      <div className="container">
        <div className="row align-items-center">
          {/* Profile Picture Column */}
          <div className="col-12 col-sm-4 col-md-3 mb-4 text-center">
          
          <img
  src={`http://localhost:8080/api/user/${userDetails.screenName}/picture`}
  alt="Profile"
  className="round-image"
  id="profile-picture"
  onError={(e) => e.target.src = 'profilePicture.png'}
/>
            <div>
              {/* File input for uploading profile picture */}
            
              <div className="upload-buttons">
              <input
  type="file"
  id="file-input"
  accept="image/*"
  onChange={handleFileChange}
  style={{display: 'none'}}
/>
<label htmlFor="file-input" className="upload-button-label btn-sm">
  Choose Photo
</label>
<button
  className="btn btn-primary btn-sm"
  onClick={handleUploadClick}
>
  Upload/Edit Photo
</button>

</div>
            </div>
          </div>
          {/* Form Column */}
          <div className="col-12 col-sm-8 col-md-9">
            <form>
              <div className="row">
                {/* First Name with Edit Button */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      id="firstName"
                      value={userDetails.firstName}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                {/* Last Name with Edit Button */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      id="lastName"
                      value={userDetails.lastName}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Email with Edit Button */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      id="email"
                      value={userDetails.email}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                {/* Username with Edit Button */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      id="username"
                      value={userDetails.screenName}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Date of Birth */}
                <div className="col-md-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="ocupation"
                      placeholder="Ocupation"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      placeholder="Country"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-12 mb-3 text-center">
                  {" "}
                  {/* Add text-center to align button */}
                  <textarea
                    className="form-control"
                    id="skills"
                    rows="6"
                    placeholder="Talk about yourself, and your skills..."
                  ></textarea>
                  <div className="mt-2">
                    {" "}
                    {/* Remove unnecessary column class and wrap button directly */}
                    <button className="btn btn-primary" type="button">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr className="line" />
      <h4>Your posts:</h4>
      <div className="container mt-3" id="card-profile">
      <div className="horizontal-scroll-container">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="card card-custom mx-2"
            style={{ width: "26rem", height: "15rem" }}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">Post {comment.id}</h5>
                <p className="card-text">
                  {comment.content.slice(0, 100)}
                  {comment.content.length > 100 ? "..." : ""}
                </p>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleShowModal(comment)}
                >
                  View/Edit
                </button>
                <button
                  className="btn btn-danger ml-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
                <a
                  href="#"
                  className="card-link-show"
                  onClick={scrollToApplications}
                >
                  Show applications
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="13"
            value={tempEditingText}
            onChange={(e) => setTempEditingText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleEditComment(editingCommentId, tempEditingText)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

      <br />
      <hr className="line" />
      <br />
      <h4>You have applied for:</h4>
      <div className="container mt-3">
        <div className="horizontal-scroll-container">
          {cardsArray.map((card) => (
            <div key={card} className="card card-custom mx-2">
              <div className="card-body">
                <h5 className="card-title">Card title {card}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="card-link">
                  Show status
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <hr className="line" />
      <h4 ref={applicationsRef}>Aici vor aparea aplicantii:</h4>
      <div class="grid-container">
        <div class="scrollable-list">
          <ul>
            {persons.map((person, index) => (
              <li key={index}>
                <div class="person-info">
                  <span>{person}</span>
                  <a href="#" class="card-link1">
                    View
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div class="independent-div">
          aici se va afisa continutul mesajului de aplicare de la user si tot de
          aici se va accepta sau nu colaborarea
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
