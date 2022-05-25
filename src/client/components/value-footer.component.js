import React from 'react';

function ValueFooter(props) {
  let containerStyle = {
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
    clear: 'both'
  };
  let {className, label, value} = props;
  return (
    <div style={containerStyle}>
      <div className={className}>{value}&nbsp;{label}</div>
    </div>
  );
}
export default ValueFooter;
