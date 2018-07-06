import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp, db } from '../firebase';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import moment from 'moment';

import AddGoal from './AddGoal';
import AddBankAcc from './AddBankAcc';
import BankWithdraw from './BankWithdraw';
import BankTransfer from './BankTransfer';
import Income from './Income';
import Expenese from './Expenses';
import ShowState from './ShowState';
import ShowHistory from './ShowHistory';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContent: '',
            Date: moment()
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
            }else if (showContent === 'Analysis') {
                return (<ShowState />)
            } else if (showContent === 'History') {
                return (<ShowHistory/>)
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
                const date = this.state.Date.toString();
                    this.Ref.collection('Record').doc(date).set({
                    TotalAmount: Number(0),
                    Type: 'New Account',
                    ActionDate: new Date(this.state.Date)
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

    handleAnalysis(){
        this.setState({ showContent: 'Analysis' })

    }

    handleHistory(){
        this.setState({ showContent: 'History' })

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
                    <NavDropdown eventKey={1} title="Goal" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} onClick={() => this.handleAddGoal()}>Add Goal</MenuItem>
                            <MenuItem eventKey={1.2} onClick={() => this.handleBankWithdraw()}>Withdraw</MenuItem>
                            <MenuItem eventKey={1.3} onClick={() => this.handleBankTransfer()}>Transfer</MenuItem>
                        </NavDropdown> 
                       
                        <NavDropdown eventKey={2} title="Bank" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1} onClick={() => this.handleAddBankAcc()}>Add Bank Account</MenuItem>
                            <MenuItem eventKey={2.2} onClick={() => this.handleBankWithdraw()}>Withdraw</MenuItem>
                            <MenuItem eventKey={2.3} onClick={() => this.handleBankTransfer()}>Transfer</MenuItem>
                        </NavDropdown>  
                        <NavItem eventKey={3} onClick={() => this.handleIncome()}>
                        Income
                     </NavItem>   
                     <NavDropdown eventKey={4} title="Expenese" id="basic-nav-dropdown">
                            <MenuItem eventKey={4.1} onClick={() => this.handleExpenese()}>Add Expenese</MenuItem>
                            <MenuItem eventKey={4.2} onClick={() => this.handleAnalysis()}>Expenese Analysis</MenuItem>
                        </NavDropdown>      
                     <NavItem eventKey={5} onClick={() => this.handleHistory()}>
                        Record
                     </NavItem>
                    </Nav>
                    
                    <Nav pullRight>
                        <NavItem eventKey={7} onClick={() => this.signOut()}>
                            Sign Out
                     </NavItem>
                    </Nav>
                </Navbar>
                <br/>

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