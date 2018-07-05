import React, { Component } from 'react';
import { firebaseApp, db } from '../firebase';
import { FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap';

class AddGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Goal: '',
            GoalAmount: ''
        }
        this.uid = firebaseApp.auth().currentUser.uid;
        this.Ref = db.collection('user').doc(this.uid);
    }


    render() {
        return (
            <div>
                <FormGroup>
                    <ControlLabel>Goal:</ControlLabel>
                    <InputGroup>
                        <FormControl type="text" onChange={event => this.setState({ Goal: event.target.value })} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Amount:(HKD$)</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>$</InputGroup.Addon>
                        <FormControl type="number" onChange={event => this.setState({ GoalAmount: event.target.value })} />
                    </InputGroup>
                </FormGroup>
                <Button
                    bsStyle="primary"
                >
                    Submit
                    </Button>

            </div>
        )
    }
}


export default AddGoal;