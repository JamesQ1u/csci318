import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp, db } from '../firebase';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class AddGoal extends Component {
    constructor(props){
        super(props);
        this.state = {
            goal:'',
            date: moment()

        }
        this.user = firebaseApp.auth().currentUser;
    }

    date(date) {
        this.setState({date: date});
    }

    addGoal(state){
        const uid = this.user.uid;
        db.collection("user").doc(uid).set({
            goal: this.state.goal,
            date: new Date(this.state.date)
        })
    }

    render() {
        return (
            <div className="form-inline">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder='Add a goal'
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({goal: event.target.value})}
                    />
                    <br/>
                Date:
                <DatePicker
                        selected={this.state.date}
                        onChange={this.date.bind(this)}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        /><br/>
                    <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => this.addGoal(this.state)}
                    >
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { email } = state;
    return {
        email
    }
}

export default connect(mapStateToProps, null)(AddGoal);