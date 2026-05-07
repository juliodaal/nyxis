import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VisionInput } from './vision-input.js';

// jsdom doesn't provide URL.createObjectURL; supply stubs.
if (typeof URL.createObjectURL !== 'function') {
  (URL as unknown as { createObjectURL: (f: File) => string }).createObjectURL = () => 'blob:mock';
}
if (typeof URL.revokeObjectURL !== 'function') {
  (URL as unknown as { revokeObjectURL: (u: string) => void }).revokeObjectURL = () => {};
}

const makeFile = (size = 100, type = 'image/png', name = 'photo.png') => {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
};

describe('VisionInput', () => {
  it('renders empty placeholder when no value', () => {
    render(<VisionInput placeholder="Drop your image here" />);
    expect(screen.getByText('Drop your image here')).toBeInTheDocument();
  });

  it('renders the preview when a controlled value is supplied', () => {
    const file = makeFile();
    render(<VisionInput value={file} />);
    const img = screen.getByAltText('photo.png');
    expect(img).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove image/i })).toBeInTheDocument();
  });

  it('clears the file when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = makeFile();
    render(<VisionInput defaultValue={file} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Remove image/i }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows the camera label by default and hides it when acceptCamera={false}', () => {
    const { rerender } = render(<VisionInput />);
    expect(screen.getByText(/Use camera/i)).toBeInTheDocument();
    rerender(<VisionInput acceptCamera={false} />);
    expect(screen.queryByText(/Use camera/i)).not.toBeInTheDocument();
  });

  it('surfaces an oversize file error', async () => {
    const user = userEvent.setup();
    render(<VisionInput maxBytes={50} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    const big = makeFile(200);
    await user.upload(fileInput, big);
    expect(screen.getByText(/File too large/i)).toBeInTheDocument();
  });
});
