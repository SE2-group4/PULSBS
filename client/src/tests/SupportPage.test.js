import { render, screen, act } from '@testing-library/react';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';

import User from '../entities/user';
import SupportPage from '../pages/SupportPage';
import App from '../App';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const officer = new User(1, "SUPPORT", "Lollo", "Appendini", "officer1@agg.it", "officer1");

const csv1content = [`Code,Year,Semester,Course,Teacher
XY1211,1,1,Metodi di finanziamento delle imprese,d9000
XY4911,1,1,Chimica,d9001
XY8612,1,2,Informatica,d9002
XY2312,1,2,Fisica I,d9003`];
const csv1 = new File(csv1content, "file1.csv", { type: "text/csv" });

async function setupPage() {
    render(<SupportPage user={officer} />);
    let n = document.body.getElementsByTagName('input').length;
    let i = 0;
    for (; i < n; i++)
        document.body.getElementsByTagName('input')[i].setAttribute("data-testid", "csv" + i);
}

async function setupPageWithRouter() {
    const history = createMemoryHistory()
    render(
        <Router history={history}>
            <App />
        </Router>
    );
    await act(async () => {
        userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
        userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
    });
    fetch.mockResponseOnce(JSON.stringify(officer), { status: 200 });
    await act(async () => {
        userEvent.click(screen.getByText("Login"))
    })
    let n = document.body.getElementsByTagName('input').length;
    let i = 0;
    for (; i < n; i++)
        document.body.getElementsByTagName('input')[i].setAttribute("data-testid", "csv" + i);
}

describe('Support Page suite', () => {
    test('render SupportPage component', async () => {
        await setupPage();
        expect(document.body.getElementsByTagName('input')).toHaveLength(5);
    })

    test('submit button press with no csv loaded', async () => {
        await setupPage();
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        expect(screen.getByText('No file uploaded yet.')).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-close'));
        });
    })

    test('upload of a file .csv into CSVPanel component (beta version)', async () => {
        await setupPageWithRouter();
        let input = screen.getByTestId('csv1');
        await act(async () => {
            userEvent.upload(input, csv1);
        });
        await new Promise((r) => setTimeout(r, 2000));
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        expect(screen.getByText('courses: 4')).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-yes'));
        });
        expect(screen.getByText("Operation successful!")).toBeInTheDocument();
        //redirect
        await act(async () => {
            userEvent.click(screen.getByTestId('success-close'));
        });
    })

});
