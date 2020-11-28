import { render, screen, act } from '@testing-library/react';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import App from '../App';
import User from '../entities/user';
import Course from '../entities/course';

fetchMock.enableMocks();

const teacher = new User(1, "TEACHER", "Giacomo", "Poretti", "giacomo.poretti@agg.it", "giacomo");
const courses = [
    new Course(1, "Software Engineering 2", 2020),
    new Course(2, "Information Systems Security", 2020)
];

beforeEach(() => {
    fetch.resetMocks();
});

describe('TeacherRoute suite', () => {
    test('render of TeacherPage/main (courses API: json parsing error)', () => {

    });
    test('render of TeacherPage/main (courses API: error)', () => {

    })
    test('render of TeacherPage/main (courses API: error parsing error)', () => {

    })
    test('render of TeacherPage/main (courses API: connection error)', () => {

    })
});

/**
 * const history = createMemoryHistory()
        render(
            <Router history={history}>
                <App />
            </Router>
        );
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
 */