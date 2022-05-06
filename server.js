const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

const sessions = require('./sessions');
const users = require('./users');
const chats = require('./chats');

app.use(cookieParser());
app.use(express.static('./build'));
app.use(express.json());

const getUsername = function (req) {
    const sid = req.cookies.sid;
    return sid ? sessions.getSessionUser(sid) : null;
}

const getRoomName = function (req) {
    const sid = req.cookies.sid;
    return sid ? sessions.getSessionRoom(sid) : null;
}

// Sessions
app.get('/api/session', (req, res) => {
    const username = getUsername(req);
    if (!username) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    res.json({ username });
});

app.post('/api/session', (req, res) => {
    const { username, roomName } = req.body;
    if (!username) {
        res.status(400).json({ error: 'required-username', errorMsg: 'Username cannot be empty.' });
        return;
    }
    if (!roomName) {
        res.status(400).json({ error: 'required-room-name', errorMsg: 'Room name cannot be empty.' });
        return;
    }
    if (!username.match(/^\w+$/)) {
        res.status(403).json({
            error: 'invalid-username',
            errorMsg: 'Invalid username. Only allows letters, digits and _.',
        });
        return;
    }
    if (!roomName.match(/^\w+$/)) {
        res.status(403).json({
            error: 'invalid-room-name',
            errorMsg: 'Invalid room name. Only allows letters, digits and _.',
        });
        return;
    }
    const sid = sessions.addSession(username, roomName);
    res.cookie('sid', sid);

    const chat = chats.getOrCreateChat(roomName);
    const msgs = chat.getMsgs();
    res.json({ username, roomName, msgs });
});

app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = getUsername(req);
    if (sid) {
        res.clearCookie('sid');
        sessions.deleteSession(sid);
    }
    // We don't report any error if sid or session didn't exist
    // Because that means we already have what we want
    res.json({ username });
});

// Chat
app.get('/api/chat', (req, res) => {
    const username = getUsername(req);
    const roomName = getRoomName(req);
    if (!username || !roomName) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const chat = chats.getOrCreateChat(roomName);
    const msgs = chat.getMsgs();
    res.json({ username, roomName, msgs });
});

app.post('/api/chat', (req, res) => {
    const username = getUsername(req);
    const roomName = getRoomName(req);
    if (!username || !roomName) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const { msg } = req.body;
    if (!msg) {
        res.status(400).json({ error: 'required-msg' });
        return;
    }
    const chat = chats.getOrCreateChat(roomName);
    const id = chat.addMsg(msg, username);
    res.json(chat.getMsg(id));
});

app.listen(process.env.PORT || PORT, () => console.log(`http://localhost:${PORT}`));