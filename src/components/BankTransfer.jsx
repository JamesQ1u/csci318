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
            TransferDate: moment(),
            remark: ''
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
        this.setState({ TransferDate: date });
    }

    getBankAcc(){
        this.Ref.collection('Bank').onSnapshot(coll => {
            const BankAcc = coll.docs.map(doc => doc.id)
            this.setState({ BankAcc })
        })
    }

    transfer(state){
        if(this.state.SelectedInBankAcc === "Other"){
            this.Ref.collection('Bank').doc(this.state.SelectedOutBankAcc).get()
            .then(doc => {
                const BankAmount = doc.data().Amount
                this.Ref.collection('Bank').doc(this.state.SelectedOutBankAcc).update({
                    Amount: Number(BankAmount-this.state.TransferAmount)
                })
                const date = this.state.TransferDate.toString();
            this.Ref.collection('Record').doc(date).set({
                Type: 'BankTransfer',
                FromAccount: this.state.SelectedOutBankAcc,
                ToAccount: this.state.SelectedInBankAcc,
                TransferAmount: Number(this.state.TransferAmount),
                BeforeAmount: Number(BankAmount),
                AfterAmount: Number(BankAmount-this.state.TransferAmount),
                ActionDate: new Date(this.state.TransferDate),
                Remark: this.state.remark
            })
            this.Ref.get().then(doc => {
            const Amount = doc.data().TotalAmount
            this.Ref.update({
                TotalAmount: Number(Amount-this.state.TransferAmount)
            })
        })
               
            })
        }else{
            this.Ref.collection('Bank').doc(this.state.SelectedOutBankAcc).get()
            .then(doc => {
                const FromBankAmount = doc.data().Amount
                this.Ref.collection('Bank').doc(this.state.SelectedInBankAcc).get()
            .then(doc => {
                const ToBankAmount = doc.data().Amount
                this.Ref.collection('Bank').doc(this.state.SelectedOutBankAcc).update({
                    Amount: Number(FromBankAmount-this.state.TransferAmount)
                })
                this.Ref.collection('Bank').doc(this.state.SelectedInBankAcc).update({
                    Amount: Number(Number(ToBankAmount)+Number(this.state.TransferAmount))
                })
                const date = this.state.TransferDate.toString();
                this.Ref.collection('Record').doc(date).set({
                    Type: 'BankTransfer',
                    FromAccount: this.state.SelectedOutBankAcc,
                    ToAccount: this.state.SelectedInBankAcc,
                    TransferAmount: Number(this.state.TransferAmount),
                    BeforeAmount: Number(FromBankAmount),
                    AfterAmount: Number(FromBankAmount-this.state.TransferAmount),
                    ActionDate: new Date(this.state.TransferDate),
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
                    <ControlLabel>From Account:</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankAcc" value={this.state.SelectedOutBankAcc} onChange={this.SelectOutBankAccChange}>
                            <option key="">Please Select</option>
                            {this.state.BankAcc.map((topic, index) =>
                            <option key={topic} >{topic} </option>)}
                        </FormControl>
                    </FormGroup>
                <FormGroup>
                    <ControlLabel>To Account:</ControlLabel>
                        <FormControl componentClass="select" placeholder="BankAcc" value={this.state.SelectedInBankAcc} onChange={this.SelectInBankAccChange}>
                            <option key="">Please Select</option>
                            {this.state.BankAcc.map((topic, index) =>
                            <option key={topic} >{topic} </option>)}
                            <option key="Other">Other Account</option>
                        </FormControl>
                    </FormGroup>
                <FormGroup>
                        <ControlLabel>Amount:(HKD$)</ControlLabel>
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl type="number" onChange={event => this.setState({ TransferAmount: event.target.value })} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Remarks:</ControlLabel>
                        <InputGroup>
                            <FormControl type="text" onChange={event => this.setState({ remark: event.target.value })} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                     <ControlLabel>Transfer Date:</ControlLabel>
                        <DatePicker
                    selected={this.state.TransferDate}
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
                        onClick={() => this.transfer(this.state)}
                    >
                        Submit
                    </Button>
            </div>
        )

    }

}
export default BankTransfer;