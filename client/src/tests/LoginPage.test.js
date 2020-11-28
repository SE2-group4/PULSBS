import { render,screen,act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import StudentPage from "../pages/StudentPage"
import TeacherPage from '../pages/TeacherPage'
import LoginPage from '../pages/LoginPage'
import User from '../entities/user'
import fetchMock from "jest-fetch-mock";
import moment from 'moment';
import userEvent from '@testing-library/user-event';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

const user = new User(1,"Student","Lorenzo","Ceccarelli","fr@email.com","ciao");

describe("Login test suite",()=>{
    test('Login success',async()=>{

    })
    test('Login incorrect credentials',async()=>{

    })
    test('Login server fails',async()=>{

    })
    test('Login communication error',async()=>{

    })
    
})