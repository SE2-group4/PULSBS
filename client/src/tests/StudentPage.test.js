import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import StudentPage from "../pages/StudentPage"
import User from '../entities/user'

const user = new User(1,"Student","Lorenzo","Ceccarelli","fr@email.com","ciao");


describe('Student Page suite', () => {
    test('render StudentPage component', () => {
      render(<StudentPage user={user}/>);
    });
});