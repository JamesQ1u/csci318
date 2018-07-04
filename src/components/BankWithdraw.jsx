import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { FormGroup, ControlLabel,FormControl,InputGroup,Button} from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
class BankWithdraw extends Component {
    constructor(props){
        super(props);
        this.state = {
            BankAcc: [],
            SelectedBankAcc: '',
            WithdrawAmount: '',
            BankAmount: '',
            WithdrawDate: moment()
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getBankAcc();
        this.SelectBankAccChange = this.SelectBankAccChange.bind(this);
        this.SelectDateChange = this.SelectDateChange.bind(this);
    }

    

    SelectBankAccChange(event){
        this.setState({ SelectedBankAcc: event.target.value });
    }

    SelectDateChange(date){
        this.setState({ WithdrawDate: date });
    }

    getBankAcc(){
        this.Ref.collection('Bank').onSnapshot(coll => {
            const BankAcc = coll.docs.map(doc => doc.id)
            this.setState({ BankAcc })
        })
    }

    withdraw(state){
        const BankAcc = this.state.SelectedBankAcc;
        this.Ref.collection('Bank').doc(BankAcc).get()
        .then(doc => {
            const BankAmount = doc.data().Amount
            this.setState({ BankAmount })
            this.Ref.collection('Bank').doc(BankAcc).update({
                Amount: Number(BankAmount-this.state.WithdrawAmount)
            })
            const date = this.state.WithdrawDate.toString();
            this.Ref.collection('Record').doc(date).set({
                Type: 'BankWithdraw',
                AccountNumber: BankAcc,
                WithdrawAmount: Number(this.state.WithdrawAmount),
                BeforeAmount: Number(BankAmount),
                AfterAmount: Number(BankAmount-this.state.WithdrawAmount),
                ActionDate: new Date(this.state.WithdrawDate)
            })
            this.Ref.get().then(doc => {
                const CashAmount = doc.data().Cash
                this.Ref.update({
                    TotalAmount: Number(Number(CashAmount)+Number(this.state.WithdrawAmount))
                })
        })
        })
        
    }

    render() {
        return (
            <div>
                 <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Your Bank Account:</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankAcc" value={this.state.SelectedBankAcc} onChange={this.SelectBankAccChange}>
                            <option value="">Please Select</option>
                            {this.state.BankAcc.map((topic, index) =>
                            <option value={topic} >{topic} </option>)}
                        </FormControl>
                    </FormGroup>
                <FormGroup>
                        <ControlLabel>Amount:(HKD$)</ControlLabel>
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl type="number" onChange={event => this.setState({ WithdrawAmount: event.target.value })} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Withdraw Date:</ControlLabel>
                            <DatePicker
                                selected={this.state.WithdrawDate}
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
                        onClick={() => this.withdraw(this.state)}
                    >
                        Submit
                    </Button>
            </div>
        )

    }

}
export default BankWithdraw;