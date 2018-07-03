import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp } from '../firebase';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import AddGoal from './AddGoal';
import AddBankAcc from './AddBankAcc';
import BankWithdraw from './BankWithdraw';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContent: ''
        }
    }

    selectShowContent = (showContent) => {
        if (showContent != null) {
            if (showContent === 'AddGoal') {
                return (<AddGoal />)
            } else if (showContent === 'AddBankAcc') {
                return (<AddBankAcc />)
            }else if (showContent === 'BankWithdraw') {
                return (<BankWithdraw />)
            }
        }
    }

    handleAddGoal(){
        this.setState({ showContent: 'AddGoal' })
    }

    handleAddBankAcc(){
        this.setState({ showContent: 'AddBankAcc' })
    }

    handleBankWithdraw(){
        this.setState({ showContent: 'BankWithdraw' })

    }

    signOut(){
        firebaseApp.auth().signOut();
    }

    render(){
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                    <Navbar.Brand>
                            Home
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} onClick={() => this.handleAddGoal()}>
                        Add Goal
                     </NavItem>
                       
                        <NavDropdown eventKey={2} title="Bank" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1} onClick={() => this.handleAddBankAcc()}>Add Bank Account</MenuItem>
                            <MenuItem eventKey={2.2} onClick={() => this.handleBankWithdraw()}>Withdraw</MenuItem>
                        </NavDropdown>  
                        <NavItem eventKey={3}>
                        User Management
                     </NavItem>       
  
                    </Nav>
                    
                    <Nav pullRight>
                        <NavItem eventKey={4} onClick={() => this.signOut()}>
                            Sign Out
                     </NavItem>
                    </Nav>
                </Navbar>
                <br />
                {this.selectShowContent(this.state.showContent)}
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log('state', state);
    return{}
}


export default connect(mapStateToProps, null)(App);