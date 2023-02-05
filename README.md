# Created by TimmyCodes88

This is a Project designed to outline how to effectively
use APIs, loaders, actions and handle Errors with Routes.
Then also how to pass the Data & Page Functions Cleanly with hooks
and Full JSDoc Coverage

## Step by Step Guide to Building Route Files

### 0. Plan the Required API Calls for Building the page's Features

- This is Generally some kind of main get and post actions
- Some Pages require multiple endpoints
  ex) Getting the Profile, Profile Image, Posts and getting the Comments of a post, etc.

### 1. Create your API Objects

- These are Stand Alone Files with a default export

- JSDoc all the Functions and Type Def the Response

- See ProfileAPI.js & ActivityAPI.js

### 2. Create The Route File

1.  Create a file named _PageNameRoute.js_ in the /features/page-name folder
2.  Create an Object Model (with typedef) that is already manipulated how you want to serve it to the page

- You'll see the difference from a ProfileResponse in ProfileAPI and a Profile Model in ProfileRoute.js

3.  Declare a const with all Caps for your Global Variable

- Lines (8-53) of ProfileRoute.js

### 3. Write your Async Loader Function

1. Make your Initial GET API calls to create the Object as Described above
2. Check for error responses and throw Errors if they happen
3. Set your Global Variable to be this Object
4. Return the Global variable and any other useful loader data

- Lines (55-118) of ProfileRoute.js

NOTE: Every Loader/Action can get the Global Student object with `const student = await Student`

### 4. Create all your Action Types

1. This is where you plan all possible functions for a user
   ex) UPDATE_PREFERENCES, LIKE_POST

- Lines (120-124) of ProfileRoute.js

### 5. Write your Async Action Function

1. Get formData from props.request and then convert it to an Object
2. Type Doc the possibilities of this Object
3. Create a Switch Statement for each possible Action Type
   later you will manipulate your Global Variable based on the Case
4. Return your Global Variable

- Lines (126-164) of ProfileRoute.js

### 6. Write your async manipulator functions and add them to the Action Function

- Name these in the camel case version of your ACTION_TYPES

1. Check that you have the right args, throw error if not
2. Make API calls with the data
3. Check if isErrorResponse and throw error if it is
4. Return an Updated aspect of your Global Variable
5. Go back to your Action Function and await this function, then update the Global variable with the new data

- Lines (166-282) of ProfileRoute.js

- These can be shared between routes if needed - ex) Classmates/Profile Activity Feed

### 7. Create 2 Hooks for Using the Route

1. First one is for passing the data named _usePageName_ - Lines (286-298) of ProfileRoute.js
2. Second one is called _usePageNameActions_ and returns a object with each possible submit to easily be used on the front end (each submit will also have a type: ACTION_TYPE) - Lines (300-337) of ProfileRoute.js

### 8. CELEBRATE

- You now have a complete Route file that can handle all requests and is easy to use on the frontend

NOTE 1: With this Method you should not revalidate the Loader and in the data hook return the action global variable and use the loader one once - ex) Lines (286-298) of ProfileRoute.js

NOTE 2: Every Function should have a JSDoc

## Step by Step Guide to using Route Hooks

### 0. Look into the JSDoc's of the route to see the Data and Actions you can use on this page

- These are at the bottom of the Route File and the Type Doc of the main data is at the Top of the File

### 1. Import your Data Hook and Populate your page

- Destructure when possible to make the code cleaner
- Setup state's default value to the data from the Hook (see newPreferences state in Profile.js)

### 2. Import the Actions Hook and add functionality to your page

- Note that with both of these hooks, they can be used anywhere within the page so avoid prop drilling
  and just use the hooks where they are needed

### 3. CELEBRATE this Page is DONE
