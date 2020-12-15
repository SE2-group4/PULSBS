import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import User from '../entities/user';
import userEvent from '@testing-library/user-event';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const manager = new User(1, "MANAGER", "Vincent", "VanGogh", "vv@holland.com", "Credodinonsentirepiùbene");

async function setupLogin() {
    const history = createMemoryHistory()
    render(
        <Router history={history}>
            <App />
        </Router>
    );
    await act(async () => {
        userEvent.paste(screen.getByTestId("emailForm"), "vv@holland.com")
        userEvent.paste(screen.getByTestId("passwordForm"), "Credodinonsentirepiùbene")
    });
    fetch.mockResponses(
        [JSON.stringify(manager), { status: 200 }]
    );
    await act(async () => {
        userEvent.click(screen.getByText("Login"))
    });
    screen.debug()
}


describe("Manager route suite", () => {
    test("Redirect to manager report page after login", async () => {
        await setupLogin();
        await act(async () => {
            userEvent.click(screen.getByText("Generate a tracing report"));
        });
        expect(screen.getByText("Choose a student search method:")).toBeInTheDocument()
    })
    test("Redirect to manager stats page after login", async () => {

    })
})