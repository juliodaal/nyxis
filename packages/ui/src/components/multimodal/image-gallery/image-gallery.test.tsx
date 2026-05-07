import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImageGallery } from './image-gallery.js';
import type { MediaAttachment } from '../../../ai/types.js';

const images: MediaAttachment[] = [
  { id: 'i1', kind: 'image', url: 'https://example.test/1.png', alt: 'first', name: 'First' },
  { id: 'i2', kind: 'image', url: 'https://example.test/2.png', alt: 'second', name: 'Second' },
  { id: 'i3', kind: 'image', url: 'https://example.test/3.png', alt: 'third', name: 'Third' },
];

describe('ImageGallery', () => {
  it('renders all thumbnails with alt text', () => {
    render(<ImageGallery images={images} />);
    expect(screen.getByAltText('first')).toBeInTheDocument();
    expect(screen.getByAltText('second')).toBeInTheDocument();
    expect(screen.getByAltText('third')).toBeInTheDocument();
  });

  it('opens the lightbox modal on thumbnail click', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByRole('button', { name: /first/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Caption "1 / 3".
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('closes lightbox on Escape key', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByRole('button', { name: /first/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates with arrow keys', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByRole('button', { name: /first/i }));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('applies the columns class for the chosen column count', () => {
    const { container, rerender } = render(<ImageGallery images={images} columns={4} />);
    expect(container.querySelector('.sm\\:grid-cols-4')).not.toBeNull();
    rerender(<ImageGallery images={images} columns={2} />);
    expect(container.querySelector('.sm\\:grid-cols-2')).not.toBeNull();
  });
});
