import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

describe('Navbar', () => {
  test('mobile menu opens and closes with Escape', async () => {
    render(<Navbar />);
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    // expect tablist (tabs container) to be present
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    // press escape
    await userEvent.keyboard('{Escape}');
    expect(tablist).toBeInTheDocument();
  });
});
