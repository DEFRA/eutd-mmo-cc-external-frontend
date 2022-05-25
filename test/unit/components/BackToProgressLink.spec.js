import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackToProgressLink from '../../../src/client/components/BackToProgressLink';

describe('Back to Progress Link', () => {
  const props = {
    documentNumber: 'GBR-23423-4234234',
    progressUri: '/create-catch-certificate/GBR-23423-4234234/progress',
  };
  const { container } = render(
    <MemoryRouter>
      <BackToProgressLink {...props} />
    </MemoryRouter>
  );

  it('should load and render the component', () => {
    expect(screen.getByText('Back to Your Progress')).toBeDefined();
    expect(container).toBeDefined();
  });

  it('should take a snapshot of the component', () => {
    const { container } = render(
      <MemoryRouter>
        <BackToProgressLink {...props} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
