import React from 'react';

function TwoColValueHeading(props) {
  let containerStyle = {
    clear: 'both'
  };
  let hStyle = {
    paddingLeft: '0'
  };
  let {className, label, value, units} = props;
  return (
    <div style={containerStyle}>
      <h2 style={hStyle} className={className + ' column-two-thirds'}>{label}</h2>
      <h2 id="prodHeading-totalKg" className={className + ' column-one-third text-right'}>{value}{units}</h2>
    </div>
  );
}
export default TwoColValueHeading;
