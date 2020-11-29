import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import User from '../entities/user'
import userEvent from '@testing-library/user-event';
import fetchMock from "jest-fetch-mock";
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import moment from 'moment';
fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

async function setupApp() {
    const history = createMemoryHistory()
    render(
        <Router history={history}>
            <App />
        </Router>
    );
}
const student = new User(1, "STUDENT", "Lorenzo", "Ceccarelli", "fr@email.com", "ciao");
const teacher = new User(2, "TEACHER", "Lorenzo", "Appendini", "lr@email.com", "ciao");
const courses = [
    new Course(1, "Software Engineering 2", 2020),
    new Course(2, "Information Systems Security", 2020)
];

const lecturesCourse1 = [
    new Lecture(1, 1, 1, moment().add("1", "hours").toISOString(), 600000, moment().subtract("1", "days").toISOString(), "inPresence"),
    new Lecture(4, 1, 2, moment().add("1", "months").toISOString(), 600000, "11-23-2020 19:19", "remote")
]
const lecturesCourse2 = [
    new Lecture(2, 2, 1, moment().add("3", "hours").toISOString(), 600000, moment().add("5", "minutes").toISOString(), "inPresence"),
]
const bookedLesson = new Lecture(3, 3, 1, moment().add("3", "hours").toISOString(), 60000, moment().add("1", "hours").toISOString(), "inPresence")

const booked = [
    bookedLesson
];

describe('App suite', () => {
    test('render App component (into login page)', async () => {
        await setupApp()
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    });
    test('redirect to teacher page (courses API : success)', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
            [JSON.stringify(courses), { status: 200 }]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })
        expect(screen.getByText("Your Lessons")).toBeInTheDocument()
    })
    test('redirect to teacher page (courses API : error parsing error)', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
            [{}, { status: 400 }]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })
        expect(screen.getByText("Course : server error")).toBeInTheDocument()
    })
    test('redirect to teacher page (courses API : error)', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
            [JSON.stringify({ body: "not ok" }), { status: 400 }]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })
        expect(screen.getByText("Course : invalid parameter error")).toBeInTheDocument()
    })
    test('redirect to teacher page (courses API : json parsing error)', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
            [{}, { status: 200 }]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })
        expect(screen.getByText("Course : application parse error")).toBeInTheDocument()
    })
    test('redirect to teacher page server (courses API : server connection error)', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        fetch.mockResponses(
            [JSON.stringify(teacher), { status: 200 }],
        ).mockReject()
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })
        expect(screen.getByText("Course : server error")).toBeInTheDocument()
    })
    test('redirect to student page success', async () => {
        await setupApp()
        await act(async () => {
            userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
            userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
        });
        let allCourses = JSON.stringify(courses);
        let bookedLectures = JSON.stringify(booked);
        let allLecturesCourse1 = JSON.stringify(lecturesCourse1);
        let allLecturesCourse2 = JSON.stringify(lecturesCourse2);
        fetch.mockResponses(
            [JSON.stringify(student), { status: 200 }],
            [allCourses],
            [bookedLectures],
            [allLecturesCourse1],
            [allLecturesCourse2]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })

        expect(screen.getByText("Home")).toBeInTheDocument()
    })
});
