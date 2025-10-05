import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
