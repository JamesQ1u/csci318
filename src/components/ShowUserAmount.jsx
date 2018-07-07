import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Column, Row } from 'simple-flexbox';

class ShowUserAmount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CashAmount: '',
            TotalAmount: ''
        }

        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
    }

    getData() {
        this.Ref.onSnapshot(doc => {
            const CashAmount = doc.data().Cash;
            const TotalAmount = doc.data().TotalAmount;
            this.setState({
                CashAmount: CashAmount,
                TotalAmount: TotalAmount
            })
        })
    }

    render() {
        return (
            <div>
                <Column flexGrow={1}>
                    <Row vertical='center'>
                        <Column flexGrow={1}>
                            <ListGroup>
                                <ListGroupItem bsStyle="success">Total Amount:</ListGroupItem>
                                <ListGroupItem>{this.state.TotalAmount}</ListGroupItem>
                            </ListGroup>
                        </Column>
                        <Column flexGrow={1}>
                        <ListGroup>
                            <ListGroupItem bsStyle="info">Cash Amount:</ListGroupItem>
                            <ListGroupItem>{this.state.CashAmount}</ListGroupItem>
                        </ListGroup>
                        </Column>
                        <Column flexGrow={1}>
                        <ListGroup>
                            <ListGroupItem bsStyle="warning">Bank Amount:</ListGroupItem>
                            <ListGroupItem>{this.state.TotalAmount-this.state.CashAmount}</ListGroupItem>
                        </ListGroup>
                        </Column>
                    </Row>
                </Column>


            </div>
        )
    }

}

export default ShowUserAmount;