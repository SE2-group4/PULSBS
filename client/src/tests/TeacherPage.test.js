import { render, screen, act } from '@testing-library/react';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import TeacherPage from '../pages/TeacherPage';
import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';

fetchMock.enableMocks();

const teacher = new User(1, "TEACHER", "Giacomo", "Poretti", "giacomo.poretti@agg.it", "giacomo");
const courses = [
  new Course(1, "Software Engineering 2", 2020),
  new Course(2, "Information Systems Security", 2020)
];
const lectures = [
  new Lecture(1, 1, 1, "2021-11-22T07:30:00.000Z", "1000000", "2021-11-18T07:30:00.000Z", "PRESENCE"),
  new Lecture(2, 1, 1, "2020-11-22T07:30:00.000Z", "1000000", "2020-11-18T07:30:00.000Z", "REMOTE")
];
const students = [
  new Student(1, "Francesco", "Rossi", "fr@email.com", "ciao1"),
  new Student(2, "Monica", "Gialli", "mg@email.com", "ciao2")
];

beforeEach(() => {
  fetch.resetMocks();
});

async function fetchCourses(error) {
  if (error)
    await act(async () => {
      render(<TeacherPage user={teacher} fetchError={error} />);
    });
  else
    await act(async () => {
      render(<TeacherPage user={teacher} courses={courses} />);
    });
}

async function fetchLectureSuccess() {
  await fetchCourses();
  let res = JSON.stringify(lectures);
  fetch.mockResponseOnce(res);
  await act(async () => {
    userEvent.click(screen.getByTestId('c-1'))
  });

}

async function fetchStudentSuccess() {
  await fetchLectureSuccess();
  let res = JSON.stringify(students);
  fetch.mockResponseOnce(res);
  await act(async () => {
    userEvent.click(screen.getByTestId('l-1'))
  });
}

async function setupEditModal() {
  await fetchLectureSuccess();
  await act(async () => {
    userEvent.click(screen.getByTestId('m-1'))
  });
}

async function setupDeleteModal() {
  await fetchLectureSuccess();
  await act(async () => {
    userEvent.click(screen.getByTestId('d-1'))
  });
}

