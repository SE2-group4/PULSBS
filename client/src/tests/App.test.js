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
import Class from '../entities/class'
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

async function setupTeacher() {
    await setupApp()
    await act(async () => {
        userEvent.paste(screen.getByTestId("emailForm"), "fff@ddd.com")
        userEvent.paste(screen.getByTestId("passwordForm"), "fffff")
    });
    fetch.mockResponseOnce(JSON.stringify(teacher), { status: 200 });
    await act(async () => {
        userEvent.click(screen.getByText("Login"))
    })
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
    new Lecture(3, 2, 4, moment().add("1", "hours").toISOString(), 600000, moment().subtract("1", "days").toISOString(), "inPresence")
]
const bookedLesson = new Lecture(3, 3, 1, moment().add("3", "hours").toISOString(), 60000, moment().add("1", "hours").toISOString(), "inPresence")

const booked = [
    bookedLesson
];
const waited = [
    lecturesCourse2[1]
]
const classes = [
    new Class(1, "1", 10),
    new Class(2, "2", 20)
]
describe('App suite', () => {
    test('render App component (into login page)', async () => {
        await setupApp()
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    });

    test('testing logout (API success)', async () => {
        await setupTeacher();
        fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
        await act(async () => {
            userEvent.click(screen.getByText("Logout"))
        })
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    })

    test('testing logout (API error)', async () => {
        await setupTeacher();
        fetch.mockResponseOnce(JSON.stringify({}), { status: 400 });
        await act(async () => {
            userEvent.click(screen.getByText("Logout"))
        })
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    })

    test('testing logout (API disconnected)', async () => {
        await setupTeacher();
        fetch.mockReject();
        await act(async () => {
            userEvent.click(screen.getByText("Logout"))
        })
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    })

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
        let bookedAndWaitedLectures = JSON.stringify({ "booked": booked, "waited": waited });
        let allLecturesCourse1 = JSON.stringify(lecturesCourse1.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
        let allLecturesCourse2 = JSON.stringify(lecturesCourse2.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
        fetch.mockResponses(
            [JSON.stringify(student), { status: 200 }],
            [allCourses],
            [bookedAndWaitedLectures],
            [allLecturesCourse1],
            [allLecturesCourse2]
        );
        await act(async () => {
            userEvent.click(screen.getByText("Login"))
        })

        expect(screen.getByText("Home")).toBeInTheDocument()
    })
});
