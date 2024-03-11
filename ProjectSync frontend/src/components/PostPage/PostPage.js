import React, { useState, useEffect } from "react";
import "./PostPage.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PostPage = ({ setActiveContent }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [categoryModal, setCategoryModal] = useState("All Categories");
  const [capacity, setCapacity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCategoryChangeMain = (event) => setCategory(event.target.value);
  const handleCapacityChange = (event) => setCapacity(event.target.value);
  const handleCategoryChangeModal = (event) =>
    setCategoryModal(event.target.value);
  // Fetch user details from JWT token stored in localStorage

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming your JWT has email and screenName fields
        // Update this according to your token's structure
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  const [userDetails, setUserDetails] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    screenName: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails({
          id: decoded.sub, // Assuming 'sub' is the user ID
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
          screenName: decoded.screenName,
          
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [category]);

  const fetchComments = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      // Construct the URL based on the category
      // If 'All Categories' is selected, you might not want to append a category filter in your request
      const url =
        category === "All Categories"
          ? `http://localhost:8080/api/comments`
          : `http://localhost:8080/api/comments/${encodeURIComponent(
              category
            )}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
      setCategoryModal("All Categories");
      setCapacity("");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    // Call fetchComments with the current category
    fetchComments(category);
  }, [category]); // Re-fetch comments when category changes
  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // Submit new comment
  // Handle submit new comment
  const handleSubmitComment = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/user/${userDetails.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: comment,
            screenName: userDetails.screenName,
            category: categoryModal,
            capacity: capacity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      setComment("");
      alert("Comment posted successfully!");
      setCategory("All Categories");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
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
      fetchComments(); // Reload comments
      setEditingCommentId(null); // Exit editing mode
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
  const [activeCommentDetails, setActiveCommentDetails] = useState(null);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleViewClick = (comment) => {
    setActiveCommentDetails(comment);
  };
  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/${comment.idAppuser}/picture`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile picture");
      }
      const data = await response.blob();
      userDetails.profilePicture=(URL.createObjectURL(data)); // Set profile picture URL
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };
  const scrollToProjectIdea = () => {
    const projectIdeaElement = document.getElementById('project-idea');
    if (projectIdeaElement) {
      projectIdeaElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="container mt-2" id="sus">
    <div className="col-md-12" >
    <button className="btn btn-primary btn-lg" onClick={scrollToProjectIdea} id="post-button">Add a post</button>
    </div>
        <div className="col-md-12" id="first-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              marginTop:"3rem"
            }}
          >
            <select
              className="form-select form-select-lg"
              id="filter-category"
              aria-label=".form-select-lg example"
              style={{
                width: "auto",
                fontSize: "1rem",
                padding: "0.2rem 0.2rem",
                marginLeft: "14px"
              }}
              onChange={handleCategoryChangeMain}
              value={category}
            >
              <option value="All Categories">All Categories</option>
              <option value="IT">IT</option>
              <option value="Bussiness">Business</option>
              <option value="Education">Education</option>
              <option value="Science">Science</option>
            </select>
            <form className="form-inline my-2 my-lg-0" id="searchbar">
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search a post..."
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="submit">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div
            className="container custom-container custom-scrollbar"
            style={{ maxHeight: "800px", overflowY: "auto" }}
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="row mb-3">
                  <div className="col-12">
                    <div className="card">
                      <div
                        className="card-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        
                        }}
                      >
                        {comment.screenName === userDetails.screenName ? (
                          <div>
                            <span
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <img
  src={`http://localhost:8080/api/user/${comment.screenName}/picture`}
  alt="Profile"
  className="round-image"
  onError={(e) => e.target.src = 'profilePicture.png'}
/>
                              <em id="post-username">You</em>
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <img
  src={`http://localhost:8080/api/user/${comment.screenName}/picture`}
  alt="Profile"
  className="round-image"
  onError={(e) => e.target.src = 'profilePicture.png'}
/>
                            <em id="post-username">{comment.screenName}</em>
                          </span>
                        )}
                        <span>
                          {new Date(comment.createdDate).toLocaleString()}
                        </span>
                      </div>
                      <div className="card-body">
                        
                        <p className="card-title">{comment.content}</p>
                        {editingCommentId === comment.id ? (
                          <>
                            <textarea
                              className="form-control"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                            <button
                              className="btn btn-success mt-2"
                              onClick={() =>
                                handleEditComment(comment.id, editingText)
                              }
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary mt-2"
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                           {
  comment.screenName !== userDetails.screenName ? (
    <button className="btn btn-success">Apply</button>
  ) : (
    <div style={{ width: 'auto', height: 'auto', visibility: 'hidden' }}>
      <button className="btn btn-success">Apply</button>
    </div>
  )
}
                            
                            <span className="me-2">
                              Category: {comment.category}
                              <span style={{ margin: "0 20px" }}></span>{" "}
                              {/* This span acts as a spacer */}
                              <i className="bi bi-person-fill"></i> 0/
                              {comment.capacity}
                            </span>
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
        <div className="col-md-12" id ="project-idea">
          <div
            className="container custom-container"
            style={{
              padding: "20px",
              backgroundColor: "#151922",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="custom-scrollbar custom-modal-background"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              <div
                className="header custom-modal-background"
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #dee2e6",
                  paddingBottom: "10px",
                }}
              >
                <h5>Write your project idea</h5>
              </div>
              <div className="body ">
                <form className="custom-modal-background">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      className="form-group"
                      style={{
                        flexBasis: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <textarea
                        className="form-control custom-modal-background"
                        placeholder="Write a post..."
                        rows="12"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                          flexGrow: 1,
                          backgroundColor: "#151922",
                          borderColor: "lightgrey",
                        }} // Assuming #f8f9fa is the background color you want
                        onFocus={(e) =>
                          (e.target.style.backgroundColor = "#f8f9fa")
                        } // Keep background color on focus
                        onBlur={(e) =>
                          (e.target.style.backgroundColor = "#f8f9fa")
                        } // Optional: Revert to specific color on blur if needed
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ marginRight: "10px" }}>Category</label>
                      <select
                        className="form-select form-select-lg"
                        onChange={handleCategoryChangeModal}
                        value={categoryModal}
                        style={{ display: "block" }}
                      >
                        <option value="">Select Category</option>
                        <option value="IT">IT</option>
                        <option value="Business">Business</option>
                        <option value="Education">Education</option>
                        <option value="Science">Science</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ marginRight: "10px" }}>Capacity</label>
                      <input
                        type="number"
                        placeholder="Number of users"
                        className="form-control"
                        value={capacity}
                        onChange={handleCapacityChange}
                        style={{ width: "auto" }}
                      />
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                    ></div>
                  </div>
                  <div
                    className="footer"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        handleSubmitComment();

                      }}
                    >
                      Submit Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default PostPage;
