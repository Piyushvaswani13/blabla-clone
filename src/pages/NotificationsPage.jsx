// src/pages/NotificationsPage.jsx
import React, { useEffect } from 'react';
import { useRides } from '../context/RideContext';
import { useNavigate } from 'react-router-dom';

function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, updateNotificationStatus } = useRides();

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component load
  }, [fetchNotifications]);

  const handleAccept = (notificationId, rideId) => {
    updateNotificationStatus(notificationId, 'accepted');
    alert('Ride accepted!');
   navigate(`/payment/${String(rideId)}`); // Use rideId directly
  };

  const handleReject = (notificationId) => {
    updateNotificationStatus(notificationId, 'rejected');
    alert('Ride rejected!');
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications && notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            {/* <p>Ride Request from: {notification.userName || "Unknown User"}</p>
            <p>From: {notification.source || "N/A"}</p>
            <p>To: {notification.destination || "N/A"}</p> */}
            <p>Status: {notification.status || "Pending"}</p>
            <button onClick={() => handleAccept(notification.id, notification.rideId)}>Accept</button>
            <button onClick={() => handleReject(notification.id)}>Reject</button>
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
}

export default NotificationsPage;
