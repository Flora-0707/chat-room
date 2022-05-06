const uuid = require('uuid').v4;

const chats = {};

// We could make this an ES6 class
// or a constructor function
// But here we'll just make a new object
// without using the `new` operator
// and return it
function getOrCreateChat(id) {
    if (chats[id] !== undefined) {
        // chat already exists
        return chats[id];
    }

    // These are hardcoded initial state when we restart the server
    const id1 = uuid();

    const chat = { id };
    const msgs = {
        [id1]: {
            id: id1,
            msg: 'Let\'s chat!',
            user: 'admin',
            timestamp: Date.now(),
        },
    };

    chat.getMsgs = function () {
        return Object.values(msgs).sort((a, b) => a.timestamp - b.timestamp);
    };

    chat.addMsg = function (msg, user) {
        const id = uuid();
        msgs[id] = {
            id,
            msg,
            user,
            timestamp: Date.now(),
        };
        return id;
    };

    chat.getMsg = function (id) {
        return msgs[id];
    };

    // chat.deleteTodo = function (id) {
    //     delete msgs[id];
    // };

    chats[id] = chat;
    return chat;
};

module.exports = {
    getOrCreateChat,
};