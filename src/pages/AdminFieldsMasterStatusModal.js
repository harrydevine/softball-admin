import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  Form,
  FormGroup,
  Popover,
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  TextInput,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminFieldsMasterStatusModal extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        isOpen: false,
        fieldReason: "",
        fieldStatus: "Select a Status",
        alerts: []
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
        this.addAlert('Master Field Update successful', 'success', this.getUniqueId());
      };
      
      this.addFailureAlert = () => { 
        this.addAlert('Master Field Update NOT successful', 'danger', this.getUniqueId()) 
      };

      this.statusDropdownItems = [
        <SelectOption key={0} value="Select a Status" isPlaceholder />,
        <SelectOption key={1} value="Open" />,
        <SelectOption key={2} value="Closed" />
      ];
      
      this.handleModalToggle = () => {
        this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      };

    this.handleFieldUpdate = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
      }));
      /* Update All Fields; use ID of 1, which is ignored, but the MySQL backend route for /fields requires it. */
      updateFieldsMasterStatus('http://192.168.1.21:8081/fields/master/1', { fieldStatus: (this.state.fieldStatus === "Open") ? 1 : 0, fieldReason: this.state.fieldReason })
      .then(data => {
        if (data.message === "Error while updating Master Field Info") {
          this.addFailureAlert();
        }
        else {
          this.props.setLoading(true);
          this.props.fetchFieldInfo();
          this.addSuccessAlert();
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ fieldStatus: "Select a Status" });
      this.setState({ fieldReason: "" });
    };

    this.handleFieldCancel = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      
      /* Reset dialog fields for next time */
      this.setState({ fieldStatus: "Select a Status" });
      this.setState({ fieldReason: "" });
    };

    this.onFieldReasonChange = newValue => {
      this.setState(({ fieldReason: newValue }));
    };

    this.onEscapePress = () => {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen
      }));
    };

    this.onToggle = isOpen => {
      this.setState({ isOpen });
    };
    
    this.onSelect = (event, selection, isPlaceholder) => {
      if (isPlaceholder) {
        this.setState({ fieldStatus: "Select a Status"});
        this.setState({ isOpen: false })
      }
      else {
        this.setState({ fieldStatus: selection});
        this.setState({ isOpen: false })
      }
    };

    async function updateFieldsMasterStatus (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'PUT',
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
            
  }

  render() {
    const { isModalOpen, isOpen, fieldStatus, fieldReason, alerts } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Master Field Update</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Master Field Update"
          description="Open/Close all fields at once for the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleFieldUpdate}
          actions={[
            <Button key="addField" variant="primary" form="add-field-form" onClick={this.handleFieldUpdate}>
              Update
            </Button>,
             <Button key="cancelAddField" variant="link" onClick={this.handleFieldCancel}>
              Cancel
            </Button>
          ]}
          onEscapePress={this.onEscapePress}
        >
        <Form id="update-field-form">
          <FormGroup
            label="Field Status"
            labelIcon={
            <Popover
               headerContent={
                 <div>Current status of this field</div>
               }
               bodyContent={
                 <div>Choose either Open or Closed.</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the Field Status field"
              onClick={e => e.preventDefault()}
              aria-describedby="update-field-status"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="update-field-status">
            <Select
              variant={SelectVariant.single}
              aria-label="Select Field Status"
              onToggle={this.onToggle}
              onSelect={this.onSelect}
              selections={fieldStatus}
              isOpen={isOpen}
              aria-labelledby="select-field-status"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
            >
                { this.statusDropdownItems }
            </Select>
          </FormGroup>
          <FormGroup
            label="Field Reason"
            labelIcon={
            <Popover
              headerContent={
                <div>Reason for current field status</div>
              }
              bodyContent={
                <div>Practice, Maintenance, etc.</div>
              }
            >
            <button
              type="button"
              aria-label="More info for field reason field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-field-reason"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-field-reason">
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-field-reason"
              name="modal-with-form-field-reason"
              value={this.fieldReason}
              onChange={this.onFieldReasonChange}
            />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminFieldsMasterStatusModal;
