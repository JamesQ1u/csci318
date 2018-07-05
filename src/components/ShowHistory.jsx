import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';



class ShowHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record:[],
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
        this.JsonTable = require('ts-react-json-table');
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
                    dataSet.Date = String(doc.data().ActionDate);
                    dataSet.Type = doc.data().Type;
                    dataSet.Amount = doc.data().Amount;
                    this.state.record.push(dataSet);
                });
            })
        console.log(this.state.record);


    }

    render() {
        return (
            <div>
                <this.JsonTable className="table" rows={ this.state.record } />
            </div>
        )
    }

}

export default ShowHistory;