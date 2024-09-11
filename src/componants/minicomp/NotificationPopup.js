import React, { useEffect, useState } from 'react';
import './notificationPopup.css';

const NotificationPopup = ({ message, color }) => {
  const [visible, setVisible] = useState(true);
//   const [type, setType] = useState(true);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="notification-popup" style={{ backgroundColor: color }}>
      <span>{color=="green"?(<img src='https://img.icons8.com/?size=20&id=vOpq1qsfC76L&format=png&color=000000'/>):(<img src='https://img.icons8.com/?size=20&id=aJXCfqpXgZUC&format=png&color=000000'/>)}{message}</span>
    </div>
  );
};

export default NotificationPopup;
