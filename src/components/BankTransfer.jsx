import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { FormGroup, ControlLabel,FormControl,InputGroup,Button} from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class BankTransfer extends Component {
    constructor(props){
        super(props);
        this.state = {
            BankAcc: [],
            SelectedOutBankAcc: '',
            SelectedInBankAcc: '',
            TransferAmount: '',
            TransferDate: moment()
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getBankAcc();
        this.SelectOutBankAccChange = this.SelectOutBankAccChange.bind(this);
        this.SelectInBankAccChange = this.SelectInBankAccChange.bind(this);
        this.SelectDateChange = this.SelectDateChange.bind(this);
    }

    

    SelectOutBankAccChange(event){
        this.setState({ SelectedOutBankAcc: event.target.value });
    }

    SelectInBankAccChange(event){
        this.setState({ SelectedInBankAcc: event.target.value });
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


    render() {
        return (
            <div>
                 <FormGroup>
                    <ControlLabel>From Account:</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankAcc" value={this.state.SelectedOutBankAcc} onChange={this.SelectOutBankAccChange}>
                            <option value="">Please Select</option>
                            {this.state.BankAcc.map((topic, index) =>
                            <option value={topic} >{topic} </option>)}
                        </FormControl>
                    </FormGroup>
                <FormGroup>
                    <ControlLabel>To Account:</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankAcc" value={this.state.SelectedInBankAcc} onChange={this.SelectInBankAccChange}>
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
                    <br/>
                    {this.state.BankAmount}
                    <br/>
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
export default BankTransfer;