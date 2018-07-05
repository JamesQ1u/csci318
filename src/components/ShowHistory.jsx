import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { Table, thead, tr, th, tbody } from 'react-bootstrap';



class ShowHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);

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
                            <td>1</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                        </tr>

                    </tbody>
                </Table>
            </div>
        )
    }

}

export default ShowHistory;