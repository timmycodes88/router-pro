# Created by TimmyCodes88

This is a Project designed to outline how to effectively
Retrieve Data from the API and handle Errors with Routes.
Then also how to pass the Data & Functions Cleanly with hooks
and Full JSDocs Coverage

## Step by Step Guide to Building Route Files

**0. Plan the Required API Calls required for Building the page's Features**

- This is Generally some kind of main get and post actions
- Some Pages require multiple endpoints
  ex) Getting the Profile, Profile Image, Posts and getting the Comments of a post, etc.

**1. Create your API Objects (see ProfileAPI.js)**

- These are Stand Alone Files with a default export
  ex) ProfileAPI.js or ActivityAPI.js

  const Endpoint = '/rest/student/profile
  const ProfileAPI = {
  get: (params) => get(Endpoint, params)
  post: (params) => post(Endpoint, params)
  }
  export default ProfileAPI

- JSDoc all the Functions and Type Def the Response

**2. Create The Route File (see ProfileRoute.js)**

1.  Create an Object Model that is already manipulated how you want to serve it to the page
2.  Declare an Object with all Caps for your Global Variable

- Lines (8-53) of ProfileRoute.js

**3. Write your Async Loader Function**

1. Make your Initial API calls to create the Object as Described above
2. Check for error responses and throw Errors if they happen
3. Set your Global Variable to be this Object
4. Return the Global variable and any other useful loader data

- Lines (55-118) of ProfileRoute.js

**4. Create all your Action Types**

1. This is where you plan all possible functions for a user

- Lines (120-124) of ProfileRoute.js

**5. Write your Async Action Function**

1. Get formData from props.request and then convert it to an Object
2. Type Doc the possibilities of this Object
3. Create a Switch Statement for each possible Action Type
   later you will manipulate your Global Variable based on the Case
4. Return your Global Variable

- Lines (126-164) of profileRoute.js

**6. Coming Soon**

## Step by Step Guide to using Route Hooks
