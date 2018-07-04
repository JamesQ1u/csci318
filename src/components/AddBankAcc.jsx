import React, { Component } from 'react';
import { FormGroup, ControlLabel,FormControl, Button, InputGroup } from 'react-bootstrap';
import { firebaseApp, db } from '../firebase';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class AddBankAcc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectedBank: '',
            SelectedAcc: '',
            AccNum: '',
            Amount: '',
            CreateDate: moment()
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.SelectedBankChange = this.SelectedBankChange.bind(this);
        this.SelectedAccChange = this.SelectedAccChange.bind(this);
        this.SelectDateChange = this.SelectDateChange.bind(this);
    }

    SelectedBankChange(event) {
        this.setState({ SelectedBank: event.target.value });
    }

    SelectedAccChange(event) {
        this.setState({ SelectedAcc: event.target.value });
    }

    SelectDateChange(date) {
        this.setState({ CreateDate: date });
    }

    addBankAcc(state) {
        db.collection("user").doc(this.uid).collection('Bank').doc(this.state.AccNum).set({
            BankName: this.state.SelectedBank,
            AccountType: this.state.SelectedAcc,
            AccountNumber: this.state.AccNum,
            Amount: Number(this.state.Amount),
            CreateDate: new Date(this.state.CreateDate)
        })
        const date = this.state.CreateDate.toString();
        db.collection("user").doc(this.uid).collection('Record').doc(date).set({
            Type: 'CreateBankAcc',
            BankName: this.state.SelectedBank,
            AccountType: this.state.SelectedAcc,
            AccountNumber: this.state.AccNum,
            Amount: Number(this.state.Amount),
            ActionDate: new Date(this.state.CreateDate)
        })
        db.collection("user").doc(this.uid).get()
        .then(doc => {
            const Amount = doc.data().TotalAmount
            db.collection("user").doc(this.uid).update({
                TotalAmount: Number(Number(Amount) + Number(this.state.Amount))
            })
        })
    }

    render() {
        return (
            <div>
                <form>
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Bank Name</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankName" value={this.state.SelectedBank} onChange={this.SelectedBankChange}>
                            <option value="">Please Select</option>
                            <option value="Standard Chartered">Standard Chartered</option>
                            <option value="The Hongkong and Shanghai Banking">The Hongkong and Shanghai Banking</option>
                            <option value="Citibank">Citibank</option>
                            <option value="JP Morgan Chase Bank">JP Morgan Chase Bank</option>
                            <option value="China Construction Bank">China Construction Bank</option>
                            <option value="Bank of China (Hong Kong)">Bank of China (Hong Kong)</option>
                            <option value="The Bank of East Asia">The Bank of East Asia</option>
                            <option value="DBS Bank (Hong Kong)">DBS Bank (Hong Kong)</option>
                            <option value="China CITIC Bank">China CITIC Bank</option>
                            <option value="Wing Lung Bank">Wing Lung Bank</option>
                            <option value="OCBC BANK">OCBC BANK</option>
                            <option value="Chiyu Banking">Chiyu Banking</option>
                            <option value="Dah Sing Bank">Dah Sing Bank</option>
                            <option value="Chong Hing Bank">Chong Hing Bank</option>
                            <option value="Nanyang Commercial Bank">Nanyang Commercial Bank</option>
                            <option value="Industrial and Commercial Bank of China (Asia)">Industrial and Commercial Bank of China (Asia)</option>
                            <option value="Tai Sang Bank">Tai Sang Bank</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Bank Account Type</ControlLabel>
                        <FormControl componentClass="select" placeholder="Bank Account Type" value={this.state.SelectedAcc} onChange={this.SelectedAccChange}>
                            <option value="">Please Select</option>
                            <option value="Saving Account">Saving Account</option>
                            <option value="Current Account">Current Account</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Account Number</ControlLabel>
                        <InputGroup>
                            <FormControl type="number" onChange={event => this.setState({ AccNum: event.target.value })} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Amount:(HKD$)</ControlLabel>
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl type="number" onChange={event => this.setState({ Amount: event.target.value })} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Create Date:</ControlLabel>
                            <DatePicker
                                selected={this.state.CreateDate}
                                onChange={this.SelectDateChange}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            />
                    </FormGroup> 
                    <Button
                        bsStyle="primary"
                        onClick={() => this.addBankAcc(this.state)}
                    >
                        Add Bank Account
                    </Button>
                </form>
            </div>
        )

    }

}
export default AddBankAcc;