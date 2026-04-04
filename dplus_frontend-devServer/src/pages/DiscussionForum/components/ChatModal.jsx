// // pages/DiscussionForum/components/ChatModal.jsx
// import React, { useState, useEffect, useRef } from "react";
// import Modal from "../../../components/Modal";
// import MessageBubble from "./MessageBubble";
// import { ChatEmptyState } from "./EmptyState";

// const API = "http://192.168.0.102:8060/discussions";

// // Helper function to parse your custom date format "DD-MM-YYYY HH:MM:SS"
// const parseCustomDate = (dateString) => {
//   if (!dateString) return null;
  
//   try {
//     // Split date and time
//     const [datePart, timePart] = dateString.split(' ');
//     if (!datePart || !timePart) return null;
    
//     // Split date part (DD-MM-YYYY)
//     const [day, month, year] = datePart.split('-');
//     // Split time part (HH:MM:SS)
//     const [hours, minutes, seconds] = timePart.split(':');
    
//     // Create date object (months are 0-indexed in JavaScript)
//     return new Date(year, month - 1, day, hours, minutes, seconds);
//   } catch (error) {
//     console.error("Error parsing date:", error);
//     return null;
//   }
// };

// export default function ChatModal({ isOpen, onClose, topic, userId, headers }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (isOpen && topic) {
//       fetchMessages();
//     }
//   }, [isOpen, topic]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchMessages = async () => {
//     setLoading(true);
//     try {
//       console.log("Fetching messages for topic:", topic.id);
//       const res = await fetch(`${API}/messages/${topic.id}`, { headers });
//       const json = await res.json();
//       console.log("Messages response:", json);
      
//       // Handle the response structure based on your API
//       let messagesData = [];
//       if (json.data && Array.isArray(json.data)) {
//         messagesData = json.data;
//       } else if (Array.isArray(json)) {
//         messagesData = json;
//       }
      
//       // Filter out any invalid messages and sort by create_time
//       messagesData = messagesData
//         .filter(msg => msg && msg.id)
//         .sort((a, b) => {
//           const dateA = parseCustomDate(a.create_time);
//           const dateB = parseCustomDate(b.create_time);
//           if (!dateA || !dateB) return 0;
//           return dateA - dateB;
//         });
      
//       setMessages(messagesData);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || sending) return;

//     setSending(true);
//     try {
//       await fetch(`${API}/message`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({ 
//           topicId: topic.id, 
//           message: newMessage.trim() 
//         }),
//       });
//       setNewMessage("");
//       await fetchMessages();
//       inputRef.current?.focus();
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} setIsOpen={onClose} size="lg">
//       <div className="flex flex-col h-[600px]">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900">{topic?.title || "Chat"}</h3>
//           {topic?.description && (
//             <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
//           )}
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-6 py-4">
//           {loading ? (
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="animate-pulse flex gap-3">
//                   <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                   <div className="flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
//                     <div className="h-16 bg-gray-200 rounded"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : messages.length === 0 ? (
//             <ChatEmptyState />
//           ) : (
//             <div className="space-y-4">
//               {messages.map((message, index) => (
//                 <MessageBubble
//                   key={message.id}
//                   message={message}
//                   isOwn={message.sender_id === userId}
//                   showAvatar={index === 0 || messages[index - 1]?.sender_id !== message.sender_id}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input */}
//         <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
//           <div className="flex gap-2">
//             <input
//               ref={inputRef}
//               type="text"
//               className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               placeholder="Type your message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               disabled={sending}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={sending || !newMessage.trim()}
//               className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {sending ? (
//                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 "Send"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../components/Modal";
import MessageBubble from "./MessageBubble";
import { ChatEmptyState } from "./EmptyState";
import Api from "../../../utils/api"; // adjust path if needed

// Helper function to parse your custom date format
const parseCustomDate = (dateString) => {
  if (!dateString) return null;

  try {
    const [datePart, timePart] = dateString.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export default function ChatModal({ isOpen, onClose, topic, userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && topic) {
      fetchMessages();
    }
  }, [isOpen, topic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await Api.get({
        url: `/discussions/messages/${topic.id}`,
      });

      const json = res?.data;

      let messagesData = [];
      if (json?.data && Array.isArray(json.data)) {
        messagesData = json.data;
      } else if (Array.isArray(json)) {
        messagesData = json;
      }

      messagesData = messagesData
        .filter((msg) => msg && msg.id)
        .sort((a, b) => {
          const dateA = parseCustomDate(a.create_time);
          const dateB = parseCustomDate(b.create_time);
          if (!dateA || !dateB) return 0;
          return dateA - dateB;
        });

      setMessages(messagesData);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await Api.post({
        url: `/discussions/message`,
        data: {
          topicId: topic.id,
          message: newMessage.trim(),
        },
      });

      setNewMessage("");
      await fetchMessages();
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={onClose} size="lg">
      <div className="flex flex-col h-[600px]">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {topic?.title || "Chat"}
          </h3>
          {topic?.description && (
            <p className="text-sm text-gray-500 mt-1">
              {topic.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div>Loading...</div>
          ) : messages.length === 0 ? (
            <ChatEmptyState />
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === userId}
                  showAvatar={
                    index === 0 ||
                    messages[index - 1]?.sender_id !== message.sender_id
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}