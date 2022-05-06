import { useEffect, useReducer } from 'react';
import './App.css';
import Login from './Login';
import Chat from './Chat';
import { fetchChat, fetchSession } from './services';
import ChatContext from './ChatContext';
import { initialChatState, chatReducer } from './ChatReducer';

function App() {
  const [chatState, chatDispatch] = useReducer(chatReducer, initialChatState);

  useEffect(
    () => {
      Promise.all([fetchSession(), fetchChat()])
        .then(values => {
          const [username, chat] = values;
          chatDispatch({
            type: 'login',
            username: username.username,
            chat: chat,
          });
        });
    },
    [],
  );

  let content = null;
  if (!chatState.isLoggedIn) {
    content = <Login />;
  } else {
    content = <Chat />;
  }

  return (
    <ChatContext.Provider value={[chatState, chatDispatch]}>
      <div className="app">
        {content}
      </div>
    </ChatContext.Provider>
  );
}

export default App;