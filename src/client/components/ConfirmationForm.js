import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class ConfirmationForm extends Component {

  state = {
    creatingPdf: false
  };

  constructor(props) {
    super(props);
  }

  async submitForm (e) {
      this.props.disableSubmit();

      try {
        e.preventDefault();
        const {creatingPdf} = this.state;
        if (creatingPdf) {
          return;
        } // debounce button press

        const {currentUri, journey, completeUri, pendingUri, noOfVessels, documentNumber} = this.props;
        this.setState({creatingPdf: true});

        let resp = await this.props.createExportCertificate(currentUri, journey, noOfVessels, documentNumber);
        if (resp === 'ERROR') {
          this.props.history.push(`/create-catch-certificate/${documentNumber}/add-landings`);
        }
        else if (resp && resp.payload && resp.payload.data && resp.payload.data.status === 'catch certificate is LOCKED') {
          this.props.history.push('/create-catch-certificate/catch-certificates');
        }
        else if (resp && resp.payload && resp.payload.validationErrors && resp.payload.validationErrors.length > 0 && (Object.keys(resp.payload.validationErrors[0]).length > 0) ) {
          window.scrollTo(0, 0);
          throw new Error('validation failed when creating an export certificate');
        }
        else if (resp && resp.type && resp.type === 'export-certificate/create/success') {
          if (resp.payload.data.offlineValidation) {
            this.props.history.push(pendingUri);
          }
          else {
            this.props.history.push(completeUri);
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }

      this.setState({ creatingPdf: false });
  }

  render() {
    const { t, journey } = this.props;
    return (
      <div>
        <form onSubmit={this.submitForm.bind(this)}>
          <input type='hidden' name='completeUri' value={this.props.completeUri} />
          <input type='hidden' name='submittedUri' value={this.props.pendingUri} />
          <input type='hidden' name='redirectUri' value={this.props.redirectUri} />
          <input type='hidden' name='journey' value={journey} />
          <button id="continue" className={'button button-start'} type="submit" disabled={this.state.creatingPdf}>{t('commonSummaryPageMainCreateBtn', {journey: t(journey)})}</button>
        </form>
      </div>
    );

  }
}

ConfirmationForm.propTypes = {
  createExportCertificate: PropTypes.func,
  completeUri: PropTypes.string,
  journey: PropTypes.string,
  noOfVessels: PropTypes.number,
  documentNumber: PropTypes.string
};

export default withRouter(withTranslation() (ConfirmationForm));
