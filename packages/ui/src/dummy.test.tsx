import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dummy } from './Dummy';

describe('Dummy component', () => {
  it('renders hello message', () => {
    render(<Dummy />);
    expect(screen.getByText('Hello UI')).toBeInTheDocument();
  });
});
