import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import Header from '../components/Header';
import User from '../entities/user';
import { createMemoryHistory } from 'history'

const student = new User(1, 'STUDENT', 'Aldo', 'Baglio', 'aldo.baglio@agg.it', 'aldo');
const teacher = new User(4, 'TEACHER', 'Giacomo', 'Poretti', 'giacomo.poretti@agg.it', 'giacomo');

describe('Header suite', () => {
    test('render Header component', () => {
        const history = createMemoryHistory()
        render(<Router history={history}>
            <Header />
        </Router>);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('testing student Header', () => {
        const history = createMemoryHistory()
        render(<Router history={history}>
            <Header isAuth={true} user={student} />
        </Router>);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test('testing teacher Header', () => {
        const history = createMemoryHistory()
        render(<Router history={history}>
            <Header isAuth={true} user={teacher} />
        </Router>);
        expect(screen.getByText("Your Lessons")).toBeInTheDocument();
        expect(screen.getByText("Your Stats")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });
});
