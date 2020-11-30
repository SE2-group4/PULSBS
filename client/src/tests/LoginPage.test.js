import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LoginPage from '../pages/LoginPage'
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});



async function setupLogin() {
  await act(async () => {
    render(<LoginPage />)
  });
}
describe("Login test suite", () => {
  test('Login incorrect credentials', async () => {
    await setupLogin();
    await act(async () => {
      userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
      userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
    });
    fetch.mockResponseOnce(JSON.stringify({ body: "not ok" }), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByText("Login"))
    })
    expect(screen.getByText("Login : invalid username and/or password")).toBeInTheDocument()
    await act(async () => {
      userEvent.click(screen.getAllByRole('button')[1]);
    });
  })
  test('Login server fails', async () => {
    await setupLogin();
    await act(async () => {
      userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
      userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
    });
    fetch.mockResponseOnce({}, { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByText("Login"))
    })
    expect(screen.getByText("Login : server error")).toBeInTheDocument()
  })
  test('Login communication error', async () => {
    await setupLogin();
    await act(async () => {
      userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
      userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
    });
    fetch.mockReject();
    await act(async () => {
      userEvent.click(screen.getByText("Login"))
    })
    expect(screen.getByText("Login : server error")).toBeInTheDocument()
  })

})