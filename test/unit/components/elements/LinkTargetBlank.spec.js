
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkTargetBlank from '../../../../src/client/components/elements/LinkTargetBlank';



describe('LinkTargetBlank', () => {

  const props = {
    href: 'anotherlink.co.uk',
    ariaLabel: 'This will open another link',
    text: 'Text',
    className: 'beautifulLink'
  };

  it('should render the LinkTargetBlank', () => {
    const {container} = render(<LinkTargetBlank {...props} />);
    expect(container).toBeDefined();
  });

  it('should contains the properties passed as props', () => {
    render(<LinkTargetBlank {...props} />);
    const link = screen.getByRole('link');
    expect(link.text).toBe('Text(opens in new tab)');
    expect(link.href).toBe('http://localhost/anotherlink.co.uk');
  });

  it('should have defined the aria label',() => {
    render(<LinkTargetBlank {...props} />);
    const link = screen.getByLabelText('This will open another link');
    expect(link).toBeDefined();
  });

  it('should check if the target=_blank and rel=noopener noreferrer are present on the component' , () => {
    render(<LinkTargetBlank {...props}/>);
    const link = screen.getByRole('link');
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  });

  it('should accepts optional props - anotherProps', () => {
    render(<LinkTargetBlank {...props}/>);
    const link = screen.getByRole('link');
    expect(link.className).toBe('beautifulLink');
  });

  it('should include visually hidden text', () => {
    render(<LinkTargetBlank {...props}/>);
    const span = screen.getByText('(opens in new tab)');
    expect(span).toBeDefined();
  });
});