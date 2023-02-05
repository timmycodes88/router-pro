import { get, patch, post } from "../utils/request"

const Endpoint = "profile"

/**
 * @typedef {Object} ProfileResponse
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {Object | undefined} [preferences]
 * @property {string} [preferences.mood]
 * @property {string} [preferences.futureOccupation]
 * @property {string} [preferences.bgImg]
 *
 *
 *
 * @typedef {Object} ErrorResponse
 * @property {string} error
 * @property {string} [message]
 */

const ProfileAPI = {
  /**
   * Get the Profile of a User
   * @param {string} acellusID
   * @returns {Promise<ProfileResponse | ErrorResponse>}
   */
  get: acellusID => get(Endpoint, { acellusID }),
  /**
   * Get the Profile Image of a User
   * @param {string} acellusID
   * @returns {Promise<{imageURL: string} | ErrorResponse}}
   */
  getProfileImg: acellusID => get(Endpoint + "-img", { acellusID }),
  /**
   * Update Preferences of a User
   * @param {string} acellusID
   * @param {Object} preferences
   * @param {string} [preferences.mood]
   * @param {string} [preferences.futureOccupation]
   * @param {string} [preferences.bgImg]
   * @returns {Promise<? | ErrorResponse>}
   */
  updatePreferences: (acellusID, preferences) =>
    patch(Endpoint, acellusID, preferences),
}

export default ProfileAPI
