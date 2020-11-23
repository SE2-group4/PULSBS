import { render, fireEvent, screen,act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import fetchMock from "jest-fetch-mock";
import Course from "../entities/course"
import User from "../entities/user";
import Lecture from '../entities/lecture';
import BookingLectureForm from "../components/BookingLectureForm";

fetchMock.enableMocks();

const courses = [
    new Course(1,"Software Engineering 2",2020),
    new Course(2,"Information Systems Security",2020)
]
const user = new User(1,"Student","Lorenzo","Ceccarelli","fr@email.com","ciao");
const lecture = new Lecture(1,1,1,"2020");

beforeEach(() => {
  fetch.resetMocks();
});

describe('Booking Lecture Form suite', () => {
    test('render BookingLectureForm component', () => {
      render(<BookingLectureForm courses={courses} user={user}/>);
    });
    test('Courses DropdownMenu display', () => {
        render(<BookingLectureForm courses={courses} user={user}/>);
        expect(screen.getByText('Choose a course')).toBeInTheDocument()
      });
    test('Lectures DropdownMenu display',() => {
        render(<BookingLectureForm courses={courses} user={user}/>);
        expect(screen.getByText('Choose a lecture')).toBeInTheDocument()
      });
    test('Lectures DropdownMenu disabled',() => {
        render(<BookingLectureForm courses={courses} user={user}/>);
        expect(screen.getByText('Choose a lecture')).toBeDisabled()
      });
    test('Courses DropdownItems display', async () => {
        render(<BookingLectureForm courses={courses} user={user}/>);
        await act(async ()=> fireEvent.click(screen.getByText('Choose a course'),0));
        expect(screen.getByText('Software Engineering 2')).toBeInTheDocument();
        expect(screen.getByText('Information Systems Security')).toBeInTheDocument();
      });
    test('Courses DropdownItems click and show in Course List Group', async () => {
        render(<BookingLectureForm courses={courses} user={user}/>);
        fetch.mockResponseOnce(JSON.stringify([]));
        await act(async ()=>fireEvent.click(screen.getByText('Choose a course'),0));
        await act(async ()=> fireEvent.click(screen.getByText('Software Engineering 2'),0));
        expect(screen.getByText("Course : Software Engineering 2")).toBeInTheDocument();
      });
    test('Mock fetch student courses and it fails',async()=>{
      render(<BookingLectureForm courses={courses} user={user}/>);
      fetch.mockReject(() => Promise.reject("API is down"));
      await act(async ()=>fireEvent.click(screen.getByText('Choose a course'),0));
      await act(async ()=> fireEvent.click(screen.getByText('Software Engineering 2'),0));
      expect(screen.getByText("Error during server communication")).toBeInTheDocument();
    });
    test("Mock fetch student courses and it success", async ()=> {
      render(<BookingLectureForm courses={courses} user={user}/>);
      fetch.mockResponseOnce(JSON.stringify({lectures : [lecture]}));
      await act(async ()=>fireEvent.click(screen.getByText('Choose a course'),0));
      await act(async ()=> fireEvent.click(screen.getByText('Software Engineering 2'),0));
    })
  });