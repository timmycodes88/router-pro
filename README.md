# Created by TimmyCodes88

This is a Project designed to outline how to effectively
Retrieve Data from the API and handle Errors with Routes.
Then also how to pass the Data & Functions Cleanly
with Full JSDocs

## Step by Step Guide to Building Route Files

**0. Plan the Required API Calls required for Building the page's Features**

- This is Generally some kind of main get and post actions
- Some Pages require multiple endpoints
  ex) Getting the Profile, Profile Image, Posts and getting the Comments of a post, etc.

**1. Create your API Objects**

- These are Stand Alone Files with a default export
  ex) ProfileAPI.js or ActivityAPI.js

  const Endpoint = '/rest/student/profile
  const ProfileAPI = {
  get: (params) => get(Endpoint, params)
  post: (params) => post(Endpoint, params)
  }
  export default ProfileAPI

**2. asd**

## Step by Step Guide to using Route Hooks
