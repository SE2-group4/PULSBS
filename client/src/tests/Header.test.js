import { render,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from '../components/Header';
import User from '../entities/user';

const student = new User(1,'STUDENT','Aldo','Baglio','aldo.baglio@agg.it','aldo');
const teacher = new User(4,'TEACHER','Giacomo','Poretti','giacomo.poretti@agg.it','giacomo');

describe('Header suite', () => {
    test('render Header component', () => {
        render(<Header />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('testing student Header',() => {
        render(<Header isAuth={true} user={student}/>);
        expect(screen.getByText("Lesson Booking")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test('testing teacher Header',() => {
        render(<Header isAuth={true} user={teacher}/>);
        expect(screen.getByText("Your Lessons")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });
});
