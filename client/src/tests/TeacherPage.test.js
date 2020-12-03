import { render, screen, act } from '@testing-library/react';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import moment from "moment";

import TeacherPage from '../pages/TeacherPage';
import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';

fetchMock.enableMocks();

const teacher = new User(1, "TEACHER", "Giacomo", "Poretti", "giacomo.poretti@agg.it", "giacomo");
const courses = [
  new Course(1, "Software Engineering 2", 2020),
  new Course(2, "Information Systems Security", 2020),
  new Course(3, "Architetture dei Sistemi di Elaborazione", 2020),
  new Course(4, "Data Science e Tecnologie per le Basi di Dati", 2020),
  new Course(5, "Programmare in React", 2020)
];
const lectures = [
  new Lecture(1, 1, 1, moment().add("1", "day").toISOString(), "1000000", moment().toISOString(), "PRESENCE"),
  new Lecture(2, 1, 1, moment().add("2", "day").toISOString(), "1000000", moment().add("1", "day").toISOString(), "REMOTE"),
  new Lecture(3, 2, 2, moment().add("1", "day").toISOString(), "1000000", moment().toISOString(), "PRESENCE"),
  new Lecture(4, 1, 2, moment().add("1", "day").toISOString(), "1000000", moment().toISOString(), "PRESENCE"),
  new Lecture(5, 1, 2, moment().add("1", "day").toISOString(), "1000000", moment().toISOString(), "PRESENCE")
];
const students = [
  new Student(1, "Francesco", "Rossi", "fr@email.com", "ciao1"),
  new Student(2, "Monica", "Gialli", "mg@email.com", "ciao2"),
  new Student(3, "Giovanni", "Verdi", "fr@email.com", "ciao1"),
  new Student(4, "Carla", "Blu", "mg@email.com", "ciao2"),
  new Student(5, "Francesco", "Rossi", "fr@email.com", "ciao1"),
  new Student(6, "Monica", "Gialli", "mg@email.com", "ciao2"),
  new Student(7, "Giovanni", "Verdi", "fr@email.com", "ciao1"),
  new Student(8, "Carla", "Blu", "mg@email.com", "ciao2"),
  new Student(9, "Francesco", "Rossi", "fr@email.com", "ciao1"),
  new Student(10, "Monica", "Gialli", "mg@email.com", "ciao2"),
  new Student(11, "Giovanni", "Verdi", "fr@email.com", "ciao1"),
  new Student(12, "Carla", "Blu", "mg@email.com", "ciao2")
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
  test('render TeacherPage component (courses API : success), testing next/previous', async () => {
    await fetchCourses();
    let items = screen.getAllByTestId('course-row');
    expect(items).toHaveLength(4);
    expect(screen.getByText("Software Engineering 2")).toBeInTheDocument(); //should be in page 0
    await act(async () => {
      userEvent.click(screen.getByText('Next')); //page 0 -> 1
    });
    expect(screen.getByText("Programmare in React")).toBeInTheDocument(); //should be in page 1
    await act(async () => {
      userEvent.click(screen.getByText('Previous')); //page 1 -> 0
    });
    expect(screen.getByText("Information Systems Security")).toBeInTheDocument(); //should be in page 0
  });

  test('render TeacherPage component (courses API : json parsing error)', async () => {
    await fetchCourses('Course : application parse error');
    expect(screen.getByText('Course : application parse error')).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByRole('button'));
    });
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

  test('testing interaction CoursePanel-LecturePanel (lectures API : success), testing next/previous', async () => {
    await fetchLectureSuccess();
    expect(screen.getByText('Selected course: 1')).toBeInTheDocument();
    const items = screen.getAllByTestId('lecture-row');
    expect(items).toHaveLength(4);
    await act(async () => {
      userEvent.click(screen.getAllByText('Next')[1]); //page 0 -> 1
    });
    await act(async () => {
      userEvent.click(screen.getAllByText('Previous')[1]); //page 1 -> 0
    });
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

  test('testing interaction between LecturePanel-StudentPanel (students API : success), testing next/previous', async () => {
    await fetchStudentSuccess();
    expect(screen.getByText('Selected lecture: 1')).toBeInTheDocument();
    expect(screen.getByText('Number of students: 12')).toBeInTheDocument();
    let items = screen.getAllByTestId('student-row');
    expect(items).toHaveLength(10);
    await act(async () => {
      userEvent.click(screen.getAllByText('Next')[2]); //page 0 -> 1
    });
    items = screen.getAllByTestId('student-row');
    expect(items).toHaveLength(2);
    await act(async () => {
      userEvent.click(screen.getAllByText('Previous')[2]); //page 1 -> 0
    });
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
      userEvent.click(screen.getByTestId('l-1'))
    });
    await act(async () => {
      userEvent.click(screen.getByTestId('d-1'))
    });
    fetch.mockResponseOnce(JSON.stringify({ body: "ok" }), { status: 204 });
    await act(async () => {
      userEvent.click(screen.getByTestId("yes-d-1"));
    });
    let items = screen.getAllByTestId('lecture-row');
    expect(items).toHaveLength(4); //num lectures 5 -> 4, but pagination still provides 4 lectures
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
