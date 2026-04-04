import Api from "../../utils/api";
import { SET_DISCUSSION_TOPICS, SET_DISCUSSION_MESSAGES } from "../reducers/discussion-reducer";

const DiscussionActions = {

  getTopics: (cb = () => {}) => async (dispatch) => {
    try {
      const res = await Api.get({
        url: "/discussions/topic",
        inst: 0,   // 🔥 IMPORTANT — same style as Map GET
      });

      if (res?.status !== 200) return;

      dispatch(SET_DISCUSSION_TOPICS(res.data));
      cb();

    } catch (error) {
      console.log("getTopics error", error);
    }
  },

  getMessages: (topicId, cb = () => {}) => async (dispatch) => {
    try {
      const res = await Api.get({
        url: `/discussions/messages/${topicId}`,
        inst: 0,
      });

      if (res?.status !== 200) return;

      dispatch(SET_DISCUSSION_MESSAGES(res.data));
      cb();

    } catch (error) {
      console.log("getMessages error", error);
    }
  },

  createTopic: (data, cb = () => {}) => async (dispatch) => {
    try {
      const res = await Api.post({
        url: "/discussions/topic",
        data,
      });

      if (res?.status !== 200 && res?.status !== 201) return;

      cb();

    } catch (error) {
      console.log("createTopic error", error);
    }
  },

  sendMessage: (data, cb = () => {}) => async () => {
    try {
      const res = await Api.post({
        url: "/discussions/message",
        data,
      });

      if (res?.status !== 200 && res?.status !== 201) return;

      cb();

    } catch (error) {
      console.log("sendMessage error", error);
    }
  }
};

export default DiscussionActions;