import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { Table, thead, tr, th, tbody } from 'react-bootstrap';



class ShowHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record:[]
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();

    }

    getData() {
        this.Ref.collection('Record').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let dataSet =
                        {
                            date: '',
                            type: '',
                            amount: ''
                        }
                    dataSet.date = doc.data().ActionDate;
                    dataSet.type = doc.data().Type;
                    dataSet.amount = doc.data().Amount;
                    this.state.record.push(dataSet);

                });
            })
        console.log(this.state.record);


    }


    render() {
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>

                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default ShowHistory;