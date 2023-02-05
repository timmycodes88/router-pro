import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import ActivityAPI from "../../api/ActivityAPI"
import ProfileAPI from "../../api/ProfileAPI"
import StatsAPI from "../../api/StatsAPI"
import { Student } from "../../AppRoute"
import { isErrorResponse } from "../../utils/request"

/**
 *
 * @typedef {Object} Profile
 * @property {string} acellusID
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} name
 * @property {Stats} stats
 * @property {Post[]} activity
 * @property {string} [imageURL]
 * @property {Preferences} [preferences]
 *
 *
 *
 * @typedef {Object} Stats
 * @property {number} gpa
 * @property {number} gold
 * @property {number} silver
 * @property {number} bronze
 *
 *
 *
 * @typedef {Object} Preferences
 * @property {string} [mood]
 * @property {string} [futureOccupation]
 * @property {string} [bgImg]
 *
 *
 *
 * @typedef {Object} Post
 * @property {string} postID
 * @property {string} acellusID
 * @property {string} body
 * @property {number} likes
 * @property {Comment[]} [comments]
 *
 *
 *
 * @typedef {Object} Comment
 * @property {string} commentID
 * @property {string} body
 * @property {string} acellusID
 * @property {string} name
 * @property {string} [imageURL]
 */
let PROFILE

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
  let imageURL = await ProfileAPI.getProfileImg(requestAcellusID)

  //! Check for Errors
  if (isErrorResponse(profile)) throw new Error("Failed Fetching Profile Image")

  //* Add the Profile URL to the Profile
  profile.imageURL = imageURL?.url

  //* Get the Stats & Activity
  const [stats, activity] = await Promise.all([
    StatsAPI.get(requestAcellusID),
    ActivityAPI.getUserPosts(requestAcellusID),
  ])

  //! Check for Errors
  if (isErrorResponse(stats)) throw new Error("Problem Fetching Stats")
  if (isErrorResponse(activity)) throw new Error("Problem Fetching Activity")

  //* Add the Stats to profile
  profile.stats = stats

  //* Add the Activity to profile
  if (activity?.posts)
    // Add the Name and Profile Image to each Post
    profile.activity = activity.posts
      //So I'm filtering out the post that don't match the acellusID
      .filter(post => post.acellusID === profile.acellusID)
      .map(post => ({
        ...post,
        name: profile.name,
        imageURL: profile.imageURL,
      }))
  else profile.activity = []

  //* Set Profile as a Global Variable
  PROFILE = profile

  return { profile, isMyProfile }
}

//* Action Types
const UPDATE_PREFERENCES = "UPDATE_PREFERENCES"
const LIKE_POST = "LIKE_POST"
const GET_COMMENTS = "GET_COMMENTS"
/**
 *
 * @param {import("react-router-dom").ActionFunctionArgs} props
 * @returns {Promise<string | null>}
 */
export async function profileAction({ request }) {
  const formData = await request.formData()

  /**
   * @typedef {Object} data
   * @property {UPDATE_PREFERENCES | LIKE_POST | GET_COMMENTS} type
   * @property {Object} [preferences]
   * @property {string} [postID]
   */
  const data = Object.fromEntries(formData.entries())

  switch (data.type) {
    case UPDATE_PREFERENCES:
      await updatePreferences(data.preferences)
      break
    case LIKE_POST:
      await likePost(data.postID)
      break
    case GET_COMMENTS:
      await getComments(data.postID)
      break
    default:
      throw new Error("Invalid Action Type")
      break
  }

  return { profile: PROFILE }
}

/**
 * Updates the Preferences
 * @param {Preferences} preferences
 */
async function updatePreferences(preferences) {
  //* Get the Student's ID
  const { acellusID } = await Student
  //* Update the Preferences
  const res = await ProfileAPI.updatePreferences(acellusID, {
    preferences: preferences,
  })
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Updating Preferences")
  //* Update the Global Profile
  PROFILE.preferences = preferences
}

/**
 * Likes a Post
 * @param {string} postID
 */
async function likePost(postID) {
  //* Handle liking a post
  if (!postID) throw new Error("No Post ID Provided")
  //* Get the Student's ID
  const { acellusID } = await Student
  //* Like the Post
  const res = await ActivityAPI.patchLike(postID)
  console.log(res)
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Liking Post")
  //* Update the Global Profile
  // PROFILE.activity = PROFILE.activity.map(post => {
  //   if (post.postID === postID) {
  //     post.likes = res.likes
  //   }
  //   return post
  // })
  console.log("Action thinks you liked it")
}

/**
 * Adds Comments to the Global Profile
 * @param {string} postID
 */
async function getComments(postID) {
  //* Handle getting comments for a post
  if (!postID) throw new Error("No Post ID Provided")
  //* Get Comments for Post
  const res = await ActivityAPI.getComments(postID)
  //! Check for Errors
  if (isErrorResponse(res)) throw new Error("Failed Fetching Comments")
  //* Add the Name and Profile Image to each Comment
  const newComments = await Promise.all(
    res.comments.map(async comment => {
      // Get Commenter's Profile
      const commenter = await ProfileAPI.get(comment.acellusID)
      //Check for Errors
      if (isErrorResponse(commenter))
        throw new Error("Failed Fetching Profile of Commenter")
      // Manipulate the Comment with the Commenter's Name
      comment.name = `${commenter.firstName} ${commenter.lastName[0]}`
      // Get Commenter's Profile Image
      const commenterImage = await ProfileAPI.getProfileImg(comment.acellusID)
      // Check for Errors
      if (isErrorResponse(commenterImage))
        throw new Error("Failed Fetching Profile Image of Commenter")
      // Set the Comment's Profile Image
      comment.imageURL = commenterImage?.url
      return comment //This is a Promise that should be resolved
    })
  )

  //* Update the Global Profile with the Modified comments
  PROFILE.activity = PROFILE.activity.map(post => {
    if (post.postID === postID) post.comments = newComments
    return post
  })
}

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
 * @returns {{
 *  updatePreferences: (preferences: Preferences) => void
 *  loadComments: (postID: string) => void
 *  likePost: (postID: string) => void
 * }} Actions
 */
export function useProfileActions() {
  const submit = useSubmit()

  return {
    /**
     * Update the Profile Preferences, takes a Preferences Object
     * @param {Preferences} preferences
     */
    updatePreferences: preferences =>
      submit({ preferences, type: UPDATE_PREFERENCES }, { method: "post" }),
    /**
     * Adds Comments to the Post based on it's Post ID
     * @param {string} postID
     */
    loadComments: postID =>
      submit({ postID, type: GET_COMMENTS }, { method: "post" }),
    /**
     * Likes the Post based on it's Post ID
     * @param {string} postID
     */
    likePost: postID => submit({ postID, type: LIKE_POST }, { method: "post" }),
  }
}
