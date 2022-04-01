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

class AdminTournamentsModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      dateStart: "",
      dateEnd: "",
      description: "",
      tourneyImg: "",
      title: "",
      divisions: "",
      details: "",
      registerURL: "",
      alerts: []
    }

    this.dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/\//g,'-');
    this.dateParse = date => {
      return date;
/*      const split = date.split('-');
      if (split.length !== 3) {
        return new Date();
      }
      let month = split[0];
      let day = split[1];
      let year = split[2];
      let newDate = new Date(`${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
      console.log(newDate);
      return newDate;
//      return new Date(`${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
*/
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
      this.addAlert('Tournament Added successfully', 'success', this.getUniqueId());
    };
      
    this.addFailureAlert = () => { 
      this.addAlert('Tournament Added unsuccessfully', 'danger', this.getUniqueId()) 
    };

    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };
  
    this.handleTournamentAdd = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
      console.log(this.state.dateStart, this.state.dateEnd, this.state.description, this.state.tourneyImg, this.state.title, this.state.divisions, this.state.details, this.state.registerURL);      
      
      /* Add Tournament to database...*/
      addTournamentToDatabase('http://192.168.1.21:8081/tournaments', 
        { title: this.state.title, dateStart: this.state.dateStart, dateEnd: this.state.dateEnd, 
          description: this.state.description, tourneyImg: this.state.tourneyImg, divisions: this.state.divisions,
          details: this.state.details, registerURL: this.state.registerURL
        })
      .then(data => {
        if (data.message === "Tournament created successfully") {
          this.props.setTournamentAdded(true);
          this.addSuccessAlert();
        }
        else {
          this.props.setTournamentAdded(false);
          this.addFailureAlert();
        }
      });

      /* Reset dialog fields for next time */
      this.setState({ dateStart: "" });
      this.setState({ dateEnd: "" });
      this.setState({ description: "" });
      this.setState({ tourneyImg: "" });
      this.setState({ title: "" });
      this.setState({ divisions: "" });
      this.setState({ details: "" });
      this.setState({ registerURL: "" });
    };
  
    this.handleTournamentCancel = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
        
      /* Reset dialog fields for next time */
      this.setState({ dateStart: "" });
      this.setState({ dateEnd: "" });
      this.setState({ description: "" });
      this.setState({ tourneyImg: "" });
      this.setState({ title: "" });
      this.setState({ divisions: "" });
      this.setState({ details: "" });
      this.setState({ registerURL: "" });
    };

    async function addTournamentToDatabase (url = '', data = {}) {
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

    this.onStartDateChange = (str, date) => {
      console.log(str, date);
        this.setState({ dateStart: str });
      }
  
    this.onEndDateChange = (str, date) => {
      this.setState({ dateEnd: str });
    }
  
    this.onDescriptionChange = newValue => {
        this.setState({ description: newValue });
      }

    this.onTitleChange = newValue => {
      this.setState({ title: newValue });
    }

    this.onDetailsChange = newValue => {
      this.setState({ details: newValue });
    }
  
    this.onDivisionsChange = newValue => {
      this.setState({ divisions: newValue });
    }

    this.onImageChange = newValue => {
        this.setState({ tourneyImg: newValue });
    }

    this.onURLChange = newValue => {
      this.setState({ registerURL: newValue });
    }
  
  };    

  render() {
    const { isModalOpen, startDate, endDate, description, tourneyImg, title, divisions, details, registerURL } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add New Tournament</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add new Tournament"
          description="Adds a new Tournament"
          isOpen={isModalOpen}
          onClose={this.handleTournamentAdd}
          actions={[
            <Button key="addTournament" variant="primary" form="add-tournament-form" onClick={this.handleTournamentAdd}>
              Add Tournament
            </Button>,
            <Button key="cancelTournamentAdd" variant="link" onClick={this.handleTournamentCancel}>
              Cancel
            </Button>
          ]}
        >
        <Form id="add-tourament-form">
          <FormGroup
            label="Start Date"
              labelIcon={
              <Popover
                headerContent={
                 <div>The start date of the tourament</div>
                }
                bodyContent={
                  <div>Select start date</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for start date field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-mtg-start-date"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-tourament-start-date">
              <DatePicker
                value={"January 01, 2022"}
                placeholder="MM-DD-YYYY"
                dateFormat={this.dateFormat}
                dateParse={this.dateParse}
                onChange={this.onStartDateChange}
              />
          </FormGroup>
          <FormGroup
            label="End Date"
              labelIcon={
              <Popover
                headerContent={
                 <div>The end date of the tourament</div>
                }
                bodyContent={
                  <div>Select end date</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for end date field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-mtg-end-date"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-tourament-end-date">
              <DatePicker
                value={"January 01,2022"}
                placeholder="MM-DD-YYYY"
                dateFormat={this.dateFormat}
                dateParse={this.dateParse}
                onChange={this.onEndDateChange}
              />
          </FormGroup>
          <FormGroup
            label="Title"
            labelIcon={
            <Popover
              headerContent={
                <div>The tourament title</div>
              }
              bodyContent={
                <div>Enter the tourament title</div>
              }
            >
            <button
              type="button"
              aria-label="More info for title field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-title"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-title">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-title"
              name="modal-add-tournament-title"
              value={this.title}
              onChange={this.onTitleChange}
            />
          </FormGroup>
          <FormGroup
            label="Description"
            labelIcon={
            <Popover
              headerContent={
                <div>The tourament description</div>
              }
              bodyContent={
                <div>Enter any description information (who to contact, etc)</div>
              }
            >
            <button
              type="button"
              aria-label="More info for description field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-description"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-description">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-description"
              name="modal-add-tournament-description"
              value={this.description}
              onChange={this.onDescriptionChange}
            />
          </FormGroup>
          <FormGroup
            label="Details"
            labelIcon={
            <Popover
              headerContent={
                <div>The tourament details</div>
              }
              bodyContent={
                <div>Enter the tourament details (i.e price / umpire fees / santioning body)</div>
              }
            >
            <button
              type="button"
              aria-label="More info for details field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-details"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-details">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-details"
              name="modal-add-tournament-details"
              value={this.details}
              onChange={this.onDetailsChange}
            />
          </FormGroup>
          <FormGroup
            label="Divisions"
            labelIcon={
            <Popover
              headerContent={
                <div>The divisions eligible for this tournament</div>
              }
              bodyContent={
                <div>Enter the tourament divisions, usually comma separated (i.e 10BC,12BC)</div>
              }
            >
            <button
              type="button"
              aria-label="More info for divisions field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-divisions"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-divisions">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-divisions"
              name="modal-add-tournament-divisions"
              value={this.divisions}
              onChange={this.onDivisionsChange}
            />
          </FormGroup>
          <FormGroup
            label="Tourament Image"
            labelIcon={
            <Popover
              headerContent={
                <div>The tourament flyer image</div>
              }
              bodyContent={
                <div>Enter the tourament flyer image location (usually "/images/&lt;filename&gt;"); Website coordinator can upload the image file;</div>
              }
            >
            <button
              type="button"
              aria-label="More info for image field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-image"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-image">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-image"
              name="modal-add-tournament-image"
              value={this.tourneyImg}
              onChange={this.onImageChange}
            />
          </FormGroup>
          <FormGroup
            label="Registration URL"
            labelIcon={
            <Popover
              headerContent={
                <div>The tourament registration URL</div>
              }
              bodyContent={
                <div>Enter the tourament registration URL (usually in the form of "http://&lt;URL&gt;")</div>
              }
            >
            <button
              type="button"
              aria-label="More info for registration field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-tournament-registration"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-tournament-registration">
            <TextInput
              isRequired
              type="text"
              id="modal-add-tournament-registration"
              name="modal-add-tournament-registration"
              value={this.registerURL}
              onChange={this.onURLChange}
            />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminTournamentsModal;
