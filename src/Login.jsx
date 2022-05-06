import { useContext, useState } from 'react';
import './Login.css';
import { fetchLogin } from './services';
import ChatContext from './ChatContext';

function Login() {
    const [_, chatDispatch] = useContext(ChatContext);
    const [username, setUsername] = useState("");
    const [roomName, setRoomName] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handleRoomNameChange(e) {
        setRoomName(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!username) {
            setErrorMsg("Username cannot be empty.");
            return;
        }
        if (!roomName) {
            setErrorMsg("Room name cannot be empty.");
            return;
        }
        fetchLogin(username, roomName)
            .then(chat => {
                chatDispatch({
                    type: 'login',
                    username: username,
                    chat: chat,
                });
            })
            .catch(err => {
                setErrorMsg(err.errorMsg);
            });
    }

    let error = null;
    if (errorMsg !== null) {
        error = <div className='login-error'><span>{errorMsg}</span></div>;
    }

    return (
        <div className='login'>
            <span className='login-title'>Join Chat</span>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    {error}
                    <input type='text' name='username' placeholder='Please enter username.' onChange={handleUsernameChange} required /><br />
                    <input type='text' name='roomName' placeholder='Please enter room name.' onChange={handleRoomNameChange} required /><br />
                    <input type='submit' value='Login' className='login-button' />
                </form>
            </div>
        </div>
    );
}

export default Login;