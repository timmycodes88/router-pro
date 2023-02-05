import { get, patch, post } from "../utils/request"

const Endpoint = "activity"

/**
 * @typedef {Object} ActivityResponse
 * @property {string} postID
 * @property {string} acellusID
 * @property {string} body
 * @property {number} [likes]
 *
 *
 * @typedef {Object} CommentResponse
 * @property {string} commentID
 * @property {string} body
 * @property {string} acellusID
 * @property {number} [likes]
 */

const ActivityAPI = {
  /**
   * Get all Posts
   * @returns {Promise<ActivityResponse[] | ErrorResponse>}
   */
  getAll: () => get(Endpoint),
  /**
   * Get all Posts of a User
   * @param {string} acellusID
   * @returns {Promise<ActivityResponse[] | ErrorResponse>}
   */
  getUserPosts: acellusID => get(Endpoint, { acellusID }),
  /**
   * Get all Comments of a Post
   * @param {string} postID
   * @returns {Promise<CommentResponse[] | ErrorResponse>}
   */
  getComments: postID => get(Endpoint + "-comments", { postID }),
  /**
   * Patch a Like
   * @param {string} postID
   * @param {{
   * acellusID: string
   * }} body
   * @returns {Promise<{} | ErrorResponse>}
   */
  patchLike: (postID, body) => patch(Endpoint + "/posts", postID, { likes: 5 }),
  /**
   * Post a Comment
   * @param {{
   * postID: string,
   * message: sttring
   * }} body
   * @returns {Promise<{} | ErrorResponse>}
   */
  postComment: body => post(Endpoint + "-comments", body),
}

export default ActivityAPI
