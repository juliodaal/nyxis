import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback } from './avatar.js';

describe('Avatar', () => {
  it('renders fallback when no image provided', () => {
    render(
      <Avatar>
        <AvatarFallback>NX</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('NX')).toBeInTheDocument();
  });
});
