import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { FormGroup, ControlLabel, FormControl, InputGroup, Button } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class Expenses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ExpenseDate: moment(),
            remark: '',
            ExpenseCategory: '',
            BankAcc: [],
            Account: '',
            Amount: ''
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getBankAcc();
        this.AccountChange = this.AccountChange.bind(this);
        this.ExpenseDateChange = this.ExpenseDateChange.bind(this);
        this.CategoryChange = this.CategoryChange.bind(this);
    }

    getBankAcc() {
        this.Ref.collection('Bank').onSnapshot(coll => {
            const BankAcc = coll.docs.map(doc => doc.id)
            this.setState({ BankAcc })
        })
    }

    ExpenseDateChange(date) {
        this.setState({ ExpenseDate: date });
    }

    CategoryChange(event) {
        this.setState({ ExpenseCategory: event.target.value });
    }

    AccountChange(event) {
        this.setState({ Account: event.target.value });
    }

    expenses(state){
        if (this.state.Account === "Cash") {
            this.Ref.get().then(doc => {
                const CashAmount = doc.data().Cash
                const TotalAmount = doc.data().TotalAmount
                this.Ref.update({
                    TotalAmount: Number(Number(TotalAmount) - Number(this.state.Amount)),
                    Cash: Number(Number(CashAmount) - Number(this.state.Amount))
                })
                const date = this.state.ExpenseDate.toString();
                this.Ref.collection('Record').doc(date).set({
                    TotalAmount: Number(Number(TotalAmount) - Number(this.state.Amount)),
                    Type: 'Expense',
                    From: this.state.Account,
                    Amount: Number(this.state.Amount),
                    ExpenseCategory: this.state.ExpenseCategory,
                    BeforeAmount: Number(CashAmount),
                    AfterAmount: Number(Number(CashAmount) - Number(this.state.Amount)),
                    ActionDate: new Date(this.state.ExpenseDate),
                    Remark: this.state.remark
                })
            })
        } else {
            this.Ref.get().then(doc => {
                const TotalAmount = doc.data().TotalAmount
                this.Ref.collection('Bank').doc(this.state.Account).get().then(doc => {
                    const BankAmount = doc.data().Amount
                    this.Ref.update({
                        TotalAmount: Number(Number(TotalAmount) - Number(this.state.Amount)),
                    })
                    this.Ref.collection('Bank').doc(this.state.Account).update({
                        Amount: Number(Number(BankAmount) - Number(this.state.Amount)),
                    })
                    const date = this.state.ExpenseDate.toString();
                    this.Ref.collection('Record').doc(date).set({
                        TotalAmount: Number(Number(TotalAmount) - Number(this.state.Amount)),
                        Type: 'Expense',
                        From: this.state.Account,
                        Amount: Number(this.state.Amount),
                        ExpenseCategory: this.state.ExpenseCategory,
                        BeforeAmount: Number(BankAmount),
                        AfterAmount: Number(Number(BankAmount) - Number(this.state.Amount)),
                        ActionDate: new Date(this.state.ExpenseDate),
                        Remark: this.state.remark
                    })
                })
            })

        }
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <ControlLabel>Money From:</ControlLabel>
                    <FormControl componentClass="select" value={this.state.Account} onChange={this.AccountChange}>
                        <option key="">Please Select</option>
                        <option key="Cash">Cash</option>
                        {this.state.BankAcc.map((topic, index) =>
                            <option key={topic} >{topic} </option>)}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Amount:(HKD$)</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>$</InputGroup.Addon>
                        <FormControl type="number" onChange={event => this.setState({ Amount: event.target.value })} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Expense Category:</ControlLabel>
                    <FormControl componentClass="select" value={this.state.ExpenseCategory} onChange={this.CategoryChange}>
                        <option key="">Please Select</option>
                        <option key="Food">Salary</option>
                        <option key="Groceries">Bonus</option>
                        <option key="Investment">Investment</option>
                        <option key="Transportation">Transportation</option>
                        <option key="Utilities">Utilities</option>
                        <option key="Phone">Phone</option>
                        <option key="House">SHouse</option>
                        <option key="Clothes">Clothes</option>
                        <option key="Car">Car</option>
                        <option key="Entertainment">Entertainment</option>
                        <option key="Beauty">Beauty</option>
                        <option key="Socializing">Socializing</option>
                        <option key="Book">Book</option>
                        <option key="Insurance">Insurance</option>
                        <option key="Tex">Tex</option>
                        <option key="Health">Health</option>
                        <option key="Education">Education</option>
                        <option key="Other">Other</option>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Remarks:</ControlLabel>
                    <InputGroup>
                        <FormControl type="text" onChange={event => this.setState({ remark: event.target.value })} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Expense Date:</ControlLabel>
                    <DatePicker
                        selected={this.state.ExpenseDate}
                        onChange={this.SelectDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                    />
                </FormGroup>
                <Button
                    bsStyle="primary"
                    onClick={() => this.expenses(this.state)}
                >
                    Submit
                    </Button>
            </div>
        )

    }

}
export default Expenses;