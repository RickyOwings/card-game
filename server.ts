import * as express from 'express';
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs';



class Lobby {
    public static lobbies: Lobby[] = [];
    public static removeById(id: number) {
        const newLobbies = [];
        Lobby.lobbies.forEach((lobby)=>{
            if (lobby.id !== id) newLobbies.push(lobby);
        }) 
        Lobby.lobbies = newLobbies;
    }
    public static userInSystem(username: string){
        for (let i = 0; i < Lobby.lobbies.length; i++){
            if (Lobby.lobbies[i].users.includes(username)) return true;
        }
        return false;
    }
    public static idAssign = 0;
    public static newId(): number {
        const id = Lobby.idAssign;
        Lobby.idAssign++;
        return id;
    }
    public static getLobbyId(username: string): number {
        for (let i = 0; i < Lobby.lobbies.length; i++){
            if (Lobby.lobbies[i].users.includes(username)) return Lobby.lobbies[i].id;
        }
        return -1;
    }

    public static getLobbyFromUsername(username: string): Lobby | undefined {
        for (let i = 0; i < Lobby.lobbies.length; i++){
            if (Lobby.lobbies[i].users.includes(username)) return Lobby.lobbies[i];
        }
        return undefined;
    }

    public static lobbyById(id: number): Lobby | undefined {
        for (let i = 0; i < Lobby.lobbies.length; i++){
            if (Lobby.lobbies[i].id == id) return Lobby.lobbies[i];
        }
        return undefined;
    }

    public users: string[];
    public id: number;
    public capacity: number = 2;

    constructor(...users: string[]){
        this.users = users; 
        this.id = Lobby.newId();
        Lobby.lobbies.push(this);
    }

    public isFull(): boolean {
        if (this.users.length >= this.capacity) return true;
        return false;
    }

    public removeUser(username: string) {
        const newUsers: string[] = [];
        this.users.forEach((user)=>{
            if (user !== username) newUsers.push(user);
        })
        this.users = newUsers;
    }

    public addUser(username: string) {
        this.users.push(username);
    }
}

new Lobby("BaCharlie");
new Lobby("Markiplier");

const PORT = 8000;
const app = express();
const users = {};
app.set('view engine', 'pug');

app.use(express.urlencoded({
    extended: true,
}));

app.use(cookieParser());

//app.use(ruid({}));

function getUsername(id){
    return (Object.keys(users).includes(id)) ? users[id] : undefined;

}
// seom

function getPlayers(){
    return Object.values(users);
}

// ----------------------------------- HOME ------------------------------------
app.get('/', (req, res) => {
    console.log(req.cookies);
    const id = (req.cookies.id) ? req.cookies.id : Math.random();
    res.cookie("id", id, {maxAge: 1000 * 60 * 60 * 24});
    const username = getUsername(id);
    const needsLogin = (username === undefined);
    console.log(needsLogin, username, id);
    const links: string[] = [];
    if (needsLogin) links.push("Login");
    else links.push("Lobbies", "Login");
    links.push("About");

    res.render('index', {links: links, username: username, players: getPlayers(), needsLogin: needsLogin});
})

// ----------------------------------- LOGIN ---------------------------------

app.get('/login', (req, res) => {
    const id = req.cookies.id;
    const username = getUsername(id);
    res.render('login', {username: username, players: getPlayers()});
})

app.post('/login', (req, res) => {
    const username = (req.body["username"]) ? req.body["username"] : undefined;
    const id = req.cookies.id;
    if (!Object.values(users).includes(username)){
        users[id] = username;
        res.redirect("/")
    } else {
        res.render('error', {players: getPlayers(), username: getUsername(req.sessionID)});
    }
});

// ---------------------------------- PLAY SCREEN ------------------------------

app.get('/lobbies', (req, res)=>{
    const id = req.cookies.id;
    const username = getUsername(id);
    if (!username) { // catch if user should not be on lobbies page. so yeah
        res.redirect("/")
        return;
    }
    res.render('lobbies', {username: username, lobbies: Lobby.lobbies});
});

app.post('/lobbies', (req, res)=>{
    const id = req.cookies.id;
    const username = getUsername(id);
    if (Lobby.userInSystem(username)) {
        res.send("In System");
        return;
    };
    new Lobby(username);
    res.send("Not In System");
});


app.get('/getlobbies', (req, res)=>{
    res.send(Lobby.lobbies);
})

app.post('/joinlobby', (req, res)=>{
    const id = req.cookies.id;
    const username = getUsername(id);
    const lobbyID = req.body.id;

    const targetLobby = Lobby.lobbyById(lobbyID);    
    // Make sure lobby exists
    if (targetLobby === undefined) return;
    console.log("Lobby exists");

    // Make sure that the lobby is not full
    if (targetLobby.isFull()) return;
    console.log("Lobby is not full")

    // Make sure user not already in lobby
    if (targetLobby.users.includes(username)) return;
    console.log("User is not already in lobby");

    // Find whichever lobby the user is already in, and remove them from that lobby
    const currentLobby = Lobby.getLobbyFromUsername(username); 
    if (currentLobby !== undefined) {
        currentLobby.removeUser(username); 
        console.log("Removing user from lobby " + currentLobby.id);
    }
    // Put the user into the target lobby
    targetLobby.addUser(username);
    console.log(`Successfully put ${username} in lobby ${lobbyID}`);
});

// ---------------------------------- ABOUT SCREEN ------------------------------

app.get('/about', (req, res)=>{
    const id = req.cookies.id;
    const username = getUsername(id);
    res.render('about', {username: username});
});

app.listen(PORT, ()=>{
})
