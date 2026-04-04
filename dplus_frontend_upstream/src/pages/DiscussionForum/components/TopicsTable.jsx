// pages/DiscussionForum/components/TopicsTable.jsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

const TopicsTable = ({ topics, onViewTopic }) => {
  // Safe date formatter function
  const formatDate = (dateString) => {
    if (!dateString) return "No activity";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dataset Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participants
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unread
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Activity
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {topics.map((topic, index) => (
            <tr
              key={topic.id || index}
              className={`group hover:bg-gray-50 transition-colors duration-150 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{topic.title || "Untitled"}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{topic.description || "No description"}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    topic.dataset_type === "SITE"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {topic.dataset_type || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{topic.participants || 0}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {topic.unread_count > 0 ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {topic.unread_count} new
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {formatDate(topic.last_activity)}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onViewTopic(topic)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  View
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicsTable;