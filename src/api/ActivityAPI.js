import { get, patch } from "../utils/request"

const Endpoint = "activity"

const ActivityAPI = {
  /**
   * Get all Posts
   * @returns {Promise<Post[] | ErrorResponse>}
   */
  getAll: () => get(Endpoint),
  /**
   * Get all Posts of a User
   * @param {string} acellusID
   * @returns {Promise<Post[] | ErrorResponse>}
   */
  getUserPosts: acellusID => get(Endpoint, { acellusID }),
  /**
   * Get all Comments of a Post
   * @param {string} postID
   * @returns {Promise<Comment[] | ErrorResponse>}
   */
  getComments: postID => get(Endpoint + "-comments", { postID }),
  /**
   * Patch a Like
   * @param {string} postID
   * @returns {Promise<{} | ErrorResponse>}
   */
  patchLike: postID => patch(Endpoint + "/posts", postID, { likes: 5 }),
}

export default ActivityAPI

/**
 * @typedef {import("../features/profile/ProfileRoute").Post} Post
 * @typedef {import("../features/profile/ProfileRoute").Comment} Comment
 */
