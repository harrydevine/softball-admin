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
  TextArea,
  TextInput,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

class AdminLatestNewsModal extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        title: "",
        body: "",
        image: "",
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
        this.addAlert('Latest News created successfully', 'success', this.getUniqueId());
      };
      
      this.addFailureAlert = () => { 
        this.addAlert('Latest News NOT Added successfully', 'danger', this.getUniqueId()) 
      };

    this.handleModalToggle = () => {
      this.setState(({ isModalOpen}) => ({
        isModalOpen: !isModalOpen
      }));
    };

    this.handleNewsAdd = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
      }));
      /* Add Latest News to database...*/
      addLatestNewsToDatabase('http://192.168.1.21:8081/news', { title: this.state.title, body: this.state.body, image: this.state.image })
      .then(data => {
        if (data.message === "'Error in creating Latest News info") {
          this.addFailureAlert();
        }
        else {
          this.props.setNewsAdded(true);
          this.addSuccessAlert();
        }
      });
    
      /* Reset dialog fields for next time */
      this.setState({ title: "" });
      this.setState({ body: "" });
      this.setState({ image: "" });
    };

    this.handleNewsCancel = () => {
      this.setState(({ isModalOpen}) => ({
          isModalOpen: !isModalOpen
        }));
      
      /* Reset dialog fields for next time */
      this.setState({ title: "" });
      this.setState({ body: "" });
      this.setState({ image: "" });
    };

    this.onTitleChange = newValue => {
        this.setState(({ title: newValue }));
    };

    this.onBodyChange = newValue => {
        this.setState(({ body: newValue }));
      };

    this.onImageChange = newValue => {
      this.setState(({ image: newValue }));
    };
    
    async function addLatestNewsToDatabase (url = '', data = {}) {
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
            
  }

  render() {
    const { isModalOpen, title, body, image, alerts } = this.state;
    
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
        <Button variant="primary" onClick={this.handleModalToggle}>Add Latest News Item</Button>{'  '}
        <Modal
          variant={ModalVariant.medium}
          title="Add Latest News Item"
          description="Adds a news item to the EHT Softball League"
          isOpen={isModalOpen}
          onClose={this.handleNewsAdd}
          actions={[
            <Button key="addNews" variant="primary" form="add-news-form" onClick={this.handleNewsAdd}>
              Add News Item
            </Button>,
             <Button key="cancelAddNews" variant="link" onClick={this.handleNewsCancel}>
              Cancel
            </Button>
          ]}
        >
        <Form id="add-news-form">
          <FormGroup
            label="Title"
              labelIcon={
              <Popover
                headerContent={
                 <div>The title for this news item</div>
                }
                bodyContent={
                  <div>Short title of this news item</div>
                }   
              > 
              <button
                type="button"
                aria-label="More info for title field"
                onClick={e => e.preventDefault()}
                aria-describedby="add-news-title-modal"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
              </Popover>
              }
              isRequired
              fieldId="add-news-title-modal">
              <TextInput
                isRequired
                type="text"
                id="add-news-title"
                name="add-news-title"
                value={this.title}
                onChange={this.onTitleChange}
              />
          </FormGroup>
          <FormGroup
            label="Body"
            labelIcon={
            <Popover
               headerContent={
                 <div>Body of this news item</div>
               }
               bodyContent={
                 <div>Enter the news item here</div>
               }
            >
            <button
              type="button"
              aria-label="More info for the body field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-news-body"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
            </Popover>
            }
            fieldId="add-news-body">
              <TextArea
                value={this.body}
                onChange={this.onBodyChange}
                aria-label="add-news-body"
              />
          </FormGroup>
          <FormGroup
            label="Image URL"
            labelIcon={
            <Popover
              headerContent={
                <div>URL of any image associated with this news item</div>
              }
              bodyContent={
                <div>Enter the URL of an image associated with this news item, if necessary</div>
              }
            >
            <button
              type="button"
              aria-label="More info for image URL field"
              onClick={e => e.preventDefault()}
              aria-describedby="add-news-image"
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
              id="add-news-image-text"
              name="add-news-image-text"
              value={this.image}
              onChange={this.onImageChange}
            />
          </FormGroup>
        </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminLatestNewsModal;
