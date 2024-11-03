# FrontEnd:

## 1. Authentication(src/actions/auth.js)

### I. Function Login

#### Parameters:(Email, Password)

#### Method: 'POST'

#### Decription: Makes an API call to create a session for the user. The function receives JSON data from the server side.

If the login is successful, the function calls "Login successful" function that updates the state of the user on client side.
"Login Failed" function is calledif there is an error or if the credentials are invalid.

#### Output:

data(token, user)

#### message:sign in successful

success:True/False

### II. Function SignUp

#### Parameters: Email, password, confirm Password, name

#### Method: "Post"

#### Description:

Create a user(Manager or Applicant). The server side checks the conditions.
a.Password & Confirm Password matches.
b.If a user already exists with the same email. If user already exists, it returns the user.
c.Creates a new user if there is not a user with the same email in DB.

The function updates the state of the user on client side on success.

### III. Function Edit User Profile

#### Parmaters:

name, password, role, address, phonenumber, hours, gender, dob, skills

#### Method: "Post"

#### Description:

Finds the user inside the database & updates its name, password, role, address, phonenumber, hours, gender, dob, skills

#### Output:

#"User is updated Successfully"
data{user}
success:True

### IV. Function createJob

#### Parameters:

jobname, id, skills, location, description, pay, schedule

#### Method: "Post"

#### Description:

Creates new Job

#### Output:

data: {
job: job,
},
message: "Job Created!!",
success: true,

### V. Function closeJob

#### Parameters:

JobId

#### Method:

'POST'

#### Description:

Function makes an API call to change the status of the job to open to close

#### Output:

message: "Job status is updated Successfully",

      data: {
        job,
      },
      success: true,

### VI. Function Create Application

#### Parameters-

ID, Name, Address, PhoneNumber, Hours, DOB, gender, Skills, JobName, JobId, MangerId, resumeId

#### Method: "Post"

#### Description:

Function makes a new application whenever an applicant applies and takes the resume from the user's profile when applying.

#### Output:

#### Message:

data: {
application: application,
},
message: "Application Created!!",
success: true,
}

### VII. Function Accept Application

#### Parameters-

ApplicationId

#### Method: "Post"

#### Description:

Changes the status of the application from pending to Accepted.

#### Output:

message: "Application is updated Successfully",
data: {
application,
},
success: true,

### VIII. Function Reject Application

#### Parameters-

ApplicationId

#### Method: "Post"

#### Description:

Changes the status of the application from pending to Rejected.

#### Output:

message: "Application is updated Successfully",
data: {
application,
},
success: true

### IX. Function Get Resume by Id

### Parameters-

resumeId

### Method: "GET"

### Description:

Fetches the Resume associated with the specific Job Application

### Output:

data: {
resume.fileName,
application/pdf,
},
success: true

## 2. Email Service (/backend/models/email.js)
#### I. Function sendEmail

Parameters:
- applicantemail (String): The email address of the applicant to receive the notification
- subject (String): the subject line of the email
- html (String): the HTML content of the email body

#### Method: "POST"

#### Description:

Sends an email notification to an applicant regarding their job application status. This function uses the nodemailer package to send emails through a Gmail account, with authentication details retrieved from environment variables.

#### Ouput
- Success: Console logs "Email sent successfully!" if the email is sent without issues.
- Error: Console logs an error message if the email fails to send.


## 3. Skill Matching Feature (/frontend/src/components/JobListTile.tsx)
### I. Function getMatchStatus

#### Parameters
- job (Object): A job object with a list of required skills (job.requiredSkills)

#### Meethod: "GET"

#### Description:
This function calculates the match percentage between a job's required skills and an applicant's skills. It retrieves the user's skills from the state using useUserStore. The function compares the required skills for the job with the applicant's skills, calculating the percentage of matching skills. If no skills match, the percentage is set to 0% Match, with a red background.
For matches below 75%, the percentage is displayed with a yellow background. For matches at or above 75%, the percentage is displayed with a green background.

#### Output:
Return an object representing the match status with a string displaying the match percentage and object defining the background and text color for match display.
