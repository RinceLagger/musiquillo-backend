# MUSIQUILLO!

<br>

## What is Musiquillo?

Musiquillo is an online game that will test not only your singing skills but also your ability to guess songs. Play online with your friends and have fun singing your favourite songs.

Each turn one player will have to hum a well-known song and the rest will have a limited time to figure it out. You will score points the more people figure out your song and also by figuring out other people's songs.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **SignUp / SignIn / Logout** 
-  **Create a new game:** The player will be able to create a new game and share the code of that game with his friends so that they can join and play together.
-  **Join a game:** Enter a code from a game created by a friend to join and play with him.
-  **Record/send Audio:** Each turn, one player will have to record his voice humming the indicated song and send this audio to the other players.
-  **Guess the song:** The other players will have to guess the song in a limited time.
-  **View User profile** As a user I can see my profile
-  **Edit User profile** As a user I can edit my profile


## Backlog
- delete user profile
- authentication with google
- have your friends in favourites and be able to send them private messages
- see ranking
- improve styles, UI
- ...

<br>


# Client / Frontend

## React Router Routes (React App)
| Path                      | Component            | Permissions                 | Behavior                                                     |
| ------------------------- | -------------------- | --------------------------- | ------------------------------------------------------------ |
| `/`                       | HomePage             | public `<Route>`            | Home page                                                    |
| `/signup`                 | SignupPage           | anon only  `<AnonRoute>`    | Signup form, link to login, navigate to homepage after signup |
| `/login`                  | LoginPage            | anon only `<AnonRoute>`     | Login form, link to signup, navigate to homepage after login |
| `/profile`               | ProfilePage     | user only `<PrivateRoute>`  | Page that shows the private profile of the user |
| `/room-menu`               | RoomMenu     | user only `<PrivateRoute>`  | Page that shows the menu to create a game or join a game                |
| `/singer`           | SingerPage      | user only `<PrivateRoute>`  | Page where the user can record audio and send it to the other players  |
| `/listener`           | ListenerPage    | user only `<PrivateRoute>`  | Page where users wait to receive an audio and have to guess the song |
| `/results`                | ResultsPage          | user only  `<PrivateRoute>` | Page where the results are displayed after each round of play  |
| `/final-results`                | FinalResultsPage          | user only  `<PrivateRoute>` | Page where the final results are displayed  |                                          


## Components

- HomePage
 
- LoginPage

- SignupPage

- ProfilePage  
  * UserCard
  * UploadPicture

- RoomMenu
 * Header
 * CreateRoomButton
 * JoinRoomButton

- SingerPage
  * PlayerList
  * SongSection
  * TimerBar
  * AudioRecord
  * AudioPlay

- ListenerPage
  * PlayerList
  * SongSection
  * TimerBar
  * AudioPlay
  * InputForm
  
- Routes
  * AnonRoute
  * PrivateRoute

- ResultsPage
  * SongSection
  * PointsList

- FinalResultsPage
  * WinnerSection
 
  


## Services

- Auth Service
  - authApi.login(user)
  - authApi.signup(user)
  - authApi.logout()

...
  

<br>


# Server / Backend


## Models

User model

```javascript
{
  username: {type: String, required: true },
  email: {type: String, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
}
```

Room model

```javascript
{
  roomId: { type: Number, require: true, unique: true},
  users: [{ username: { type: String, unique: true }, points: { type: Number, default: 0 } } ],
  turn: { type: Number, default: 0 },
  status: { type: String, enum: ["start","playing", "finished"], default: "start" },
},
```


Song model

```javascript
{
  name: String,
  hiddenName: String,
},
```


<br>


## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| POST        | `/auth/signup`                | {username, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {email, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`                | (empty)                      | 204            | 400          | Logs out the user                                            |

...



<br>


## Links


### Trello/Kanban


### Git


### Slides

