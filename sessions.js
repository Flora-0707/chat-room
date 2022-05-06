const uuid = require('uuid').v4;

const sessions = {};

function addSession(username, roomName) {
    const sid = uuid();
    sessions[sid] = {
        username,
        roomName,
    };
    return sid;
};

function getSessionUser(sid) {
    return sessions[sid]?.username;
}

function getSessionRoom(sid) {
    return sessions[sid]?.roomName;
}

function deleteSession(sid) {
    delete sessions[sid];
}

module.exports = {
    addSession,
    deleteSession,
    getSessionUser,
    getSessionRoom,
};