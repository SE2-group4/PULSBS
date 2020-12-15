import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import StudentPage from "../pages/StudentPage"
import User from '../entities/user'
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import fetchMock from "jest-fetch-mock";
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import Class from '../entities/class'
import LectureWithClassInfo from '../entities/lectureWithClassInfo';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

const user = new User(1, "Student", "Lorenzo", "Ceccarelli", "fr@email.com", "ciao");
const classes = [
  new Class(1, "1", 10),
  new Class(2, "2", 20)
]
const courses = [
  new Course(1, "Web Application 1", "2020"),
  new Course(2, "Data Science", "2020"),
  new Course(3, "Computer Systems Programming", "2020"),
  new Course(4, "Elettronica", "2020"),
  new Course(5, "OS", "2020"),
  new Course(6, "Cybersecurity", "2020")
]
const lecturesCourse1 = [
  new Lecture(1, 1, 1, moment().add("1", "hours").toISOString(), 600000, moment().subtract("1", "days").toISOString(), "inPresence"),
  new Lecture(4, 1, 2, moment().add("1", "months").toISOString(), 600000, "11-23-2020 19:19", "remote", 10, 25, "12A")
]
const lecturesCourse2 = [
  new Lecture(2, 2, 1, moment().add("3", "hours").toISOString(), 600000, moment().add("5", "minutes").toISOString(), "inPresence"),
]
const bookedLesson = new Lecture(3, 3, 1, moment().add("3", "hours").toISOString(), 60000, moment().add("1", "hours").toISOString(), "inPresence")
const lecturesCourse3 = [
  bookedLesson,
]
const lecturesCourse4 = [
  new Lecture(5, 4, 4, moment().add("1", "hours").toISOString(), 60000, moment().subtract("1", "hours").toISOString(), "inPresence")
]
const lecturesCourse5 = [
  new Lecture(6, 5, 7, moment().add("5", "minutes").toISOString(), 60000, moment().subtract("1", "hours"), "REMOTE")
]
const lecturesCourse6 = [
  new Lecture(7, 6, 7, moment().subtract("1", "hours").toISOString(), 60000, moment().subtract("1", "days"), "inPresence")
]
const booked = [
  bookedLesson
];
const waited = [
  lecturesCourse4[0]
]
async function setupCalendar() {
  let allCourses = JSON.stringify(courses);
  let bookedAndWaitedLectures = JSON.stringify({ "booked": booked, "waited": waited });
  let allLecturesCourse1 = JSON.stringify(lecturesCourse1.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  let allLecturesCourse2 = JSON.stringify(lecturesCourse2.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  let allLecturesCourse3 = JSON.stringify(lecturesCourse3.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  let allLecturesCourse4 = JSON.stringify(lecturesCourse4.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  let allLecturesCourse5 = JSON.stringify(lecturesCourse5.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  let allLecturesCourse6 = JSON.stringify(lecturesCourse6.map((l) => { return { "lecture": l, "class_": classes[0], "nBookings": 5 } }));
  fetch.mockResponses(
    [allCourses],
    [bookedAndWaitedLectures],
    [allLecturesCourse1],
    [allLecturesCourse2],
    [allLecturesCourse3],
    [allLecturesCourse4],
    [allLecturesCourse5],
    [allLecturesCourse6]
  )
  await act(async () => {
    render(<StudentPage user={user} />)
  });
}

describe('Student Page suite', () => {
  test("render StudentPage component (all API called : success)", async () => {
    await setupCalendar();
    expect(screen.getByText("today")).toBeInTheDocument()
  })
  test("render StudentPage component (getCoursesByStudentId : communication error)", async () => {

    fetch.mockReject(new Error(""))
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server cannot communicate")).toBeInTheDocument()
  })
  test("render StudentPage component (getCoursesById : server error)", async () => {
    let allCourses = JSON.stringify([{
      source: "StudentService",
      errno: 1,
      error: "userID is not an integer",
      statusCode: 400
    }]);
    fetch.mockResponses(
      [allCourses, { status: 400 }],
    )
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server error (getCoursesByStudentId)")).toBeInTheDocument()
  })
  test("render StudentPage component (getBookedLectures : communication error)", async () => {
    fetch.mockResponseOnce(JSON.stringify(courses))
    fetch.mockReject(new Error(""))
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server cannot communicate")).toBeInTheDocument()
  })
  test("render StudentPage component (getBookedLectures : server error)", async () => {
    let allCourses = JSON.stringify(courses);
    let bookedLectures = JSON.stringify([{
      source: "StudentService",
      errno: 1,
      error: "userID is not an integer",
      statusCode: 400
    }]);
    fetch.mockResponses(
      [allCourses],
      [bookedLectures, { status: 400 }]
    )
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server error (getBookedLectures)")).toBeInTheDocument()
  })
  test("render StudentPage component (getLecturesByCourseId : communication error)", async () => {
    fetch.mockResponses(
      [JSON.stringify(courses)],
      [JSON.stringify(booked)],
    ).mockReject(new Error(""))
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server cannot communicate")).toBeInTheDocument()
  })
  test("render StudentPage component (getLecturesByCourseId : server error)", async () => {
    let allCourses = JSON.stringify(courses);
    let bookedLectures = JSON.stringify(booked);
    let allLectures = JSON.stringify([{
      source: "StudentService",
      errno: 1,
      error: "userID is not an integer",
      statusCode: 400
    }]);
    fetch.mockResponses(
      [allCourses],
      [bookedLectures],
      [allLectures, { status: 400 }]
    )
    await act(async () => {
      render(<StudentPage user={user} />)
    });
    expect(screen.getByText("Server error (getLecturesByCourseId)")).toBeInTheDocument()
  })
});

describe('Calendar component', () => {
  test('Correct calendar labels', async () => {
    await setupCalendar();
    expect(screen.getByText("month")).toBeInTheDocument();
    expect(screen.getByText("week")).toBeInTheDocument();
    expect(screen.getByText("day")).toBeInTheDocument();
    expect(screen.getByText("list")).toBeInTheDocument();
  })
  test('click on expired event', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Web Application 1"))
    });
    expect(screen.getByText("This lecture was expired")).toBeInTheDocument();
  })
  test('click on bookable event and success', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Data Science"))
    });
    expect(screen.getByText("Are you sure you want to book for this lecture?")).toBeInTheDocument();
    fetch.mockResponseOnce({ status: 200 })
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText('Your operation was successfull')).toBeInTheDocument();
  })
  test('click on bookable event and the communication fails', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Data Science"))
    });
    expect(screen.getByText("Are you sure you want to book for this lecture?")).toBeInTheDocument();
    fetch.mockReject(new Error("Communication error"))
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText("Ops, an error during server communication occurs")).toBeInTheDocument();
  })
  test('click on bookable event and the server fails', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Data Science"))
    });
    expect(screen.getByText("Are you sure you want to book for this lecture?")).toBeInTheDocument();
    fetch.mockResponseOnce({}, { status: 400 })
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText("Ops, an error during server communication occurs")).toBeInTheDocument();
  })
  test('click on booked event and success', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Computer Systems Programming"))
    });
    expect(screen.getByText("Are you sure you want to cancel your reservation for this lecture?")).toBeInTheDocument();
    fetch.mockResponseOnce({}, { status: 204 })
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText('Your operation was successfull')).toBeInTheDocument();
  })
  test('click on booked event and the communication fails', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Computer Systems Programming"))
    });
    expect(screen.getByText("Are you sure you want to cancel your reservation for this lecture?")).toBeInTheDocument();
    fetch.mockReject(new Error("Communication error"))
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText("Ops, an error during server communication occurs")).toBeInTheDocument();
  })
  test('click on booked event and the server fails', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Computer Systems Programming"))
    });
    expect(screen.getByText("Are you sure you want to cancel your reservation for this lecture?")).toBeInTheDocument();
    fetch.mockResponseOnce({}, { status: 400 })
    await act(async () => {
      userEvent.click(screen.getByText("Yes"));
    });
    expect(screen.getByText("Ops, an error during server communication occurs")).toBeInTheDocument();
  })
  test('click on expired event', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Web Application 1"))
    });
    expect(screen.getByText('This lecture was expired')).toBeInTheDocument();
  })
  test('click on remote event', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("OS"))
    });
    expect(screen.getByText('This lecture will be erogated remotely')).toBeInTheDocument();
  })
  test('click on past event', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Cybersecurity"))
    });
    expect(screen.getByText('This lecture is over')).toBeInTheDocument();
  })
  test('click on close modal', async () => {
    await setupCalendar();
    await act(async () => {
      userEvent.click(screen.getByText("Computer Systems Programming"))
    });
    await act(async () => {
      userEvent.click(screen.getByTestId("modalClose"))
    });
  })
})