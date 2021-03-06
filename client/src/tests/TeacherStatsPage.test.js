import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import User from '../entities/user';
import Course from '../entities/course';
import userEvent from '@testing-library/user-event';
import fetchMock from "jest-fetch-mock";
import moment from 'moment';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const teacher = new User(2, "TEACHER", "Lorenzo", "Appendini", "lr@email.com", "ciao");
const courses = [
    new Course(1, "Software Engineering 2", 2020),
    new Course(2, "Information Systems Security", 2020)
];

const lectures1 = [{
    lecture: {
        lectureId: 1,
        courseId: 1,
        classId: 1,
        startingDate: moment().subtract("2", "day").toISOString(),
        duration: 600000,
        bookingDeadline: moment().subtract("1", "day").toISOString(),
        delivery: "PRESENCE",
    },
    bookings: 2,
    attendances: 3
},
{
    lecture: {
        lectureId: 3,
        courseId: 1,
        classId: 4,
        startingDate: moment().subtract("1", "day").toISOString(),
        duration: 600000,
        bookingDeadline: moment().toISOString(),
        delivery: "PRESENCE",
    },
    bookings: 6,
    attendances: 4
}];
const lectures2 = [{
    lecture: {
        lectureId: 2,
        courseId: 2,
        classId: 2,
        startingDate: moment().subtract("1", "day").toISOString(),
        duration: 600000,
        bookingDeadline: moment().toISOString(),
        delivery: "REMOTE",
    },
    bookings: 3,
    attendances: 0
}];

async function setupTeacherStats() {
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
    fetch.mockResponses(
        [JSON.stringify(teacher), { status: 200 }],
        [JSON.stringify(courses), { status: 200 }],
        [JSON.stringify(courses), { status: 200 }]
    );
    await act(async () => {
        userEvent.click(screen.getByText("Login"))
    });
    await act(async () => {
        userEvent.click(screen.getByText("Your Stats"));
    });
}

describe('TeacherStats suite', () => {
    test('redirect to TeacherStatsPage (all API success) then click on a lesson', async () => {
        await setupTeacherStats();
        expect(screen.getByText("Select granularity:")).toBeInTheDocument()
    });

    test('course API fails)', async () => {
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
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
            [JSON.stringify({}), { status: 400 }],
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        });
        await act(async () => {
            userEvent.click(screen.getByText("Your Stats"));
        });
        expect(screen.getByText("Ops,an error occured during server communication")).toBeInTheDocument();

    });
    test('Error fetch lectures', async () => {
        await setupTeacherStats();
        await act(async () => {
            fireEvent.change(screen.getByTestId('courseSelect'), { target: { value: "2" } })
        });
        expect(screen.getByText("Ops,an error occured during server communication")).toBeInTheDocument()
    })
    test('Daily - click on daily button', async () => {
        await setupTeacherStats();
        await act(async () => {
            userEvent.click(screen.getByText("Daily"))
        });
        expect(screen.getByText("From:")).toBeInTheDocument()
    })
    test('Daily - select a course', async () => {
        await setupTeacherStats();
        fetch.mockResponses(
            [JSON.stringify(lectures2), { status: 200 }]
        )
        await act(async () => {
            fireEvent.change(screen.getByTestId('courseSelect'), { target: { value: "2" } })
        });
        expect(screen.getByTestId("Information Systems Security")).toBeInTheDocument()
    })
    test('Daily - change from', async () => {
        await setupTeacherStats();
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('From (day)'), { target: { value: moment().toISOString() } })
        });
        expect(screen.getByText("From:")).toBeInTheDocument()
    })

    test('Daily - change to', async () => {
        await setupTeacherStats();
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('To (day)'), { target: { value: moment().toISOString() } })
        });
        expect(screen.getByText("To:")).toBeInTheDocument()
    })
    test('Weekly - click on weekly button', async () => {
        await setupTeacherStats();
        await act(async () => {
            userEvent.click(screen.getByText("Weekly"))
        });
        expect(screen.getByText("Select weeks:")).toBeInTheDocument()
    })
    test('Weekly - select a course', async () => {
        await setupTeacherStats();
        fetch.mockResponses(
            [JSON.stringify(lectures2), { status: 200 }]
        )
        await act(async () => {
            fireEvent.change(screen.getByTestId('courseSelect'), { target: { value: "2" } })
        });
        expect(screen.getByTestId("Information Systems Security")).toBeInTheDocument()
    })
    test('Weekly - select week(s)', async () => {

    })
    test('Monthly - click on monthly button', async () => {
        await setupTeacherStats();
        await act(async () => {
            userEvent.click(screen.getByText("Monthly"))
        });
        expect(screen.getByText("Select months:")).toBeInTheDocument()
    })

    test('Monthly - select a course', async () => {

    })
    test('Monthly - select month(s)', async () => {

    })
});
