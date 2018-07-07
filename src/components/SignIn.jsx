import React, { Component } from 'react';
import { Link } from 'react-router';
import { firebaseApp } from '../firebase';

import '../css/Signin.css'

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: {
                message: ''
            }
        }
    }

    signIn() {
        console.log('this.state', this.state);
        const { email, password } = this.state;
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .catch(error => {
                this.setState({ error })
            })

    }





    render() {
        return (
            <div className="main">
                <h3>Please Log In, or <Link to={'/signup'}>Sign Up</Link></h3>
                    <div className="form-group">
                    Email:
                    <br/>
                        <input
                            className="form-control"
                            type="text"
                            style={{ marginRight: '5px' }}
                            placeholder="Email"
                            onChange={event => this.setState({ email: event.target.value })}
                        />
                        <br/>
                        Password:
                        <br/>
                        <input
                            className="form-control"
                            type="password"
                            style={{ marginRight: '5px' }}
                            placeholder="Password"
                            onChange={event => this.setState({ password: event.target.value })}

                        />
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.signIn()}
                        >
                            Sign In
                    </button>
                    </div>
                    <div>{this.state.error.message}</div>
                </div>



        )
    }
}


export default SignIn;