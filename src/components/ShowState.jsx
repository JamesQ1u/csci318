import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';


class ShowState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myDataSource: {
                chart: {
                    caption: 'Monthly expenses',
                    numberPrefix: '$',
                },
                data: []
            },
            BankAcc: []
        }
        
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
        Charts(FusionCharts);

    }

    getData() {
        this.Ref.collection('Record').where("Type", "==", "Expense").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let dataSet =
                        {
                            label: '',
                            value: ''
                        }
                    dataSet.label = doc.data().ExpenseCategory;
                    dataSet.value = String(doc.data().Amount);
                    this.state.myDataSource.data.push(dataSet);

                });
            })
        console.log(this.state.myDataSource.data);


    }


    render() {
        return (
            <div>
                <ReactFC
                    width="600"
                    height="400"
                    type="pie3d"
                    dataSource={this.state.myDataSource}
                />
            </div>
        )
    }

}

export default ShowState;