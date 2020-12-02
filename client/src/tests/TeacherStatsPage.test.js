import React from 'react';
import { render, screen, act } from '@testing-library/react';
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
    numBookings: 2
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
    numBookings: 6
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
    numBookings: 3
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
    );
    await act(async () => {
        userEvent.click(screen.getByText("Login"))
    });
}

describe('TeacherStats suite', () => {
    test('redirect to TeacherStatsPage (all API success) then click on a lesson', async () => {
        await setupTeacherStats();
        fetch.mockResponses(
            [JSON.stringify(lectures1), { status: 200 }],
            [JSON.stringify(lectures2), { status: 200 }],
        );
        await act(async () => {
            userEvent.click(screen.getByText("Your Stats"));
        });
        await act(async () => {
            userEvent.click(screen.getAllByText("Software Engineering 2")[0]);
        });
    });

    test('redirect to TeacherStatsPage (course API fails)', async () => {
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
        expect(screen.getByText("No events to display")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getAllByRole("button")[9]);
        });
    });

    test('redirect to TeacherStatsPage (lecture API fails)', async () => {
        await setupTeacherStats();
        fetch.mockResponses(
            [JSON.stringify({}), { status: 400 }],
            [JSON.stringify({}), { status: 400 }],
        );
        await act(async () => {
            userEvent.click(screen.getByText("Your Stats"));
        });
        expect(screen.getByText("No events to display")).toBeInTheDocument();
    });
});
