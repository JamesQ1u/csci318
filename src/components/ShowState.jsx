import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';


class ShowState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ExpenseData: {
                chart: {
                    caption: 'Monthly expenses',
                    numberPrefix: '$',
                },
                data: []
            },
            RecordData: {
                chart: {
                    caption: 'Total amount record',
                    numberPrefix: '$',
                },
                data: []
            },
        }
        
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
        Charts(FusionCharts);

    }

    getData() {
        this.Ref.collection('Record').where("Type", "==", "Expense").get()
            .then(onSnapshot => {
                onSnapshot.forEach(doc => {
                    let dataSet =
                        {
                            label: '',
                            value: ''
                        }
                    dataSet.label = doc.data().ExpenseCategory;
                    dataSet.value = String(doc.data().Amount);
                    this.state.ExpenseData.data.push(dataSet);

                });
            })
            this.Ref.collection('Record').orderBy('ActionDate').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let dataSet =
                        {
                            label: '',
                            value: ''
                        }
                    dataSet.label = doc.data().ActionDate;
                    dataSet.value = String(doc.data().TotalAmount);
                    this.state.RecordData.data.push(dataSet);

                });
            })
    }


    render() {
        return (
            <div>
                <ReactFC
                    width="600"
                    height="400"
                    type="pie3d"
                    dataSource={this.state.ExpenseData}
                />
                <br/>
                <ReactFC
                    width="700"
                    height="400"
                    type="line"
                    dataSource={this.state.RecordData}
                />
            </div>
        )
    }

}

export default ShowState;