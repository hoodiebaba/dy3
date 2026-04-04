export const SET_DISCUSSION_TOPICS = (data) => ({
  type: "SET_DISCUSSION_TOPICS",
  payload: data,
});

export const SET_DISCUSSION_MESSAGES = (data) => ({
  type: "SET_DISCUSSION_MESSAGES",
  payload: data,
});

const initialState = {
  topics: [],
  messages: [],
};

export default function DiscussionReducer(state = initialState, action) {
  switch (action.type) {

    case "SET_DISCUSSION_TOPICS":
      return {
        ...state,
        topics: action.payload,
      };

    case "SET_DISCUSSION_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    default:
      return state;
  }
}