describe('Teacher Page suite', () => {
  test('render TeacherPage component (courses API : success)', async () => {
    await fetchCourses();
    let items = screen.getAllByTestId('course-row');
    expect(items).toHaveLength(2);
  });

  test('render TeacherPage component (courses API : json parsing error)', async () => {
    await fetchCourses('Course : application parse error');
    expect(screen.getByText('Course : application parse error')).toBeInTheDocument();
  });

  test('render TeacherPage component (courses API : error)', async () => {
    await fetchCourses('Course : invalid parameter error');
    expect(screen.getByText('Course : invalid parameter error')).toBeInTheDocument();
  });

  test('render TeacherPage component (courses API : error parsing error)', async () => {
    await fetchCourses('Course : server error');
    expect(screen.getByText('Course : server error')).toBeInTheDocument();
  });

  test('render TeacherPage component (courses API : server connection error)', async () => {
    await fetchCourses('Course : server error');
    expect(screen.getByText('Course : server error')).toBeInTheDocument();
  });

  test('testing interaction CoursePanel-LecturePanel (lectures API : success)', async () => {
    await fetchLectureSuccess();
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    const items = screen.getAllByTestId('lecture-row');
    expect(items).toHaveLength(2);
    await act(async () => {
      userEvent.click(screen.getByTestId('c-1'))
    });
    expect(screen.getByText('no lectures available.')).toBeInTheDocument();
  });

  test('testing interaction CoursePanel-LecturePanel (lectures API : json parsing error)', async () => {
    await fetchCourses();
    let res = JSON.stringify();
    fetch.mockResponseOnce(res);
    await act(async () => {
      userEvent.click(screen.getByTestId('c-1'))
    });
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    expect(screen.getByText('Lecture : application parse error')).toBeInTheDocument();
  });

  test('testing interaction CoursePanel-LecturePanel (lectures API : error)', async () => {
    await fetchCourses();
    fetch.mockResponseOnce(JSON.stringify([{
      source: "TeacherService",
      errno: 1,
      error: "'teacherId' parameter is not an integer: fail",
      statusCode: 400
    }]), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId('c-1'))
    });
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    expect(screen.getByText('Lecture : invalid parameter error')).toBeInTheDocument();
  });

  test('testing interaction CoursePanel-LecturePanel (lectures API : error parsing error)', async () => {
    await fetchCourses();
    fetch.mockResponseOnce(JSON.stringify(), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId('c-1'))
    });
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    expect(screen.getByText('Lecture : server error')).toBeInTheDocument();
  });

  test('testing interaction CoursePanel-LecturePanel (lectures API : server connection error)', async () => {
    await fetchCourses();
    fetch.mockRejectOnce();
    await act(async () => {
      userEvent.click(screen.getByTestId('c-1'))
    });
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    expect(screen.getByText('Lecture : server error')).toBeInTheDocument();
  });

  test('testing interaction between LecturePanel-StudentPanel (students API : success)', async () => {
    await fetchStudentSuccess();
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Number of students: 2')).toBeInTheDocument();
    const items = screen.getAllByTestId('student-row');
    expect(items).toHaveLength(2);
    await act(async () => {
      userEvent.click(screen.getByTestId('l-1'))
    });
    expect(screen.getByText('no students listed.')).toBeInTheDocument();
  });

  test('testing interaction between LecturePanel-StudentPanel (students API : json parsing error)', async () => {
    await fetchLectureSuccess();
    let res = JSON.stringify();
    fetch.mockResponseOnce(res);
    await act(async () => {
      userEvent.click(screen.getByTestId('l-1'))
    });
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Student : application parse error')).toBeInTheDocument();
  });

  test('testing interaction between LecturePanel-StudentPanel (students API : error)', async () => {
    await fetchLectureSuccess();
    fetch.mockResponseOnce(JSON.stringify([{
      source: "TeacherService",
      errno: 1,
      error: "'teacherId' parameter is not an integer: fail",
      statusCode: 400
    }]), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId('l-1'))
    });
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Student : invalid parameter error')).toBeInTheDocument();
  });

  test('testing interaction between LecturePanel-StudentPanel (students API : error parsing error)', async () => {
    await fetchLectureSuccess();
    fetch.mockResponseOnce(JSON.stringify(), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId('l-1'))
    });
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Student : server error')).toBeInTheDocument();
  });

  test('testing interaction between LecturePanel-StudentPanel (students API : server connection error)', async () => {
    await fetchLectureSuccess();
    fetch.mockRejectOnce();
    await act(async () => {
      userEvent.click(screen.getByTestId('l-1'))
    });
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Student : server error')).toBeInTheDocument();
  });

  test('testing EditModal component and related buttons (PUT success)', async () => {
    await setupEditModal();
    expect(screen.getByText("Edit Delivery")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("no-m-1"));
    });
    await act(async () => {
      userEvent.click(screen.getByTestId('m-1'))
    });
    fetch.mockResponseOnce(JSON.stringify({ body: "ok" }), { status: 204 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-m-1"));
    });
    let items = screen.getAllByText("REMOTE");
    expect(items).toHaveLength(2);
  });

  test('testing EditModal component and related buttons (PUT failure : error)', async () => {
    await setupEditModal();
    fetch.mockResponseOnce(JSON.stringify({ body: "not ok" }), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-m-1"));
    });
    expect(screen.getByText("Lecture : can't update delivery")).toBeInTheDocument();
  });

  test('testing EditModal component and related buttons (PUT failure : error parsing error)', async () => {
    await setupEditModal();
    fetch.mockResponseOnce({}, { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-m-1"));
    });
    expect(screen.getByText("Lecture : server error")).toBeInTheDocument();
  });

  test('testing EditModal component and related buttons (PUT failure : server connection error)', async () => {
    await setupEditModal();
    fetch.mockRejectOnce();
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-m-1"));
    });
    expect(screen.getByText("Lecture : server error")).toBeInTheDocument();
  });

  test('testing DeleteModal component and related buttons (DELETE success)', async () => {
    await setupDeleteModal();
    await act(async () => {
      userEvent.click(screen.getByTestId("no-d-1"));
    });
    await act(async () => {
      userEvent.click(screen.getByTestId('d-1'))
    });
    fetch.mockResponseOnce(JSON.stringify({ body: "ok" }), { status: 204 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-d-1"));
    });
    const items = screen.getAllByTestId('lecture-row');
    expect(items).toHaveLength(1);
  });

  test('testing DeleteModal component and related buttons (DELETE failure : error)', async () => {
    await setupDeleteModal();
    fetch.mockResponseOnce(JSON.stringify({ body: "not ok" }), { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-d-1"));
    });
    expect(screen.getByText("Lecture : can't delete lecture")).toBeInTheDocument();
  });

  test('testing DeleteModal component and related buttons (DELETE failure : error parsing error)', async () => {
    await setupDeleteModal();
    fetch.mockResponseOnce({}, { status: 400 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-d-1"));
    });
    expect(screen.getByText("Lecture : server error")).toBeInTheDocument();
  });

  test('testing DeleteModal component and related buttons (DELETE failure : server connection error)', async () => {
    await setupDeleteModal();
    fetch.mockRejectOnce();
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-d-1"));
    });
    expect(screen.getByText("Lecture : server error")).toBeInTheDocument();
  });

});
