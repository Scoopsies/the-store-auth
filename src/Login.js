import React, { useState } from 'react';

const Login = ({ login, createNewUser })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const _login = (ev)=> {
    ev.preventDefault();
    login({ username, password });
  }

  const create = async () => {
    const json = {
      username: username,
      password: password,
      is_admin: false
    }
    await createNewUser(json)
    await login({username, password})
  }
  
  return (
    <form onSubmit={ _login }>
      <input
        placeholder='username'
        value={ username }
        onChange={ ev => setUsername(ev.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={ password }
        onChange={ ev => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Login</button>
      <button type='button' 
      disabled={!username || !password}
      onClick={() => create()}>Create new account</button>
    </form>
  );
}

export default Login;
