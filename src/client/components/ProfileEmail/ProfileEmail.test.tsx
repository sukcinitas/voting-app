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
  it('shows message when email update is successful', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }], success: true } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Your email has been successfully updated!', success: true } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'pa@pa.lt' }], success: true } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/EMAIL:.../i).textContent).toBe('EMAIL:  ...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^EMAIL/));
    expect(resolvedEmail.textContent).toBe('EMAIL:  test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'pa@pa.lt' } });
    expect(input.value).toBe('pa@pa.lt');

    const password = getByTestId('password') as HTMLInputElement;
    fireEvent.change(password, { target: { value: 'password' } });
    expect(password.value).toBe('password');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('Your email has been successfully updated!'));
    expect(message.textContent).toBe('Your email has been successfully updated!');
    expect(resolvedEmail.textContent).toBe('EMAIL:  pa@pa.lt');
  });

  it('shows message when email update unsuccessful', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }], success: true } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'This e-mail is already in use! Try again!', success: false } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }], success: true } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/EMAIL:.../i).textContent).toBe('EMAIL:  ...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^EMAIL/));
    expect(resolvedEmail.textContent).toBe('EMAIL:  test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@test.lt' } });
    expect((input).value).toBe('test@test.lt');

    const password = getByTestId('password') as HTMLInputElement;
    fireEvent.change(password, { target: { value: 'password' } });
    expect(password.value).toBe('password');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('This e-mail is already in use! Try again!'));
    expect(message.textContent).toBe('This e-mail is already in use! Try again!');
    expect(resolvedEmail.textContent).toBe('EMAIL:  test@test.lt');
  });

  it('shows message when password is incorrect', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }], success: true } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Password is incorrect! Try again!', success: false } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }], success: true } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/EMAIL:.../i).textContent).toBe('EMAIL:  ...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^EMAIL/));
    expect(resolvedEmail.textContent).toBe('EMAIL:  test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'pa@pa.lt' } });
    expect(input.value).toBe('pa@pa.lt');

    const password = getByTestId('password') as HTMLInputElement;
    fireEvent.change(password, { target: { value: 'passwo' } });
    expect(password.value).toBe('passwo');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('Password is incorrect! Try again!'));
    expect(message.textContent).toBe('Password is incorrect! Try again!');
    expect(resolvedEmail.textContent).toBe('EMAIL:  test@test.lt');
  });
});
