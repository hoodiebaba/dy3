// pages/DiscussionForum/components/MessageBubble.jsx
import React from "react";

// Helper function to parse your custom date format "DD-MM-YYYY HH:MM:SS"
const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  
  try {
    // Split date and time
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) return "";
    
    // Split date part (DD-MM-YYYY)
    const [day, month, year] = datePart.split('-');
    // Split time part (HH:MM:SS)
    const [hours, minutes] = timePart.split(':');
    
    // Return formatted time (HH:MM AM/PM)
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Helper function to get full date for grouping if needed
export const getFullDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "";
  }
};

const MessageBubble = ({ message, isOwn, showAvatar = true }) => {
  // Get initial for avatar
  const getInitial = (username) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {!isOwn && showAvatar && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {getInitial(message.username)}
            </div>
          </div>
        )}
        
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {showAvatar && (
            <span className="text-xs text-gray-500 mb-1 ml-1">
              {isOwn ? "You" : message.username || "Unknown"}
            </span>
          )}
          
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.message || ""}</p>
          </div>
          
          <span className="text-xs text-gray-400 mt-1 ml-1">
            {formatMessageTime(message.create_time)}
          </span>
        </div>
        
        {isOwn && showAvatar && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
              {getInitial(message.username)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;