import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { FormGroup, ControlLabel, FormControl, InputGroup, Button } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class Income extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IncomeAmount: '',
            BankAcc: [],
            Account: '',
            IncomeCategory: '',
            IncomeDate: moment(),
            remark: ''
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getBankAcc();
        this.AccountChange = this.AccountChange.bind(this);
        this.IncomeDateChange = this.IncomeDateChange.bind(this);
        this.CategoryChange = this.CategoryChange.bind(this);
    }

    getBankAcc() {
        this.Ref.collection('Bank').onSnapshot(coll => {
            const BankAcc = coll.docs.map(doc => doc.id)
            this.setState({ BankAcc })
        })
    }

    AccountChange(event) {
        this.setState({ Account: event.target.value });
    }

    CategoryChange(event) {
        this.setState({ IncomeCategory: event.target.value });
    }

    IncomeDateChange(date) {
        this.setState({ IncomeDate: date });
    }

    income(state) {
        if (this.state.Account === "Cash") {
            this.Ref.get().then(doc => {
                const CashAmount = doc.data().Cash
                const TotalAmount = doc.data().TotalAmount
                this.Ref.update({
                    TotalAmount: Number(Number(TotalAmount) + Number(this.state.IncomeAmount)),
                    Cash: Number(Number(CashAmount) + Number(this.state.IncomeAmount))
                })
                const date = this.state.IncomeDate.toString();
                this.Ref.collection('Record').doc(date).set({
                    TotalAmount: Number(Number(TotalAmount) + Number(this.state.IncomeAmount)),
                    Type: 'Income',
                    To: this.state.Account,
                    Amount: Number(this.state.IncomeAmount),
                    IncomeCategory: this.state.IncomeCategory,
                    BeforeAmount: Number(CashAmount),
                    AfterAmount: Number(Number(CashAmount) + Number(this.state.IncomeAmount)),
                    ActionDate: new Date(this.state.IncomeDate),
                    Remark: this.state.remark
                })
            })
        } else {
            this.Ref.get().then(doc => {
                const TotalAmount = doc.data().TotalAmount
                this.Ref.collection('Bank').doc(this.state.Account).get().then(doc => {
                    const BankAmount = doc.data().Amount
                    this.Ref.update({
                        TotalAmount: Number(Number(TotalAmount) + Number(this.state.IncomeAmount)),
                    })
                    this.Ref.collection('Bank').doc(this.state.Account).update({
                        Amount: Number(Number(BankAmount) + Number(this.state.IncomeAmount)),
                    })
                    const date = this.state.IncomeDate.toString();
                    this.Ref.collection('Record').doc(date).set({
                        TotalAmount: Number(Number(TotalAmount) + Number(this.state.IncomeAmount)),
                        Type: 'Income',
                        To: this.state.Account,
                        Amount: Number(this.state.IncomeAmount),
                        IncomeCategory: this.state.IncomeCategory,
                        BeforeAmount: Number(BankAmount),
                        AfterAmount: Number(Number(BankAmount) + Number(this.state.IncomeAmount)),
                        ActionDate: new Date(this.state.IncomeDate),
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
                    <ControlLabel>Income to:</ControlLabel>
                    <FormControl componentClass="select" value={this.state.Account} onChange={this.AccountChange}>
                        <option key="">Please Select</option>
                        <option value="Cash">Cash</option>
                        {this.state.BankAcc.map((topic, index) =>
                            <option key={topic} >{topic} </option>)}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Amount:(HKD$)</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>$</InputGroup.Addon>
                        <FormControl type="number" onChange={event => this.setState({ IncomeAmount: event.target.value })} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Income Category:</ControlLabel>
                    <FormControl componentClass="select" value={this.state.IncomeCategory} onChange={this.CategoryChange}>
                        <option key="">Please Select</option>
                        <option key="Salary">Salary</option>
                        <option key="Bonus">Bonus</option>
                        <option key="Investment">Investment</option>
                        <option key="Sideline">Sideline</option>
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
                    <ControlLabel>Income Date:</ControlLabel>
                    <DatePicker
                        selected={this.state.IncomeDate}
                        onChange={this.IncomeDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                    />
                </FormGroup>

                <Button
                    bsStyle="primary"
                    onClick={() => this.income(this.state)}
                >
                    Submit
                    </Button>
            </div>
        )

    }

}
export default Income;