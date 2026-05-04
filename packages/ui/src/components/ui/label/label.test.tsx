import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label.js';

describe('Label', () => {
  it('renders with text content', () => {
    render(<Label htmlFor="x">Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
