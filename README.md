# get-notified-api

1- Clone this repo

2- Run npm install

3- Run npm start

4- you must create .env file directly in the repo and inside it:

PORT= 'your port number'

MONG_URI= 'your mongodb link'

SECRET='you can drop anything you want here but remember, keep it secret!'

MAIL='your website email'

PASS='password for email'

Note:the mail and pass are your main-email for sending emails because we're using nodeMailer for sending emails,
and remember to use the right credentiels, because the usual credentials won't be accepted so you should go to 
your email settings and add a second-level security step and add a app-password and use that pass word !
