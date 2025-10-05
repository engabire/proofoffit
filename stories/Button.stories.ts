import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../packages/ui/src/components/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Click me' },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, loadingText: 'Loading…' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const CTA: Story = { args: { variant: 'cta', children: 'Get Started' } };
