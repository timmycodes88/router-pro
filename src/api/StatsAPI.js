import { get } from "../utils/request"

/**
 * @typedef {Object} StatsResponse
 * @property {number} acellusID
 * @property {number} gold
 * @property {number} silver
 * @property {number} bronze
 * @property {number} gpa
 */

const Endpoint = "stats"

const StatsAPI = {
  /**
   *
   * @param {string} acellusID
   * @returns {StatsResponse} StatsResponse
   */
  get: acellusID => get(Endpoint, { acellusID }),
}

export default StatsAPI
