import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeacherPage from '../pages/TeacherPage';
import User from '../entities/user';

const teacher = new User(1,"TEACHER","Giacomo","Poretti","giacomo.poretti@agg.it","giacomo");


describe('Teacher Page suite', () => {
    test('render TeacherPage component', () => {
      render(<TeacherPage user={teacher}/>);
    });
  });
