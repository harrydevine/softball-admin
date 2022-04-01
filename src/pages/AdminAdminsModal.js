import React from 'react';
import {
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

class AdminAdminsModal extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        name: "",
        password: ""
      };    
      this.handleModalToggle = () => {
        this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      };
      this.handleAdminAdd = () => {
        this.setState(({ isModalOpen}) => ({
            isModalOpen: !isModalOpen
          }));
        console.log(this.name, " ", this.password);      
        /* Add Board Member to database...*/
//        addBoardMemberToDatabase('http://192.168.1.21:8081/board', { name: boardMemberNameValue, title: boardMemberPositionValue, phone: boardMemberPhoneNumberValue, email: boardMemberEmailValue })
//        .then(data => {
//          console.log(data);
//        });
    
        /* Reset dialog fields for next time */
        this.setState({ name: "" });
        this.setState({ password: "" });
      };
      this.handleAdminCancel = () => {
        console.log("Hit handleAdminCancel....")
        this.setState(({ isModalOpen}) => ({
            isModalOpen: !isModalOpen
          }));
      
        /* Reset dialog fields for next time */
        this.setState({ name: "" });
        this.setState({ password: "" });
      };
    this.onNameChange = newValue => {
        console.log("New value for name: ", newValue)
        this.setState(({ name: newValue }));
    };
    this.onPasswordChange = newValue => {
        console.log("New value for password: ", newValue)
        this.setState(({ password: newValue }));
    };
            
  }

  render() {
    const { isModalOpen } = this.state;
    
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.handleModalToggle}>Add Site Admin</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add Site Admin"
          description="Adds a new Site Admin to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleAdminAdd}
          actions={[
            <Button key="addAdmin" variant="primary" form="add-admin-form" onClick={this.handleAdminAdd}>
              Add Site Admin
            </Button>,
            <Button key="cancelAdminAdd" variant="link" onClick={this.handleAdminCancel}>
              Cancel
            </Button>
          ]}
        >
        <Form id="add-admin-form">
          <FormGroup
            label="Name"
              labelIcon={
              <Popover
                headerContent={
                 <div>The name of the Site Admin</div>
                }
                bodyContent={
                  <div>Enter Site Admin's Name</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for Name field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-admin-modal-name"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-admin-modal-name">
              <TextInput
                isRequired
                type="text"
                id="add-admin-name"
                name="add-admin-name"
                value={this.name}
                onChange={this.onNameChange}
              />
          </FormGroup>
          <FormGroup
            label="Password"
            labelIcon={
            <Popover
               headerContent={
                 <div>Admin User Password</div>
               }
               bodyContent={
                 <div>Enter desired password (entry masked for security purposes)</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the password field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-admin-password"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-admin-password">
              <TextInput
                isRequired
                type="password"
                id="add-admin-password"
                name="add-admin-password"
                value={this.password}
                onChange={this.onPasswordChange}
              />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminAdminsModal;
