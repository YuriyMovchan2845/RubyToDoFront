import React from 'react'
import {
    Link, Redirect,
    } from "react-router-dom"
import {sign_up as ask_sign_up} from './Requestor'
import cookie from 'react-cookies'
import './styles/styles.scss'
import swal from '@sweetalert/with-react';


export default class Registration extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            is_registered: false
        }

        this.sign_up = this.sign_up.bind(this)
    }

    render(){
        const is_registered = this.state.is_registered || cookie.load('user') !== undefined

        if(is_registered){
            return this.redirect_to_authorization()
        }

        return this.display_registration()
    }

    redirect_to_authorization(){
        return(
            <Redirect to='/authorization' />
        );
    }

    sign_up(){
        const login = document.getElementById('login').value
        const password = document.getElementById('password').value
        const password_confirmation = document.getElementById('password_confirmation').value

        if(login.length === 0 || password.length === 0 || password_confirmation.length === 0){
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Fill in all the fields!</p>
                </div>
            )
            return
        }

        if(login.indexOf(' ') !== -1 || login.indexOf('$') !== -1 || login.indexOf('!') !== -1 ||
        login.indexOf('/') !== -1 || login.indexOf('\\') !== -1 || login.indexOf('%') !== -1 ||
        login.indexOf('^') !== -1 || login.indexOf('&') !== -1 || login.indexOf('(') !== -1 ||
        login.indexOf('~') !== -1 || login.indexOf(')') !== -1){
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>You are using illegal symbols!</p>
                </div>
            )
            return
        }

        if(password !== password_confirmation){
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Passwords must match!</p>
                </div>
            )
            return
        }

        ask_sign_up(login, password)
        .then(data => {
            console.log(data)
            this.setState({is_registered: true})
        }).catch(error => {
            swal(
                <div>
                    <h1>Error!</h1>        
                    <p>Username is already exists.</p>
                </div>
            )
        });
    }

    display_registration(){
        return(
            <div className='mb-3 authorizationWrap'>
                <div className='bg-primary text-white card-header authorizationHead'>
                    Registration
                </div>
                <div className='authorizationBody'>
                    <div className='authorizationForm'>
                        <input className='form-control userInput' id="login" placeholder="Login"></input>
                        <input className='form-control userInput' type="password" id="password" placeholder="Password"></input>
                        <input className='form-control userInput' type="password" id="password_confirmation" placeholder="Confirm password"></input>
                        <button className='btn btn-primary formButton' onClick={this.sign_up}>Sign Up</button>
                    </div>
                    <div className='registrationLink'>
                        <Link to='/authorization'>Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }
}