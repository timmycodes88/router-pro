import { get, patch, post } from "../utils/request"

const Endpoint = "profile"

/**
 * @typedef {Object} ProfileResponse
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {Preferences} [preferences]
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
   * @returns {Promise<{url: string} | ErrorResponse}}
   */
  getProfileImg: acellusID => get(Endpoint + "-img", { acellusID }),
  /**
   * Update Preferences of a User
   * @param {string} acellusID
   * @param {Preferences} preferences
   * @returns {Promise<{} | ErrorResponse>}
   */
  updatePreferences: (acellusID, preferences) =>
    patch(Endpoint, acellusID, preferences),
}

export default ProfileAPI

/**@typedef {import("../features/profile/ProfileRoute").Preferences} Preferences */
