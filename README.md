This is a card game application that I am developing. This is the first game that I have made where I am intending on having multiplayer. It is more complicated than the other projects that I have worked on, so it is going to take a bit.

The general idea is that it is going to be a basic turn based card game, kind of like pokemon, where you submit moves for your turn and vice versa. 

The different moves that the player inputs into the server have to be validated to make sure that they were not cheating. If they are cheating, they should be prompted that they were cheating.

Everything for the game will be handled using AJAX. This will allow for communication with the server without the need for page reloads.

I am going to use JQUERY ajax because it seems a lot less convoluted than using XMLHTTP requests.

---

### Website Structure

#### Users
Stored inside of an object. Keys are randomly generated numbers and values are usernames.

When a user generates a username, Math.random() is called and a random id is generated. This is then stored via cookies so that the browser remembers the user. Since there is nothing critical being stored on the site, I thought that passwords were kind of redundant. All of the user data gets removed when the server gets restarted anyways...

#### Lobbies
Lobbies are the way that the server organizes differnet games. For this game, there should only be two players per lobby, but if it is a different game, you might want more.

In the lobby screen, the lobbies are updated using AJAX. This makes it so that it can request the lobbys over and over again from the server, and on the client, update the lobby list.

#### Server.ts
The main file that runs the application. It is run via ts-node. All of the html is generated using the PUG template engine and the app is handled using EXPRESSJS. Basically, every page is handled with different routes. Pretty standard

