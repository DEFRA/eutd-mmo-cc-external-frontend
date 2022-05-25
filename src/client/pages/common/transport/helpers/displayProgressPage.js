const displayProgressPage = (props) => {
  const { progressUri } = props.route;
  const documentNumber = props.match.params['documentNumber'];

  props.history.push(
    progressUri.replace(':documentNumber', documentNumber)
  );
};

export default displayProgressPage;
