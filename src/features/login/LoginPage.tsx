import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FormEvent } from 'react';
import './loginPage.css';
import { useStore } from '../../app/stores/store';
import { UserFormValues } from '../../app/models/user';

function LoginPage() {
  
  const {userStore} = useStore();
  const [username, setUsername] = useState<string>('' as string);
  const [password, setPassword] = useState<string>('' as string);
  

  function submit(event: FormEvent) {
    event.preventDefault();
    userStore.login({username, password});
  }
  
  return (
    <div className="ui middle aligned center aligned grid" id='cus-grid'>
      <div className="column">
        <h2 className="ui teal image header">
          <img src="assets/images/logo.png" className="image" />
          <div className="content">
            Log-in to your account
          </div>
        </h2>
        <form className="ui large form" onSubmit={submit}>
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input 
                  type="text" 
                  name="email" 
                  placeholder="E-mail address"
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password"

                  onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button className="ui fluid large teal submit button" type='submit'>Login</button>
          </div>

          <div className="ui error message"></div>
        </form>
        <div className="ui message">
          New to us? <a href="#">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default observer(LoginPage);