import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { Alert, Button } from 'react-bootstrap';



class ShowHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: [],
            show: false,
            data: {}
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
        this.JsonTable = require('ts-react-json-table');
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);
    }

    getData() {
        this.Ref.collection('Record').orderBy('ActionDate').get()
            .then(onSnapshot => {
                onSnapshot.forEach(doc => {
                    let dataSet =
                        {
                            Date: '',
                            Type: '',
                            Amount: ''
                        }
                    dataSet.Date = doc.id;
                    dataSet.Type = doc.data().Type;
                    dataSet.Amount = doc.data().Amount;
                    this.state.record.push(dataSet);
                });
            })
    }


    handleDelete(state) {
        const id = this.state.data.Date;
        if (this.state.data.Type === "Expense") {
            this.Ref.get().then(doc => {
                const TotalAmount = doc.data().TotalAmount;
                const Cash = doc.data().Cash;

                this.Ref.collection('Record').doc(id).get().then(doc => {
                    const ExpenseFrom = doc.data().From;
                    const ExpenseAmount = doc.data().Amount;
                    if (ExpenseFrom === "Cash") {
                        this.Ref.update({
                            TotalAmount: Number(Number(TotalAmount) + Number(ExpenseAmount)),
                            Cash: Number(Number(Cash) + Number(ExpenseAmount))
                        })
                    } else {
                        this.Ref.collection('Bank').doc(ExpenseFrom).get().then(doc => {
                            const BankAmount = doc.data().Amount;
                            this.Ref.collection('Bank').doc(ExpenseFrom).update({
                                BankAmount: Number(Number(BankAmount) + Number(ExpenseAmount))
                            })
                        })
                        this.Ref.update({
                            TotalAmount: Number(Number(TotalAmount) + Number(ExpenseAmount)),
                        })
                    }


                    this.Ref.collection('Record').doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                })
            })
        } else if (this.state.data.Type === "Income") {
            this.Ref.get().then(doc => {
                const TotalAmount = doc.data().TotalAmount;
                const Cash = doc.data().Cash;

                this.Ref.collection('Record').doc(id).get().then(doc => {
                    const IncomeTo = doc.data().To;
                    const IncomeAmount = doc.data().Amount;
                    if (IncomeTo === "Cash") {
                        this.Ref.update({
                            TotalAmount: Number(Number(TotalAmount) - Number(IncomeAmount)),
                            Cash: Number(Number(Cash) - Number(IncomeAmount))
                        })
                    } else {
                        this.Ref.collection('Bank').doc(IncomeTo).get().then(doc => {
                            const BankAmount = doc.data().Amount;
                            this.Ref.collection('Bank').doc(IncomeTo).update({
                                BankAmount: Number(Number(BankAmount) - Number(IncomeAmount))
                            })
                        })
                        this.Ref.update({
                            TotalAmount: Number(Number(TotalAmount) - Number(IncomeAmount)),
                        })
                    }


                    this.Ref.collection('Record').doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                })
            })

        } else if (this.state.data.Type === "BankTransfer") {
            this.Ref.collection('Record').doc(id).get().then(doc => {
                const ToAccount = doc.data().ToAccount;
                const FromAccount = doc.data().FromAccount;
                const TransferAmount = doc.data().Amount;
                if (ToAccount === "Other") {
                    this.Ref.collection('Bank').doc(FromAccount).get().then(doc => {
                        const FromAccountAmount = doc.data().Amount;
                        this.Ref.get().then(doc => {
                            const TotalAmount = doc.data().TotalAmount;
                            this.Ref.update({
                                TotalAmount: Number(Number(TotalAmount) + Number(TransferAmount)),
                            })
                            this.Ref.collection('Bank').doc(FromAccount).update({
                                Amount: Number(Number(FromAccountAmount) + Number(TransferAmount))
                            })
                        })
                    })

                } else {
                    this.Ref.collection('Bank').doc(FromAccount).get().then(doc => {
                        const FromAccountAmount = doc.data().Amount;
                        this.Ref.collection('Bank').doc(FromAccount).update({
                            Amount: Number(Number(FromAccountAmount) + Number(TransferAmount))
                        })
                    })

                    this.Ref.collection('Bank').doc(ToAccount).get().then(doc => {
                        const ToAccountAmount = doc.data().Amount;
                        this.Ref.collection('Bank').doc(ToAccount).update({
                            Amount: Number(Number(ToAccountAmount) - Number(TransferAmount))
                        })


                    })


                }
                this.Ref.collection('Record').doc(id).delete().then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            })






        } else if (this.state.data.Type === "BankWithdraw") {

            this.Ref.collection('Record').doc(id).get().then(doc => {
                const WithdrawAmount = doc.data().Amount;
                this.Ref.get().then(doc => {
                    const Cash = doc.data().Cash;
                    this.Ref.update({
                        Cash: Number(Number(Cash) - Number(WithdrawAmount))

                    })
                })
            })
            this.Ref.collection('Record').doc(id).get().then(doc => {
                const AccountNum = doc.data().AccountNumber;
                const WithdrawAmount = doc.data().Amount;
                this.Ref.collection("Bank").doc(AccountNum).get().then(doc => {
                    const AccountAmount = doc.data().Amount;
                    this.Ref.collection("Bank").doc(AccountNum).update({
                        Amount: Number(Number(AccountAmount) + Number(WithdrawAmount))
                    })
                })

                this.Ref.collection('Record').doc(id).delete().then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            })
        } else {

        }
        this.setState({ show: false });
    }

    handleDismiss() {
        this.setState({ show: false });
    }

    handleShow(rowData) {
        this.setState({ data: rowData });
        this.setState({ show: true });
    }


    render() {
        if (this.state.show) {
            if (this.state.data.Type === "CreateBankAcc") {
                return (
                    <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                        <h4>Sorry!!!</h4>
                        <p>You cannot delete the create bank account record</p>
                        <p>
                            <Button onClick={this.handleDismiss}>Hide Alert</Button>
                        </p>
                    </Alert>
                )

            } else if (this.state.data.Type === "New Account") {
                return (
                    <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                        <h4>Sorry!!!</h4>
                        <p>You cannot delete the create account record</p>
                        <p>
                            <Button onClick={this.handleDismiss}>Hide Alert</Button>
                        </p>
                    </Alert>
                )

            } else {
                return (
                    <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                        <h4>Do you want to delete the record?</h4>
                        <p>
                            Record Date: {this.state.data.Date}
                            <br />
                            Record Type: {this.state.data.Type}
                            <br />
                            Record Amount: ${this.state.data.Amount}
                        </p>
                        <p>
                            <Button bsStyle="danger" onClick={() => this.handleDelete(this.state)}>Take this action</Button>
                            <span> or </span>
                            <Button onClick={this.handleDismiss}>Hide Alert</Button>
                        </p>
                    </Alert>
                )
            }
        }
        return (
            <div>
                <this.JsonTable className="table" rows={this.state.record} onClickRow={(event, rowData) => this.handleShow(rowData)} />
            </div>
        )
    }

}

export default ShowHistory;