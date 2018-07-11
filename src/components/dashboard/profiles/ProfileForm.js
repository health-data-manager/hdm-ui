import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import { Radio, RadioGroup } from 'react-radio-group';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { confirmAlert } from 'react-confirm-alert';

import { states } from '../../../utils/us-states';

import 'react-confirm-alert/src/react-confirm-alert.css';

export default class ProfileForm extends Component {
  constructor(props) {
    super(props)

    const state = {};
    // set the state to the profile params.  Dont use the profile object
    // as it may need to be reset on cancelation and could be used elsewhere
    for (let x in props.profile) {
      if (props.profile.hasOwnProperty(x)) {
        state[x] = props.profile[x] || undefined;
      }
    }

    this.state = state;
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleDayChange = (day) => {
    this.setState({ dob: new Date(day).toLocaleDateString() });
  }

  handleGenderChange = (gender) => {
    this.setState({ gender });
  }

  onStateSelect = (event) => {
    this.setState({ state: event.target.value });
  }

  submitProfile = () => {
    let profile = this.state;
    let fullName = this.state.first_name + ' ';

    if (this.state.middle_name !== undefined) {
      fullName += this.state.middle_name + ' ';
    }

    fullName += this.state.last_name;
    profile.name = fullName;

    this.props.saveProfile(profile);
    this.props.cancel();
  }

  deleteProfile() {
    confirmAlert({
      title: 'Confirm Profile Delete',
      message: 'Are you sure you want to delete this profile?',
      buttons: [
        { label: 'Yes', onClick: () => this.props.deleteProfile(this.state.id) },
        { label: 'No', onClick: () => {} }
      ]
    });
  }

  renderStateSelect() {
    return (
      <Input
       type='select'
       id='state'
       name='state'
       onChange={this.onStateSelect}
       value={this.state.state}
     >
       {states.map((state, i) => {
         return (
           <option key={state.name} value={state.abbreviation}>
             {state.name}
           </option>
         );
       })}
     </Input>
    )
  }

  render() {
    return (
      <div className='profile-form-container'>
        <div className='profile-form-first-row'>
          <div className='profile-form-first-name'>
            <Input
              name='first_name'
              type='text'
              placeholder='First Name'
              value={this.state.first_name}
              onChange={this.handleChange} />
          </div>

          <div className='profile-form-middle-initial'>
              <Input
                name='middle_name'
                type='text'
                placeholder='Middle Initial'
                value={this.state.middle_name}
                onChange={this.handleChange} />
          </div>

          <div className='profile-form-last-name'>
              <Input
                name='last_name'
                type='text'
                placeholder='Last Name'
                value={this.state.last_name}
                onChange={this.handleChange} />
          </div>
        </div>

        <div className='profile-form-second-row'>
          <div className='profile-form-birthday'>
            <div>Birthday:</div>

            <DayPickerInput onDayChange={this.handleDayChange} placeholder={this.state.dob} />
          </div>

          <div className='profile-form-gender'>
              <div>Gender:</div>

              <RadioGroup name='gender' selectedValue={this.state.gender} onChange={this.handleGenderChange}>
                <Radio value='Male' />Male
                <Radio value='Female' />Female
                <Radio value='Other' />Other
              </RadioGroup>
          </div>
        </div>

        <div className='profile-form-third-row'>
          <div className='profile-form-street-address'>
            <Input
              name='street'
              type='text'
              placeholder='Street Address'
              value={this.state.street}
              onChange={this.handleChange} />
          </div>

          <div className='profile-form-city'>
            <Input
              name='city'
              type='text'
              placeholder='City'
              value={this.state.city}
              onChange={this.handleChange} />
          </div>

          <div className='profile-form-state'>
            {this.renderStateSelect()}
          </div>

          <div className='profile-form-zip-code'>
            <Input
              type='text'
              name='zip'
              placeholder='Zip Code'
              value={this.state.zip}
              onChange={this.handleChange} />
          </div>
        </div>

        <div className='profile-form-fourth-row'>
          <div className='profile-form-phone-number'>
            <Input type='text' placeholder='Phone' />
          </div>

          <div className='profile-form-phone-type'>
            <Input type='select' placeholder='Type'>
              <option>Home</option>
              <option>Cell</option>
              <option>Work</option>
            </Input>
          </div>
        </div>

        <div className='profile-form-btns'>
          <Button
            color='default'
            className='btn-block wide-text profile-form-cancel-btn'
            size='sm'
            onClick={this.props.cancel}>
            CANCEL
          </Button>

          <Button
            color='primary'
            className='btn-block wide-text profile-form-save-btn'
            size='lg'
            onClick={() => this.submitProfile()}>
            SAVE
          </Button>

          <Button
            color='danger'
            className='btn-block wide-text profile-form-save-btn'
            size='lg'
            onClick={() => this.deleteProfile()}>
            Delete
          </Button>
        </div>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  saveProfile: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired
}
