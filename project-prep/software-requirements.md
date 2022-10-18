# Wire-frames & Software Requirements

1. sign in
2. join a game/room
3. can guess letter during players turn
4. queue to catch up
5. scoring/game state
6. button to restart game with the same players
7. chat

## stretch goals

1. difficulty level chooser

  - limit lives
  - only get longer words

2. live chat

3. easy mode

  - nine lives
  - cat-themed

## Vision

Minimum Length: 3-5 sentences

**What is the vision of this product?**

- Our goal for this project is to develope a hangman game. It will be a live game where one to two player can join the game and play together. Each player with have a turn to guess a letter to try to uncover the secret word before your lives are up. While in the game, players have access to a chat where players can communicate with each other.

**What pain point does this project solve?**

- The pain point that this project solve is boredom. It's a friendly game where people of all ages and children can join in on a game.

**Why should we care about your product?**

- You should care about this project because it's a fun friendly game where you can play with adults and kids. Pass the time with a fun game and just chat with your friends.

## Scope (In/Out)

- IN - What will your product do
  - Describe the individual features that your product will do.
        - Game will allow player to login and play the game with friends.
        - Players will be able to chat while in the game.

  - High overview of each. Only need to list 4-5
        - The game will allow player to be able to login.
        - Players can join a game
        - Players can chat during game.
        - Player will have a turn to guess the letters of the secret word
        - Game will be over when the word is guessed or when lives runs out.

- OUT - What will your product not do.
  - Product will not allow you to join game if your not signed in.
  - Product will not be an IOS or Android app in the beginning.

**Minimum Viable Product vs What will your MVP functionality be?**

- Project's minimum viable product will be a functional game that can add player, allow them to guess a letter on their turn, game end when word is guessed or live run out, and player are able to talk to each other.

**What are your stretch goals?**

- to allow more then 2 players per game.
- chat

**What stretch goals are you going to aim for?**

- Chat is our main stretch goal.

## User Stories

- As a user, I want to be able to play a game of hangman that is politically correct.
- In the game I want to be able to either create a game so that I can invite someone to play against the computer, join a group by accepting an invite, or play alone against the computer.
- I want people to be able to sign up by creating an account, and be able to sign into their own account to keep track of their winning scores.
- I also want users to be able to delete their account
- As a user I want to be able to chat with the fellow player
- As a user I want to be able to be given a turn to guess a letter.

## Functional Requirements

*List the functionality of your product. This will consist of tasks such as the following:*

- user can login
- user can join game
- user can guess letter on their turn
- game will be over when secret word is guessed or if lives run out.
- user can restart game when over.
- user can chat with other players in the game.

## Data Flow

*Describe the flow of data in your application. Write out what happens from the time the user begins using the app to the time the user is done with the app. Think about the “Happy Path” of the application. Describe through visuals and text what requests are made, and what data is processed, in addition to any other details about how the user moves through the site.*

- The app's flow will start when user login
- other player can join game.
- When game start, server will generate secret word.
- each player will be given turns to guess letters of the words
- as letter are being guess, word will start to be revealed
- if word is guessed or live runs out, then game over
- players can restart game.

## Non-Functional Requirements (301 & 401 only)

*Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.*

*Examples include:*

**Security**
  -Auth0 for secure logins
Usability

- deployed on aws to be accessible to everyone on the web.
**Testability**
- Testing done with Jest and thunder client
Pick 2 non-functional requirements and describe their functionality in your application.

*If you are stuck on what non-functional requirements are, do a quick online search and do some research. Write a minimum of 3-5 sentences to describe how the non-functional requirements fits into your app.*

- Auth0 will our authorization and authentication. Players will sign in with Auth0 which will allow the app to know who the player is. Depending on the user role, the user will have different permissions. Having the user login, let's all the player know who they are talking to and who they are playing with.

You MUST describe what the non-functional requirement is and how it will be implemented. Simply saying “Our project will be testable for testability” is NOT acceptable. Tell us how, why, and what.

- Project will have testing setup. Testing will be done with jest. The test will check to make sure our basic functionality work as should. Testing will be run frequently and prior to deployment.

## UML, Wireframe, and Whiteboard

<https://projects.invisionapp.com/freehand/document/NtFl5NE00>
