import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp, db } from '../firebase';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import AddGoal from './AddGoal';
import AddBankAcc from './AddBankAcc';
import BankWithdraw from './BankWithdraw';
import BankTransfer from './BankTransfer';
import Income from './Income';
import Expenese from './Expenses';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContent: ''
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.setAcc();
    }

    selectShowContent = (showContent) => {
        if (showContent != null) {
            if (showContent === 'AddGoal') {
                return (<AddGoal />)
            } else if (showContent === 'AddBankAcc') {
                return (<AddBankAcc />)
            }else if (showContent === 'BankWithdraw') {
                return (<BankWithdraw />)
            }else if (showContent === 'BankTransfer') {
                return (<BankTransfer />)
            }else if (showContent === 'Income') {
                return (<Income />)
            }else if (showContent === 'Expenese') {
                return (<Expenese />)
            }
        }
    }

    setAcc(){
        this.Ref.get().then(doc => {
            if (!doc.exists) {
                this.Ref.set({
                    TotalAmount: Number(0),
                    Cash: Number(0)
                })
        } 
        })
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

    handleBankTransfer(){
        this.setState({ showContent: 'BankTransfer' })

    }

    handleIncome(){
        this.setState({ showContent: 'Income' })

    }
    
    handleExpenese(){
        this.setState({ showContent: 'Expenese' })

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
                            <MenuItem eventKey={2.3} onClick={() => this.handleBankTransfer()}>Transfer</MenuItem>
                        </NavDropdown>  
                        <NavItem eventKey={3} onClick={() => this.handleIncome()}>
                        Income
                     </NavItem>       
                     <NavItem eventKey={4} onClick={() => this.handleExpenese()}>
                        Expenese
                     </NavItem> 
                    </Nav>
                    
                    <Nav pullRight>
                        <NavItem eventKey={5} onClick={() => this.signOut()}>
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