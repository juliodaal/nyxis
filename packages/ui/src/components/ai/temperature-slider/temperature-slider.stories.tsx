import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TemperatureSlider } from './temperature-slider.js';

const meta = {
  title: 'AI · Models & Providers/TemperatureSlider',
  component: TemperatureSlider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TemperatureSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(0.7);
    return (
      <div className="w-[360px]">
        <TemperatureSlider value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const ExtendedRange: Story = {
  render: () => {
    const [v, setV] = useState(1.4);
    return (
      <div className="w-[360px]">
        <TemperatureSlider value={v} onValueChange={setV} max={2} />
      </div>
    );
  },
};
