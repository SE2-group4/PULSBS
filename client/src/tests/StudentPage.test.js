import { render,screen,act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import StudentPage from "../pages/StudentPage"
import User from '../entities/user'
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

const user = new User(1,"Student","Lorenzo","Ceccarelli","fr@email.com","ciao");

const courses = [
  new Course(1,"Web Application 1","2020"),
  new Course(2,"Data Science","2020")
  ]
const lecturesCourse1 = [
  new Lecture(1,1,1,"12-11-2020 12:00",600000,"12-11-2020 11:00","inPresence"),
  new Lecture(2,1,1,"11-21-2020 09:01",600000,"11-20-2020 13:01","inPresence"),
  new Lecture(4,1,2,"11-24-2020 18:18",600000,"11-23-2020 19:19","remote")
  ]
const lecturesCourse2 =[
  new Lecture(3,2,2,"12-12-2020 09:00",600000,"12-11-2020 09:01","remote")
]
const booked =[
  lecturesCourse1[0]
];


describe('Student Page suite', () => {
    test("render StudentPage component (all API called : success)",async ()=>{
      let allCourses=JSON.stringify(courses);
      let bookedLectures = JSON.stringify(booked);
      let allLecturesCourse1 = JSON.stringify(lecturesCourse1);
      let allLecturesCourse2 = JSON.stringify(lecturesCourse2);
      fetch.mockResponses(
        [allCourses],
        [bookedLectures],
        [allLecturesCourse1],
        [allLecturesCourse2]
        )
      await act(async () =>{
        render(<StudentPage  user={user}/>)
      });
      expect(screen.getByText("Legend:")).toBeInTheDocument()
    })
    test("render StudentPage component (getCoursesByStudentId : communication error)",async ()=>{
      let allCourses=JSON.stringify([{
        source : "StudentService",
        errno : 1,
        error : "userID is not an integer",
        statusCode : 400
      }]);
      fetch.mockReject(new Error(""))
      await act(async () =>{
        render(<StudentPage  user={user}/>)
      });
      expect(screen.getByText("Server cannot communicate")).toBeInTheDocument()
    })
});
