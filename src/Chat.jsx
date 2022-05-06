import { useContext, useEffect, useState } from 'react';
import './Chat.css';
import ChatContext from './ChatContext';
import { fetchAddMsg, fetchChat, fetchLogout } from './services';

function Chat() {
  const [chatState, chatDispatch] = useContext(ChatContext);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const timerId = setInterval(() => {
      fetchChat()
        .then(chat => {
          chatDispatch({
            type: 'refreshChat',
            chat: chat,
          });
        });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleNewMsgChange = function (e) {
    setNewMsg(e.target.value);
  };

  const handleSubmit = function (e) {
    fetchAddMsg(newMsg)
      .then(newMsg => {
        chatDispatch({
          type: 'addMsg',
          msg: newMsg,
        });
      });
    setNewMsg("");
    e.preventDefault();
  };

  const handleLogout = function () {
    fetchLogout()
      .then(_ => {
        chatDispatch({
          type: 'logout',
        });
      });
  };

  const chatMsgs = chatState.chat.msgs.map(
    msg => {
      if (msg.user === chatState.username) {
        return (
          <div key={msg.id} className='chat-msg chat-msg-self'>
            <div className='chat-msg-user'>
              <span>{msg.user}</span>
            </div>
            <div className='chat-msg-text chat-msg-text-self'>
              <span>{msg.msg}</span>
            </div>
          </div>
        );
      }
      return (
        <div key={msg.id} className='chat-msg'>
          <div className='chat-msg-user'>
            <span>{msg.user}</span>
          </div>
          <div className='chat-msg-text'>
            <span>{msg.msg}</span>
          </div>
        </div>
      );
    }
  );

  return (
    <div className='chat'>
      <div className='chat-title'>
        <span className='chat-title-text'>Chat Room : {chatState.chat.roomName}</span>
        <button type='button' className='logout-btn' onClick={handleLogout}>&#10006;</button>
      </div>
      <div className='chat-msgs'>{chatMsgs}</div>
      <div className="chat-new-msg">
        <form action="POST" onSubmit={handleSubmit}>
          <input
            type='text'
            className='add-msg'
            placeholder='Type a message...'
            value={newMsg}
            onChange={handleNewMsgChange} />
          <input type='submit' value='SEND' />
        </form>
      </div>
    </div>
  );
}

export default Chat;