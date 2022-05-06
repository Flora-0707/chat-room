const initialChatState = {
    isLoggedIn: false,
    username: null,
    chat: null,
};

function chatReducer(state, action) {
    switch (action.type) {
        case 'logout':
            return initialChatState;
        case 'login':
            return {
                isLoggedIn: true,
                username: action.username,
                chat: action.chat,
            };
        case 'addMsg':
            return {
                ...state,
                chat: {
                    ...state.chat,
                    msgs: [
                        ...state.chat.msgs,
                        action.msg,
                    ],
                },
            };
        case 'refreshChat':
            return {
                ...state,
                chat: action.chat,
            }
        default:
            return state;
    }
}

module.exports = {
    chatReducer,
    initialChatState,
};