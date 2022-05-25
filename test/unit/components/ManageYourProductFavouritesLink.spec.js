import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageYourProductFavouritesLink from '../../../src/client/components/ManageYourProductFavouritesLink';

describe('Manage your product favourites', () => {
  const { container } = render(
    <MemoryRouter>
      <ManageYourProductFavouritesLink/>
    </MemoryRouter>
  );

  it('should load and render the component', () => {
    expect(screen.getByText('Manage your product favourites')).toBeDefined();
    expect(container).toBeDefined();
  });

  it('should take a snapshot of the component', () => {
    const { container } = render(
      <MemoryRouter>
        <ManageYourProductFavouritesLink/>
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
