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
             // eslint-disable-next-line
            this.state.ExpenseData.data = JSON.parse(sessionStorage.getItem("ExpenseData"))
            // eslint-disable-next-line
            this.state.RecordData.data = JSON.parse(sessionStorage.getItem("RecordData"))
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