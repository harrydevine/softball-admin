import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  DatePicker,
  Form,
  FormGroup,
  Popover,
  TextInput,
  Modal,
  ModalVariant,
  TimePicker
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminBoardMeetingModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      mtgDate: "",
      mtgTime: "",
      alerts: []
    }

    this.dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/\//g,'-');
    this.dateParse = date => {
      return date;
    };
  
    this.addAlert = (title, variant, key) => {
      this.setState({
        alerts: [ ...this.state.alerts, {title: title, variant: variant, key }]
      });
    };

    this.removeAlert = key => {
      this.setState({ alerts: [...this.state.alerts.filter(el => el.key !== key)]});
    };

    this.getUniqueId = () => (new Date().getTime());

    this.addSuccessAlert = () => { 
      this.addAlert('Board Meeting Added successfully', 'success', this.getUniqueId());
    };
      
    this.addFailureAlert = () => { 
      this.addAlert('Board Meeting Added unsuccessfully', 'danger', this.getUniqueId()) 
    };

    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };
  
    this.handleMeetingAdd = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
      console.log(this.state.mtgDate, " ", this.state.mtgTime);      

      /* Add Meeting to database...*/
      addMeetingToDatabase('http://192.168.1.21:8081/boardmtg', { date: this.state.mtgDate, time: this.state.mtgTime })
      .then(data => {
        if (data.message === "Board Meeting created successfully") {
          this.props.setMeetingAdded(true);
          this.addSuccessAlert();
        }
        else {
          this.props.setMeetingAdded(false);
          this.addFailureAlert();
        }
      });
      
      /* Reset dialog fields for next time */
      this.setState({ mtgDate: "" });
      this.setState({ mtgTime: "" });
    };
  
    this.handleMeetingCancel = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
        
      /* Reset dialog fields for next time */
      this.setState({ mtgDate: "" });
      this.setState({ mtgTime: "" });
    };
  
    async function addMeetingToDatabase (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      });
      return response.json();
    };

    this.onDateChange = (str, date) => {
      console.log('str', str, 'date', date);
      this.setState({ mtgDate: str });
    }
  
    this.onTimeChange = (time, hour, minute, seconds, isValid) => {
      console.log('time', time);
      this.setState({ mtgTime: time});
    }
  
  };    

  render() {
    const { isModalOpen, mtgDate, mtgTime } = this.state;
    
    return (
      <React.Fragment>
        <AlertGroup isToast isLiveRegion>
          {this.state.alerts.map(({key, variant, title}) => (
            <Alert
              variant={AlertVariant[variant]}
              title={title}
              timeout={5000}
              actionClose={
                <AlertActionCloseButton
                  title={title}
                  variantLabel={`variant} alert`}
                  onClose={() => this.removeAlert(key)}
                />
              }
              key={key} />
          ))}
        </AlertGroup>
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Board Meeting</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add new Board Meeting"
          description="Adds a new Board Meeting"
          isOpen={isModalOpen}
          onClose={this.handleMeetingAdd}
          actions={[
            <Button key="addMeeting" variant="primary" form="add-mtg-form" onClick={this.handleMeetingAdd}>
              Add Meeting
            </Button>,
            <Button key="cancelMeetingAdd" variant="link" onClick={this.handleMeetingCancel}>
              Cancel
            </Button>
          ]}
        >
        <Form id="add-mtg-form">
          <FormGroup
            label="Date"
              labelIcon={
              <Popover
                headerContent={
                 <div>The date of the meeting</div>
                }
                bodyContent={
                  <div>Select meeting date</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for date field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-mtg-date"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-mtg-date">
              <DatePicker
                value={"January 01, 2022"}
                placeholder="MM-DD-YYYY"
                dateFormat={this.dateFormat}
                dateParse={this.dateParse}
                onChange={this.onDateChange}
              />
          </FormGroup>
          <FormGroup
            label="Time"
            labelIcon={
            <Popover
               headerContent={
                 <div>Meeting Start Time</div>
               }
               bodyContent={
                 <div>Select meeting start time</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the time field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-mtg-time"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-mtg-time">
              <TimePicker
                time="4:00 PM"
                placeholder="hh:mm"
                onChange={this.onTimeChange}
                menuAppendTo={() => document.body}
              />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminBoardMeetingModal;
