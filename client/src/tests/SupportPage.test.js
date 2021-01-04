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

const csvcourse = [`Code,Year,Semester,Course,Teacher
1,1,1,1,1
2,2,2,2,2
3,3,3,3,3
4,4,4,4,4`];
const csvstudent = [`Id,Name,Surname,City,OfficialEmail,Birthday,SSN
1,1,1,1,1,1,1
2,2,2,2,2,2,2
3,3,3,3,3,3,3
4,4,4,4,4,4,4`];
const csvprofessor = [`Number,GivenName,Surname,OfficialEmail,SSN
1,1,1,1,1
2,2,2,2,2
3,3,3,3,3
4,4,4,4,4`];
const csvschedule = [`Code,Room,Day,Seats,Time
1,1,1,1,1
2,2,2,2,2
3,3,3,3,3
4,4,4,4,4`];
const csvenrollment = [`Code,Student
1,1
2,2
3,3
4,4`]
const csv0 = new File(csvstudent, "file0.csv", { type: "text/csv" });
const csv1 = new File(csvcourse, "file1.csv", { type: "text/csv" });
const csv2 = new File(csvprofessor, "file2.csv", { type: "text/csv" });
const csv3 = new File(csvschedule, "file3.csv", { type: "text/csv" });
const csv4 = new File(csvenrollment, "file4.csv", { type: "text/csv" });
const badTypeFile = new File([""], "file5.html", { type: "text/plain" });

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

    test('upload of a file with invalid type into CSVPanel component', async () => {
        await setupPage();
        let input = screen.getByTestId('csv1'); //courses
        await act(async () => {
            userEvent.upload(input, badTypeFile);
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        expect(screen.getByText("file5.html is not a valid file (expected type: csv).")).toBeInTheDocument();
    })

    test('upload of a file with invalid format', async () => {
        await setupPage();
        let input = screen.getByTestId('csv1'); //courses
        await act(async () => {
            userEvent.upload(input, csv0);  //students
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        expect(screen.getByText("file0.csv is not in an expected format.")).toBeInTheDocument();
    })

    test('upload of a file .csv into CSVPanel component (API success)', async () => {
        await setupPageWithRouter();
        let input = screen.getByTestId('csv1'); //courses
        await act(async () => {
            userEvent.upload(input, csv1);  //courses
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        expect(screen.getByText('courses: 4')).toBeInTheDocument();
        fetch.mockResponseOnce(JSON.stringify({ body: "ok" }), { status: 201 });
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-yes'));
        });
        expect(screen.getByText("Operation successful!")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('success-close'));
        });
    })

    test('upload of a file .csv into CSVPanel component (API failure : server error)', async () => {
        await setupPage();
        let input = screen.getByTestId('csv0'); //students
        await act(async () => {
            userEvent.upload(input, csv0);  //students
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        fetch.mockResponseOnce(JSON.stringify({ body: "not ok" }), { status: 400 });
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-yes'));
        });
        expect(screen.getByTestId("text-error")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('success-close'));
        });
    })

    test('upload of a file .csv into CSVPanel component (API failure : connection error)', async () => {
        await setupPage();
        let input = screen.getByTestId('csv2'); //teachers 
        await act(async () => {
            userEvent.upload(input, csv2);  //teachers
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        fetch.mockRejectOnce();
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-yes'));
        });
        expect(screen.getByTestId("text-error")).toBeInTheDocument();
    })

    test('upload of remaining CSVPanels (API success + failure)', async () => {
        await setupPage();
        let input = screen.getByTestId('csv3'); //schedules
        await act(async () => {
            userEvent.upload(input, csv3);  //schedules
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        let input1 = screen.getByTestId('csv4'); //enrollments
        await act(async () => {
            userEvent.upload(input1, csv4); //enrollments
        });
        await new Promise((r) => setTimeout(r, 1000)); //waiting for file loading
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        expect(screen.getByText('schedules: 4')).toBeInTheDocument();
        expect(screen.getByText('enrollments: 4')).toBeInTheDocument();
        fetch.mockResponses(
            [JSON.stringify({ body: "ok" }), { status: 200 }],
        ).mockReject();
        await act(async () => {
            userEvent.click(screen.getByTestId('submit-button'));
        });
        await act(async () => {
            userEvent.click(screen.getByTestId('sum-yes'));
        });
        expect(screen.getByTestId("text-error")).toBeInTheDocument();
    })

});
