import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Collaborators = ({ userDetails }) => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const sockJS = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => sockJS,
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.onConnect = () => {
      console.log("Connected");
      stompClient.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        // Update messages state with the received message
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
      });

      stompClient.subscribe('/user/topic/recentMessages', (message) => {
        const recentMessage = JSON.parse(message.body);
        // Update messages state with the recent message
        setMessages(prevMessages => [...prevMessages, recentMessage]);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const sendMessage = async () => {
    try {
      if (client && newMessage.trim() !== "") {
        // Publish message via WebSocket
        const chatMessage = {
          senderEmail: userDetails.email,
          content: newMessage,
          type: 'CHAT',
        };
        client.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(chatMessage) });

        // Clear new message input
        setNewMessage("");
      }
    } catch (error) {
      setError('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  const handleAddCollaborator = () => {
    // Logic to handle adding a new collaborator
    // Send a request to the backend to add the new collaborator using the email stored in newCollaboratorEmail state
    console.log("Adding collaborator:", newCollaboratorEmail);
    // Clear the input field after adding the collaborator
    setNewCollaboratorEmail("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              Chat Room
            </div>
            <div className="card-body chat-window">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.senderEmail === userDetails.email ? 'text-right' : 'text-left'}`}>
                  <strong>{msg.senderEmail === userDetails.email ? 'You' : msg.senderEmail}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div className="card-footer">
              <div className="input-group mb-3">
                <textarea
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="Enter collaborator's email"
                />
                <div className="input-group-append">
                  <button className="btn btn-success" onClick={handleAddCollaborator}>Add Collaborator</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
