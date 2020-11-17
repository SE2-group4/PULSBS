import { render,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { CoursePanel,LecturePanel,StudentPanel } from '../components/TeacherComp';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';

//const elementForPage=2;
const courses1 = [
    new Course(1,"Software Engineering 2",2020),
    new Course(2,"Information Systems Security",2020)
];
//cPages1=1 
const courses2 = [
    new Course(1,"Software Engineering 2",2020),
    new Course(2,"Information Systems Security",2020),
    new Course(3,"Architetture dei Sistemi di Elaborazione",2020),
    new Course(4,"Data Science e Tecnologie per le Basi di Dati",2020)
];
//cPages2=2
const cMap1=new Map(); //(courseId,pageNumber[0,1])
cMap1.set(1,0);
cMap1.set(2,0);

const cMap2=new Map(); //(courseId,pageNumber[0,1])
cMap2.set(1,0);
cMap2.set(2,0);
cMap2.set(3,1);
cMap2.set(4,1);

const lectures1 = [
    new Lecture(1,1,1,"10-11-2020 12:00"),
    new Lecture(2,1,1,"25-11-2020 13:00")
];
//lPages1=1
const lectures2 = [
    new Lecture(1,1,1,"10-11-2020 12:00"),
    new Lecture(2,1,1,"25-11-2020 13:00"),
    new Lecture(3,2,2,"12-12-2020 09:00"),
    new Lecture(4,1,2,"13-12-2020 09:00")
];
//lPages2=2
const lMap1=new Map(); //(lectureId,pageNumber[0,1])
lMap1.set(1,0);
lMap1.set(2,0);

const lMap2=new Map(); //(lectureId,pageNumber[0,1])
lMap2.set(1,0);
lMap2.set(2,0);
lMap2.set(3,1);
lMap2.set(4,1);

const students1 =[
    new Student(1,"Francesco", "Rossi","fr@email.com","ciao1"),
    new Student(2,"Monica","Gialli","mg@email.com","ciao2")
];
//sPages1=1
const students2 =[
    new Student(1,"Francesco", "Rossi","fr@email.com","ciao1"),
    new Student(2,"Monica","Gialli","mg@email.com","ciao2"),
    new Student(3,"Gianni", "Verdi","gn@email.com","ciao3"),
    new Student(4,"Mario", "Blu","mr@email.com","ciao4")
];
//sPages2=2
const sMap1=new Map(); //(studentId,pageNumber[0,1])
sMap1.set(1,0);
sMap1.set(2,0);

const sMap2=new Map(); //(studentId,pageNumber[0,1])
sMap2.set(1,0);
sMap2.set(2,0);
sMap2.set(3,1);
sMap2.set(4,1);

describe('Course Panel suite', () => {
    test('render CoursePanel component (2 courses)', () => {
        render(<CoursePanel courses={courses1} pageMap={cMap1} nPages={1}/>);
        const items = screen.getAllByTestId('course-row');
        expect(items).toHaveLength(2); //two courses/page
      });

    test('render CoursePanel component (4 courses)', () => {
        render(<CoursePanel courses={courses2} pageMap={cMap2} nPages={2}/>);
        const items = screen.getAllByTestId('course-row');
        expect(items).toHaveLength(2); //two courses/page
        expect(screen.getByText('Next')).toBeInTheDocument(); //navbuttons
        expect(screen.getByText('Previous')).toBeInTheDocument(); //navbuttons
    });

    test('testing Navbuttons in CoursePanel', () => {
        render(<CoursePanel courses={courses2} pageMap={cMap2} nPages={2}/>);
        expect(screen.getByText("Software Engineering 2")).toBeInTheDocument(); //should be in page 0
        userEvent.click(screen.getByText('Next')); //page 0 -> 1
        expect(screen.getByText("Architetture dei Sistemi di Elaborazione")).toBeInTheDocument(); //should be in page 1
    });

    test('testing Checkbox status in CoursePanel', () => {
        render(<CoursePanel courses={courses2} sCourse={1} pageMap={cMap2} nPages={2}/>);
        expect(screen.getByTestId('c-1')).toBeChecked(); 
    });
});

describe('Lecture Panel suite', () => {
    test('render LecturePanel component (2 lectures)', () => {
        render(<LecturePanel lectures={lectures1} pageMap={lMap1} nPages={1}/>);
        const items = screen.getAllByTestId('lecture-row');
        expect(items).toHaveLength(2); //two lectures/page
      });

    test('render LecturePanel component (4 lectures)', () => {
        render(<LecturePanel lectures={lectures2} pageMap={lMap2} nPages={2}/>);
        const items = screen.getAllByTestId('lecture-row');
        expect(items).toHaveLength(2); //two lectures/page
        expect(screen.getByText('Next')).toBeInTheDocument(); //navbuttons
        expect(screen.getByText('Previous')).toBeInTheDocument(); //navbuttons
    });

    test('testing Navbuttons in LecturePanel', () => {
        render(<LecturePanel lectures={lectures2} pageMap={lMap2} nPages={2}/>);
        expect(screen.getByText("10-11-2020 12:00")).toBeInTheDocument(); //should be in page 0
        userEvent.click(screen.getByText('Next')); //page 0 -> 1
        expect(screen.getByText("12-12-2020 09:00")).toBeInTheDocument(); //should be in page 1
    });

    test('testing Checkbox status in LecturePanel', () => {
        render(<LecturePanel lectures={lectures2} sLecture={1} pageMap={lMap2} nPages={2}/>);
        expect(screen.getByTestId('l-1')).toBeChecked(); 
    });
});

describe('Student Panel suite', () => {
    test('render StudentPanel component (2 students)', () => {
        render(<StudentPanel students={students1} pageMap={sMap1} nPages={1}/>);
        const items = screen.getAllByTestId('student-row');
        expect(items).toHaveLength(2); //two students/page
      });

    test('render StudentPanel component (4 students)', () => {
        render(<StudentPanel students={students2} pageMap={sMap2} nPages={2}/>);
        const items = screen.getAllByTestId('student-row');
        expect(items).toHaveLength(2); //two students/page
        expect(screen.getByText('Next')).toBeInTheDocument(); //navbuttons
        expect(screen.getByText('Previous')).toBeInTheDocument(); //navbuttons
    });

    test('testing Navbuttons in StudentPanel', () => {
        render(<StudentPanel students={students2} pageMap={sMap2} nPages={2}/>);
        expect(screen.getByText("Rossi")).toBeInTheDocument(); //should be in page 0
        userEvent.click(screen.getByText('Next')); //page 0 -> 1
        expect(screen.getByText("Verdi")).toBeInTheDocument(); //should be in page 1
    });
});
