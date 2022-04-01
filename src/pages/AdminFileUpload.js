import React from 'react';
import { FileUpload, Card, CardTitle, CardBody } from '@patternfly/react-core';

class AdminFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: null, filename: '' };
    this.handleFileInputChange = (event, file) => {
      this.setState({ filename: file.name });
    };
    this.handleClear = event => this.setState({ filename: '', value: '' });
  }

  render() {
    const { value, filename } = this.state;
    return (
      <Card key="file-upload">
        <CardTitle>EHT Softball - File Upload </CardTitle>
          <CardBody>
          <FileUpload
            id="simple-file"
            value={value}
            filename={filename}
            filenamePlaceholder="Drag and drop a file or upload one"
            browseButtonText="Upload"
            onFileInputChange={this.handleFileInputChange}
            onClearClick={this.handleClear}
          />
        </CardBody>
      </Card>
    );
  }
}

export default AdminFileUpload;
