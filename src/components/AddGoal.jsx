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
            amount: '',
            date: moment(),
            category: '',
            description: ''

        }
        this.user = firebaseApp.auth().currentUser;
    }

    date(date) {
        this.setState({date: date});
    }

    categoryChange(event){
        this.setState({category: event.target.value});
    }

    addGoal(state){
        const uid = this.user.uid;
        db.collection("user").doc(uid).set({
            amount: this.state.amount,
            date: new Date(this.state.date),
            category: this.state.category,
            description: this.state.description
        })
    }

    render() {
        return (
            <div className="form-inline">
                <div className="form-group">
                Amount:
                    <input
                        type="text"
                        placeholder='Add a amount'
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({amount: event.target.value})}
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
                Expenses category:
                <select id = "category" value={this.state.category} onChange={this.categoryChange.bind(this)}>
                    <option value ="">Please select</option>
                    <option value ="CarTruckExpenses">Car and Truck Expenses</option>
                    <option value="EducationandTraining">Education and Training</option>
                    <option value="Meals">Meals</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="OfficeExpenses">Office Expenses</option>
                    <option value="Rent">Rent</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                </select>
                <br/>
                Description:
                    <input
                        type="text"
                        placeholder='Add a description'
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({description: event.target.value})}
                    />
                    <br/>
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