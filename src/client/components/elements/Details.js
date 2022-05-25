import React from 'react';

class Details extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      isOpen: false
    };
  }

  onClick() {
    const toggle = !this.state.isOpen;
    this.setState({isOpen: toggle});
  }

  render() {
    const { summary, details } = this.props;
    return(
      <details>
        <summary onClick={() => this.onClick()} className="govuk-details__summary">{summary}</summary>
        <div className={`govuk-details__text ${this.state.isOpen ? 'open' : ''}`}>
          {details}
        </div>
      </details>
    );
  }
}

export default Details;