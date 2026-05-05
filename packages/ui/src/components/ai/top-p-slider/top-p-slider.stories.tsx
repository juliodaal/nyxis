import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TopPSlider } from './top-p-slider.js';

const meta = {
  title: 'AI · Models & Providers/TopPSlider',
  component: TopPSlider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TopPSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(1);
    return (
      <div className="w-[360px]">
        <TopPSlider value={v} onValueChange={setV} />
      </div>
    );
  },
};
