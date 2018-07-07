import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { ListGroup, ListGroupItem,ProgressBar, Button } from 'react-bootstrap';

class ShowGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GoalList: [],
            GoalAmountList: [],
            TotalAmount:''
        }

        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
        this.getData();
    }

    getData() {
        this.Ref.collection('Goal').onSnapshot(coll => {
            const GoalList = coll.docs.map(doc => doc.id)
            this.setState({ GoalList })
            const GoalAmountList = coll.docs.map(doc => doc.data().GoalAmount)
            this.setState({ GoalAmountList })
        })
        this.Ref.onSnapshot(doc => {
            const TotalAmount = doc.data().TotalAmount;
            this.setState({TotalAmount})
        })
    }

    DelectGoal(topic){
        this.Ref.collection('Goal').doc(topic).delete()
    }

    render() {
        return (
            <div>
                {this.state.GoalList.map((topic, index) =>
                    <ListGroup>
                        <ListGroupItem bsStyle="warning">{topic}</ListGroupItem>
                        <ListGroupItem >Goal Amount:{this.state.GoalAmountList[index]}</ListGroupItem>
                        <ListGroupItem ><ProgressBar active now={(this.state.TotalAmount/(this.state.GoalAmountList[index]))*100} /></ListGroupItem>
                        <ListGroupItem >
                            <Button bsStyle="primary" onClick={() => this.DelectGoal(topic)}>
                                Delete
                            </Button>
                        </ListGroupItem>
                    </ListGroup>)}
                <br />
            </div>
        )
    }

}

export default ShowGoal;