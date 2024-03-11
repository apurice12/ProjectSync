import React, { useState, useEffect } from "react";
import "./ViewPosts.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ViewPosts = ({ userDetails }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [categoryModal, setCategoryModal] = useState("All Categories");
  const [capacity, setCapacity] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");


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
          method: "PUT", 
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


  return (
    <div className="container mt-2">
      <p className="latest-post">Latest Posts:</p>

      <div
        className="container custom-container custom-scrollbar"
        style={{ maxHeight: "750px", overflowY: "auto" }}
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
                          <em>You</em>
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

                        <em>{comment.screenName}</em>
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
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {/* This div ensures content is aligned to the right */}
                        </div>
                        {/* Added span for showing participant count, aligned to the right end of the row */}
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
  );
};

export default ViewPosts;
