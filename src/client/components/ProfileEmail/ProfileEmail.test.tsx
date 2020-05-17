import * as React from 'react';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
// import axiosMock from 'axios';
import axios from 'axios';

import ProfileEmail from './ProfileEmail';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('<ProfileEmail /> Component', () => {
  it('renders ProfileEmail component', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Your email has been successfully updated!' } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'pa@pa.lt' }] } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/Email:.../i).textContent).toBe('Email:...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^Email/));
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'pa@pa.lt' } });
    expect(input.value).toBe('pa@pa.lt');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('Your email has been successfully updated!'));
    expect(message.textContent).toBe('Your email has been successfully updated!');
    expect(resolvedEmail.textContent).toBe('Email:pa@pa.lt');
  });

  it('shows message when email update unsuccessful', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'This e-mail is already in use! Try again!' } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/Email:.../i).textContent).toBe('Email:...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^Email/));
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@test.lt' } });
    expect((input).value).toBe('test@test.lt');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('This e-mail is already in use! Try again!'));
    expect(message.textContent).toBe('This e-mail is already in use! Try again!');
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');
  });
});
