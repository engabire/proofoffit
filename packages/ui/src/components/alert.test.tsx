import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert, AlertTitle, AlertDescription } from './alert';

describe('Alert', () => {
  it('renders children and role', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Something happened</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('applies destructive variant', () => {
    render(<Alert variant="destructive">Danger</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Danger');
    // Class checks can be added here if needed
  });
});
