import { render,screen,act } from '@testing-library/react';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import TeacherPage from '../pages/TeacherPage';
import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';

fetchMock.enableMocks();

const teacher = new User(1,"TEACHER","Giacomo","Poretti","giacomo.poretti@agg.it","giacomo");
const courses = [
  new Course(1,"Software Engineering 2",2020),
  new Course(2,"Information Systems Security",2020)
];
const lectures = [
  new Lecture(1,1,1,"2020-11-22T07:30:00.000Z"),
  new Lecture(2,1,1,"2020-11-22T07:30:00.000Z")
];
const students =[
  new Student(1,"Francesco", "Rossi","fr@email.com","ciao1"),
  new Student(2,"Monica","Gialli","mg@email.com","ciao2")
];

beforeEach(() => {
  fetch.resetMocks();
});

describe('Teacher Page suite', () => {
    test('render TeacherPage component (courses API : success)', async() => {
      let res=JSON.stringify(courses); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      let items = screen.getAllByTestId('course-row');
      expect(items).toHaveLength(2); //two courses
    });
    
    test('render TeacherPage component (courses API : json parsing error)', async() => {
      let res=JSON.stringify(); //response > response.ok > catch
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('render TeacherPage component (courses API : error)', async() => {
      //response > !response.ok > then
      fetch.mockResponseOnce(JSON.stringify([{
          source: "TeacherService",
          errno: 1,
          error: "'teacherId' parameter is not an integer: fail",
          statusCode: 400
        }]),{status: 400});
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('render TeacherPage component (courses API : error parsing error)', async() => {
      //response > !response.ok > catch
      fetch.mockResponseOnce(JSON.stringify(),{status: 400});
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });
    
    test('render TeacherPage component (courses API : server connection error)', async() => {
      fetch.mockRejectOnce(); //!response
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });
    
    test('testing interaction CoursePanel-LecturePanel (lectures API : success)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
      const items = screen.getAllByTestId('lecture-row'); 
      expect(items).toHaveLength(2); //two lectures
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('no lectures available.')).toBeInTheDocument();
    });

    test('testing interaction CoursePanel-LecturePanel (lectures API : json parsing error)', async() =>{
      let res=JSON.stringify(courses); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(); //response > response.ok > catch
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction CoursePanel-LecturePanel (lectures API : error)', async() =>{
      let res=JSON.stringify(courses); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      //response > !response.ok > then
      fetch.mockResponseOnce(JSON.stringify([{
        source: "TeacherService",
        errno: 1,
        error: "'teacherId' parameter is not an integer: fail",
        statusCode: 400
      }]),{status: 400});
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction CoursePanel-LecturePanel (lectures API : error parsing error)', async() =>{
      let res=JSON.stringify(courses); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      fetch.mockResponseOnce(JSON.stringify(),{status: 400}); //response > !response.ok > catch
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction CoursePanel-LecturePanel (lectures API : server connection error)', async() => {
      let res=JSON.stringify(courses); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      fetch.mockRejectOnce(); //!response 
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });
    
    test('testing interaction between LecturePanel-StudentPanel (students API : success)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      res=JSON.stringify(students); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
      expect(screen.getByText('Number of students: 2')).toBeInTheDocument();
      const items = screen.getAllByTestId('student-row');
      expect(items).toHaveLength(2); //two students
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('no students listed.')).toBeInTheDocument();
    });

    test('testing interaction between LecturePanel-StudentPanel (students API : json parsing error)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      res=JSON.stringify(); //response > response.ok > catch
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction between LecturePanel-StudentPanel (students API : error)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      //response > !response.ok > then
      fetch.mockResponseOnce(JSON.stringify([{
        source: "TeacherService",
        errno: 1,
        error: "'teacherId' parameter is not an integer: fail",
        statusCode: 400
      }]),{status: 400});
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction between LecturePanel-StudentPanel (students API : error parsing error)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      fetch.mockResponseOnce(JSON.stringify(),{status: 400}); //response > !response.ok > catch
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });

    test('testing interaction between LecturePanel-StudentPanel (students API : server connection error)', async() =>{
      let res=JSON.stringify(courses);  //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async () =>{
        render(<TeacherPage user={teacher}/>);
      });
      res=JSON.stringify(lectures); //response > response.ok > then
      fetch.mockResponseOnce(res);
      await act(async ()=> {
        userEvent.click(screen.getByTestId('c-1'))
      });
      fetch.mockRejectOnce(); //!response
      await act(async ()=> {
        userEvent.click(screen.getByTestId('l-1'))
      });
      expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
      expect(screen.getByText('Error during server communication')).toBeInTheDocument();
    });
  });
