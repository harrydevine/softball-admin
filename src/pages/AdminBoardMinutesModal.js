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
  ModalVariant
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminBoardMinutesModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      boardData: "",
      boardMinutes: "",
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
      this.addAlert('Board Minutes Added successfully', 'success', this.getUniqueId());
    };
      
    this.addFailureAlert = () => { 
      this.addAlert('Board Minutes Added unsuccessfully', 'danger', this.getUniqueId()) 
    };

    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };
  
    this.handleMinutesAdd = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
      console.log(this.state.boardDate, " ", this.state.boardMinutes);      

      /* Add Minutes to database...*/
      addMinutesToDatabase('http://192.168.1.21:8081/minutes', { date: this.state.boardDate, minutes: this.state.boardMinutes })
      .then(data => {
        if (data.message === "Board Minutes created successfully") {
          this.props.setMinutesAdded(true);
          this.addSuccessAlert();
        }
        else {
          this.props.setMinutesAdded(false);
          this.addFailureAlert();
        }
      });
      
      /* Reset dialog fields for next time */
      this.setState({ boardDate: "" });
      this.setState({ boardMinutes: "" });
    };
  
    this.handleMinutesCancel = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
        
      /* Reset dialog fields for next time */
      this.setState({ boardDate: "" });
      this.setState({ boardMinutes: "" });
    };
  
    async function addMinutesToDatabase (url = '', data = {}) {
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
      this.setState({ boardDate: str });
    }
  
    this.onMinutesChange = (value) => {
      console.log('minutes', value);
      this.setState({ boardMinutes: value});
    }
  
  };    

  render() {
    const { isModalOpen, boardDate, boardMinutes } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Board Minutes</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add new Board Minutes"
          description="Adds a new Board Minutes"
          isOpen={isModalOpen}
          onClose={this.handleMinutesAdd}
          actions={[
            <Button key="addMinutes" variant="primary" form="add-minutes-form" onClick={this.handleMinutesAdd}>
              Add Minutes
            </Button>,
            <Button key="cancelMinutesAdd" variant="link" onClick={this.handleMinutesCancel}>
              Cancel
            </Button>
          ]}
        >
        <Form id="add-minutes-form">
          <FormGroup
            label="Date"
              labelIcon={
              <Popover
                headerContent={
                 <div>The date of the meeting that these minutes are for</div>
                }
                bodyContent={
                  <div>Select meeting date</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for date field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-minutes-date"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-minutes-date">
              <DatePicker
                value={"January 01, 2022"}
                placeholder="MM-DD-YYYY"
                dateFormat={this.dateFormat}
                dateParse={this.dateParse}
                onChange={this.onDateChange}
              />
          </FormGroup>
          <FormGroup
            label="Link to Meeting Minutes"
            labelIcon={
            <Popover
               headerContent={
                 <div>Meeting Minutes</div>
               }
               bodyContent={
                 <div>Provide link to this meeting's minutes</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the minutes field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-mtg-time"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-minutes-link">
              <TextInput
                isRequired
                type="text"
                id="add-minutes-link"
                name="add-minutes-link"
                value={this.boardMinutes}
                onChange={this.onMinutesChange}
              />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminBoardMinutesModal;
