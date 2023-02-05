import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import ActivityAPI from "../../api/ActivityAPI"
import ProfileAPI from "../../api/ProfileAPI"
import StatsAPI from "../../api/StatsAPI"
import { Student } from "../../AppRoute"
import { isErrorResponse } from "../../utils/request"

/**
 *
 * @param {import("react-router-dom").LoaderFunctionArgs} props
 * @returns {Promise<{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }>} Profile
 */
export async function profileLoader({ params: { acellusID } }) {
  //* Get the Student Object
  const student = await Student

  //* Check if it is the Student's Profile or Anothers
  const isMyProfile = acellusID ? acellusID === student.acellusID : true

  //* If the URL has an ID use it, else use the student's ID
  const requestAcellusID = acellusID ? acellusID : student.acellusID

  //* Get the Profile
  let profile = await ProfileAPI.get(requestAcellusID)

  //! Check for Errors
  if (isErrorResponse(profile)) throw new Error("Profile Not Found")

  //* Manipulate the Profile
  profile.name = `${profile.firstName} ${profile.lastName[0]}`
  profile.preferences = profile.preferences || {}

  //* Get the Profile URL
  let profileImg = await ProfileAPI.getProfileImg(requestAcellusID)

  //! Check for Errors
  if (isErrorResponse(profile)) throw new Error("Failed Fetching Profile Image")

  //* Add the Profile URL to the Profile
  profile.profileImg = profileImg?.url

  //* Get the Stats & Activity
  const [stats, activity] = await Promise.all([
    StatsAPI.get(requestAcellusID),
    ActivityAPI.getUserPosts(requestAcellusID),
  ])

  //! Check for Errors
  if (isErrorResponse(stats)) throw new Error("Problem Fetching Stats")
  if (isErrorResponse(stats)) throw new Error("Problem Fetching Activity")

  //* Add the Stats & Activity to the Profile
  profile.stats = stats
  profile.activity = activity?.posts || []

  //* Set Profile as a Global Variable
  PROFILE = profile

  return { profile, isMyProfile }
}

/**
 *
 * @param {import("react-router-dom").ActionFunctionArgs} props
 * @returns {Promise<string | null>}
 */
export async function profileAction({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())

  switch (request.method) {
    case "PATCH":
      //* Get the Student's ID
      const { acellusID } = await Student
      //* Update the Preferences
      const res = await ProfileAPI.updatePreferences(acellusID, {
        preferences: data,
      })
      //! Check for Errors
      if (isErrorResponse(res)) throw new Error("Failed Updating Preferences")
      //* Update the Global Profile
      PROFILE.preferences = data
      break
    default:
      //* Handle getting comments for a post
      if (data.postID) {
        const comments = await ActivityAPI.getComments(data.postID)
      }
      break
  }

  return { profile: PROFILE }
}

/**
 *
 * @typedef {Object} Profile
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} name
 * @property {{
 * gpa: number | '-',
 * gold: number,
 * silver: number,
 * bronze: number
 * }} stats
 * @property {{
 * posts: {
 * postID: string,
 * title: string,
 * body: string,
 * likes: number
 * }[]
 * }} activity
 * @property {string} [profileImg]
 * @property {{
 * mood?: string,
 * futureOccupation?: string,
 * bgImg?: string
 * }} [preferences]
 */
let PROFILE
//* TO SHARE THE PROFILE DATA BETWEEN THE PROFILE LOADER AND THE PROFILE ACTION

/**
 * Get Data for Profile Modal
 * @returns {{
 *   profile: Profile,
 *   isMyProfile: boolean
 * }} Profile
 */
export function useProfile() {
  const { profile: initialProfile, isMyProfile } = useLoaderData()
  const actionData = useActionData()

  return { profile: actionData?.profile || initialProfile, isMyProfile }
}

/**
 * @typedef {Object} Preferences
 * @property {string} [mood]
 * @property {string} [futureOccupation]
 * @property {string} [bgImg]
 *
 * @returns {{
 *  updatePreferences: (preferences: Preferences) => void
 * }} Actions
 */
export function useProfileActions() {
  const submit = useSubmit()

  return {
    //* Update the Profile Preferences, takes a Preferences Object
    updatePreferences: preferences => submit(preferences, { method: "patch" }),
  }
}
