import React from 'react'
import cookie from 'react-cookies'
import './styles/styles.scss'
import {
    Link,
    Redirect
  } from "react-router-dom"
import {sign_in as ask_sign_in} from './Requestor'
import swal from '@sweetalert/with-react';


export default class Authorization extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            is_authenticated: false
        }

        this.sign_in = this.sign_in.bind(this)
    }

    render(){
        const is_logged_in = this.state.is_authenticated || cookie.load('user') !== undefined

        if(is_logged_in){
           return this.redirect_to_main()
        }

        return this.display_authorization()
    }

    sign_in(){
        const login = document.getElementById('login').value
        const password = document.getElementById('password').value

        if(login.length === 0 || password.length === 0){
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Fill in all required fields!</p>
                </div>
            )
            return
        }

        ask_sign_in(login, password)
        .then(token => {
            cookie.save('user', {token: token,
                                 username: login,
                                 password: password},
                                 { path: '/' })
            this.setState({is_authenticated: true})
        }).catch(error => {
            swal(
                <div>
                    <h1>Wrong username or password!</h1>        
                    <p>Please,re-enter.</p>
                </div>
            )
        });
    }

    redirect_to_main(){
        return(
            <Redirect to='/' />
        );
    }

    display_authorization(){
        return(
            <div className='mb-3 authorizationWrap'>
                <div className='bg-primary text-white card-header authorizationHead'>
                    Authorization
                </div>
                <div className='authorizationBody'>
                    <div className='authorizationForm'>
                        <input className='form-control userInput' id="login" placeholder="Login"></input>
                        <input className='form-control userInput' type="password" id="password" placeholder="Password"></input>
                        <button className='btn btn-primary formButton' onClick={this.sign_in}>Sign In</button>
                    </div>
                    <div className='registrationLink'>
                        <Link to='/registration'>Sign Up</Link>
                    </div>
                </div>
            </div>
        );
    }
}