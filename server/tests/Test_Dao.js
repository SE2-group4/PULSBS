/**
 * test suite for the Dao module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');
const moment = require('moment');

const dao = require('../src/db/Dao.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const EmailQueue = require('../src/entities/EmailQueue.js');
const Schedule = require('../src/entities/Schedule.js');
const Calendar = require('../src/entities/Calendar.js');
const prepare = require('../src/db/preparedb.js');
const { fail } = require('assert');
const Class = require('../src/entities/Class.js');

const suite = function () {
    describe('Dao', function () {
        let student1, student2;
        let teacher4;
        let lecture1, lecture2, lecture3;
        let course1, course3;
        let emailQueue1;

        let wrongStudent;
        let wrongLecture;
        let wrongCourse;
        let wrongClass;

        let class1, class2, class3;

        let schedule1, schedule2, schedule5, schedule8;
        let newSchedule;
        let newLecture;
        let wrongSchedule;
        let wrongLecturePrototype;

        let overlappedScheduleSameCourse;
        let overlappedScheduleDifferentCourse;

        before(function (done) {
            done();
        });

        beforeEach(function (done) {
            reset(done);
        });

        const reset = (done) => {
            student1 = new Student(1, 'Aldo', 'Baglio');
            student2 = new Student(2, 'Giovanni', 'Storti', 'tjw85.student.storti@inbox.testmail.app', 'giovanni');
            teacher4 = new Teacher(4);
            lecture1 = new Lecture(1, 1, 1);
            lecture2 = new Lecture(2);
            lecture3 = new Lecture(3);

            course1 = new Course(1);
            course1.code = '1';
            course3 = new Course(3);
            course3.code = '3';
            emailQueue1 = new EmailQueue(1);

            wrongStudent = new Student(-1);
            wrongLecture = new Lecture(-1, -1);
            wrongCourse = new Course(-1);
            wrongClass = new Class(-1, 'Wrong description', -1);

            class1 = new Class(1, '1A', 10);
            // class2 = new Class(2, '2B', 10); // unused
            class3 = new Class(3, '3C', 10);

            schedule1 = new Schedule(1, '1', 2020, 1, '1A', 10, 'Mon', '8:30', '10:00');
            schedule2 = new Schedule(2, '2', 2020, 1, '2B', 10, 'Mon', '8:30', '10:00');
            schedule5 = new Schedule(5, '5', 2020, 1, '2B', 10, 'Tue', '8:30', '10:00');
            // schedule8 = new Schedule(8, '8'); // unused

            newSchedule = new Schedule(999, course1.code, '2020', '1', '9Z', '15', 'Thu', '17:30', '19:30');
            newLecture = new Lecture(999, 1, 1, moment().toDate(), 90*60*1000, moment().startOf('day').subtract(1, 'day'), Lecture.DeliveryType.PRESENCE);
            wrongSchedule = new Schedule(-1, -1, 1970, -1, 'Wrong roomId', -1, 'Wrong day', 'Not a time', 'Not a time');
            wrongLecturePrototype = new Lecture(-1, -1, -1, 'Not a time', -1, 'Not a time', 'Wrong delivery');

            overlappedScheduleSameCourse = Schedule.from(schedule1);
            overlappedScheduleSameCourse.roomId = schedule2.roomId;
            overlappedScheduleDifferentCourse = Schedule.from(schedule1);
            overlappedScheduleDifferentCourse.roomId = schedule2.roomId;
            overlappedScheduleDifferentCourse.startingTime = schedule2.startingTime;
            overlappedScheduleDifferentCourse.endingTime = schedule2.endingTime;

            prepare('testing.db', 'testing.sql', false)
                .then(() => done())
                .catch((err) => done(err));
        }

        describe('login', function () {
            it('correct data should perform login', function (done) {
                dao.login(student2)
                    .then((retStudent) => {
                        assert.strictEqual(retStudent.studentId, student2.studentId, 'Wrong user retrieved');
                        done()
                    })
                    .catch((err) => done(err));
            });

            it('incorrect data should not perform login', function (done) {
                dao.login(new Student(-1, 'invalid', 'invalid', 'invalid', 'invalid'))
                    .then((retStudent) => {
                        done('No user should be retrieved');
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('addBooking', function () {
            it('correct data should insert a new booking', function (done) {
                dao.addBooking(student1, lecture2)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'Booking not added');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByStudent', function () {
            it('non empty lecture should get the list of students', function (done) {
                dao.getLecturesByStudent(student1)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 4, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getCoursesByStudent', function() {
            it('non empty course should get the list of courses', function(done) {
                dao.getCoursesByStudent(student2)
                    .then((courses) => {
                        assert.ok(courses, 'No returned valued received');
                        assert.strictEqual(courses.length, 2, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourse', function () {
            it('non empty course should get the list of lectures', function (done) {
                dao.getLecturesByCourse(course3)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getBookedStudentsByLecture', function () {
            it('non empty lecture should get the list of students', function (done) {
                dao.getBookedStudentsByLecture(lecture3)
                    .then((students) => {
                        assert.ok(students, 'No returned valued received');
                        assert.ok(students.length === 1, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getStudentsByCourse', function () {
            it('non empty coure should get the list of students', function (done) {
                dao.getStudentsByCourse(course3)
                    .then((students) => {
                        assert.ok(students, 'No returned valued received');
                        assert.ok(students.length === 3, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByTeacher', function () {
            it('non empty teacher should get the list of lectures', function (done) {
                dao.getLecturesByTeacher(teacher4)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 4, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getCoursesByTeacher', function () {
            it('non empty teacher should get the list of courses', function (done) {
                dao.getCoursesByTeacher(teacher4)
                    .then((courses) => {
                        assert.ok(courses, 'No returned valued received');
                        assert.ok(courses.length == 3, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('_getCurrentAcademicYear', function () {
            it('should get this year', function (done) {
                const retVal = dao._getCurrentAcademicYear();
                assert.ok(retVal === 2020, 'Wrong academic year'); // check this manually
                done();
            });
        });

        describe('addEmail', function () {
            it('correct data should insert a new email', function (done) {
                const emailType = EmailType.STUDENT_NEW_BOOKING;
                const email = new Email(undefined, teacher4, student1, new Date(), emailType, 'test subject', 'test body');
                dao.addEmail(email)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'Email not inserted');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('deleteBooking', function () {
            it('correct params should remove the booking', function (done) {
                dao.deleteBooking(student1, lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Booking not inserted');
                        done();
                    })
                    .catch((err) => done());
            });

            it('non existing student should reject the request', function (done) {
                dao.deleteBooking(-1, lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Not booking should be deleted');
                        done()
                    })
                    .catch((err) => done());
            });
        });

        describe('getBookedLecturesByStudent', function () {
            it('correct params should return the list of lectures', function (done) {
                dao.getBookedLecturesByStudent(student2)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done());
            });

            it('non existing student should return an empty list', function (done) {
                dao.getBookedLecturesByStudent(-1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done());
            });
        });

        describe('getBookingsByStudentAndPeriodOfTime', function () {
            it('not specified period of time should return the list of lectures', function (done) {
                dao.getBookingsByStudentAndPeriodOfTime(student1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.from setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    from: moment().startOf('day').add(2, 'day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.to setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    to: moment().endOf('day').add(1, 'day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('both periodOfTime.from and periodOfTime.to setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    from: moment().add(2, 'day').startOf('day'),
                    to: moment().add(3, 'day').endOf('day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourseAndPeriodOfTime', function () {
            it('not specified period of time should return the list of lectures', function (done) {
                dao.getLecturesByCourseAndPeriodOfTime(course1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.from setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    from: moment().startOf('day').add(2, 'day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.to setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    to: moment().endOf('day').add(1, 'day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('both periodOfTime.from and periodOfTime.to setted should return the list of lectures', function (done) {
                const periodOfTime = {
                    from: moment().add(2, 'day').startOf('day'),
                    to: moment().add(3, 'day').endOf('day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLectureById', function () {
            it('correct params should return a lecture', function (done) {
                dao.getLectureById(lecture1)
                    .then((lecture) => {
                        assert.strictEqual(lecture.lectureId, lecture1.lectureId, 'Incorrect lectureId');
                        assert.strictEqual(lecture.courseId, lecture1.courseId, 'Incorrect courseId');
                        assert.strictEqual(lecture.classId, lecture1.classId, 'Incorrect classId');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('wrong params should return an error', function (done) {
                dao.getLectureById(wrongLecture)
                    .then((lecture) => done('This must fail'))
                    .catch((err) => done()); // correct case
            });
        });

        describe('deleteLectureById', function () {
            it('correct params should accept the request', function (done) {
                dao.deleteLectureById(lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Lecture not deleted');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing lecture should deny the request', function (done) {
                dao.deleteLectureById({ lectureId: -1 })
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('deleteEmailQueueById', function () {
            it('correct params should accept the request', function (done) {
                dao.deleteEmailQueueById(emailQueue1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Email queue not deleted');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('incorrect params should deny the request', function (done) {
                dao.deleteEmailQueueById({ queueId: -1 })
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getEmailsInQueueByEmailType', function () {
            it('correct params should return the list of email queues', function (done) {
                dao.getEmailsInQueueByEmailType(Email.EmailType.LESSON_CANCELLED)
                    .then((emailQueues) => {
                        assert.strictEqual(emailQueues.length, 1, 'Wrong number of email queues');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing email type should return an empty list', function (done) {
                dao.getEmailsInQueueByEmailType('Unexisting type')
                    .then((emailQueues) => {
                        assert.strictEqual(emailQueues.length, 0, 'Wrong number of email queues');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('updateLectureDeliveryMode', function () {
            it('correct params should accept the request', function (done) {
                lecture1.delivery = Lecture.DeliveryType.REMOTE;
                dao.updateLectureDeliveryMode(lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Lecture not updated');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing lecture should deny the request', function (done) {
                dao.updateLectureDeliveryMode({ lectureId: -1, delivery: Lecture.DeliveryType.REMOTE })
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCoursePlusNumBookings', function () {
            it('correct params should return a complex list', function (done) {
                dao.getLecturesByCoursePlusNumBookings(course1)
                    .then((list) => {
                        assert.ok(list);
                        assert.ok(list[0]);
                        assert.strictEqual(list.length, 2, 'Wrong number of lectures');

                        for (let currItem of list) {
                            switch (currItem.lecture.lectureId) {
                                case 1:
                                    assert.strictEqual(currItem.numBookings, 1, 'Wrong number of bookings');
                                    break;
                                case 4:
                                    assert.strictEqual(currItem.numBookings, 1, 'Wrong number of bookings');
                                    break;
                                default:
                                    fail('unexpected lecture');
                            }
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing course should return an empty list', function (done) {
                dao.getLecturesByCoursePlusNumBookings({ courseId: -1 })
                    .then((list) => {
                        assert.ok(list);
                        assert.strictEqual(list.length, 0, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getNumBookingsOfLecture', function () {
            it('correct params should return the number of bookings', function (done) {
                dao.getNumBookingsOfLecture(lecture2)
                    .then((nBooking) => {
                        assert.strictEqual(nBooking, 1, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('non existing lecture should return zero', function (done) {
                dao.getNumBookingsOfLecture(wrongLecture)
                    .then((nBooking) => {
                        assert.strictEqual(nBooking, 0, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourseId', function () {
            it('correct params should return a list of lectures', function (done) {
                dao.getLecturesByCourseId(course1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('non existing course should return an empty list', function (done) {
                dao.getLecturesByCourseId(wrongCourse)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getUserById', function () {
            it('correct params should return a student', function (done) {
                dao.getUserById(student1)
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Student()), "student received.")
                        done();
                    })
                    .catch((err) => done(err))
            })
            it('correct params should return a teacher', function (done) {
                dao.getUserById(teacher4)
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Teacher()), "teacher received.")
                        done();
                    })
                    .catch((err) => done(err))
            })
            it('non existing user should fail the request', function (done) {
                let errStudent = new Student(-1, 'invalid', 'invalid', 'invalid', 'invalid');
                dao.getUserById(errStudent)
                    .then((user) => {
                        done('No user should be returned');
                    })
                    .catch((err) => done()) //ok
            });
        })

        describe('checkLectureAndCourse', function () {
            it('Should have returned count 1', function (done) {
                dao.checkLectureAndCourse(course1, lecture1)
                    .then((res) => {
                        assert.strictEqual(res.count, 1);
                        done();
                    })
                    .catch((err) => done(err))
            })

            it('Should have returned count 0', function (done) {
                dao.checkLectureAndCourse(course3, lecture1)
                    .then((res) => {
                        assert.strictEqual(res.count, 0);
                        done();
                    })
                    .catch((err) => done(err))
            })
        })

        describe('getAllCourses', function () {
            it('Should have returned an Array', function (done) {
                dao.getAllCourses()
                    .then((res) => {
                        assert(res.constructor === Array);
                        done();
                    })
                    .catch((err) => done(err))
            })

            it('Should have returned 6 elements', function (done) {
                dao.getAllCourses()
                    .then((res) => {
                        assert.strictEqual(res.length, 6);
                        done();
                    })
                    .catch((err) => done(err))
            })


            it('Should have returned these elements', function (done) {
                const expectedCourseId = [1, 2, 3, 4, 5, 6]
                dao.getAllCourses()
                    .then((res) => {
                        for(let i = 0; i < res.length; i++) {
                            assert.strictEqual(res[i].courseId, expectedCourseId[i]);
                        }
                        done();
                    })
                    .catch((err) => done(err))
            })
        })

        describe('getAllStudents', function () {
            it('Should have returned an Array', function (done) {
                dao.getAllStudents()
                    .then((res) => {
                        assert(res.constructor === Array);
                        done();
                    })
                    .catch((err) => done(err))
            })

            it('Should have returned 4 elements', function (done) {
                dao.getAllStudents()
                    .then((res) => {
                        assert.strictEqual(res.length, 4);
                        done();
                    })
                    .catch((err) => done(err))
            })


            it('Should have returned these elements', function (done) {
                const expectedStudentId = [1, 2, 3, 6];
                dao.getAllStudents()
                    .then((res) => {
                        for(let i = 0; i < res.length; i++) {
                            assert.strictEqual(res[i].studentId, expectedStudentId[i]);
                        }
                        done();
                    })
                    .catch((err) => done(err))
            });
        });

        describe('getAllTeachers', function () {
            it('Should have returned an Array', function (done) {
                dao.getAllTeachers()
                    .then((res) => {
                        assert(res.constructor === Array);
                        done();
                    })
                    .catch((err) => done(err))
            });

            it('Should have returned 3 elements', function (done) {
                dao.getAllTeachers()
                    .then((res) => {
                        assert.strictEqual(res.length, 3);
                        done();
                    })
                    .catch((err) => done(err))
            });

            it('Should have returned these elements', function (done) {
                const expectedTeacherId = [4, 5, 7]
                dao.getAllTeachers()
                    .then((res) => {
                        for(let i = 0; i < res.length; i++) {
                            assert.strictEqual(res[i].teacherId, expectedTeacherId[i]);
                        }
                        done();
                    })
                    .catch((err) => done(err))
            })
        })
        describe('getUserBySsn', function () {
            it('correct params should return a student', function (done) {
                let studentSsn = new Student();
                studentSsn.ssn = 'aldo1';
                dao.getUserBySsn(studentSsn)
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Student()), "student received.")
                        done();
                    })
                    .catch((err) => done(err))
            })
            it('correct params should return a teacher', function (done) {
                let teacherSsn = new Teacher();
                teacherSsn.ssn = 'giacomo4';
                dao.getUserBySsn(teacherSsn)
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Teacher()), "teacher received.")
                        done();
                    })
                    .catch((err) => done(err))
            })
            it('non existing user should fail the request', function (done) {
                let errStudent = new Student(-1, 'invalid', 'invalid', 'invalid', 'invalid');
                errStudent.ssn = 'invalid';
                dao.getUserBySsn(errStudent)
                    .then((user) => {
                        done('No user should be returned');
                    })
                    .catch((err) => done()) //ok
            });
        })

        describe('managerGetReport', function () {
            it('correct params should return the list of users', function (done) {
                dao.managerGetReport(student1)
                    .then((users) => {
                        assert.strictEqual(users.length, 2, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('not existing student params should return an empty list', function (done) {
                dao.managerGetReport(wrongStudent)
                    .then((users) => {
                        assert.strictEqual(users.length, 0, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getClassByLecture', function () {
            it('correct params should return the class', function (done) {
                dao.getClassByLecture(lecture1)
                    .then((currClass) => {
                        assert.strictEqual(currClass.classId, 1, 'Wrong class retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing lecture should throw error', function (done) {
                dao.getClassByLecture(wrongLecture)
                    .then((retVal) => done('This must fail'))
                    .catch((err) => done()); // correct case
            });
        });

        describe('getWaitingsByStudentAndPeriodOfTime', function() {
            it('not specified periodOfTime return the list of students', function(done) {
                dao.getWaitingsByStudentAndPeriodOfTime(student1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.from setted should return the list of students', function(done) {
                const periodOfTime = {
                    from: moment().startOf('day').add(-2, 'day')
                };
                dao.getWaitingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.to setted return the list of students', function(done) {
                const periodOfTime = {
                    to: moment().endOf('day').add(-1, 'day')
                };
                dao.getWaitingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('both periodOfTime.from and periodOfTime.to setted  should return the list of students', function(done) {
                const periodOfTime = {
                    from: moment().add(-2, 'day').startOf('day'),
                    to: moment().add(3, 'day').endOf('day')
                };
                dao.getWaitingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('incorrect params should return an empty list', function(done) {
                dao.getWaitingsByStudentAndPeriodOfTime(wrongStudent)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('lectureHasFreeSeats', function() {
            it('correct params should return the number of seats', function(done) {
                dao.lectureHasFreeSeats(lecture1)
                    .then((nSeats) => {
                        assert.strictEqual(nSeats, 9, 'Wrong number of free seats');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('wrong params should fail', function(done) {
                dao.lectureHasFreeSeats(wrongLecture)
                    .then((nSeats) => done('This must fail!'))
                    .catch((err) => done()); // correct case
            });
        });

        describe('getClassByDescription', function() {
            it('correct params should return the class', function(done) {
                dao.getClassByDescription(class1)
                    .then((class_) => {
                        assert.strictEqual(class_.classId, class1.classId, 'Wrong class returned');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('wrong params should reject the request', function(done) {
                dao.getClassByDescription(wrongClass)
                    .then((class_) => done('This must fail'))
                    .catch((err) => done()); // correct case
            });
        });

        describe('addLecture', function() {
            it('correct params should accept the request', function(done) {
                dao.addLecture(newLecture)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'The lecture has not been inserted');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });
        });

        describe('_getCalendars', function() {
            it('correct params should return the list of calendars', function(done) {
                dao._getCalendars()
                    .then((calendars) => {
                        assert.strictEqual(calendars.length, 5, 'Wrong number of calendars');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });
        });

        describe('_generateDatesBySchedule', function() {
            it('correct params should return a list of dates', function(done) {
                dao._generateDatesBySchedule(newSchedule)
                    .then((dates) => {
                        assert.ok(dates.length > 0, 'No date has been generated');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it('wrong params should return an empty list', function(done) {
                dao._generateDatesBySchedule(wrongSchedule)
                    .then((dates) => {
                        assert.strictEqual(dates.length, 0, 'No date should be generated');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(); // correct case
                    });
            });
        });

        describe('_deleteLecturesBySchedule', function() {
            it('correct params should reject the request or fail', function(done) {
                dao._generateLecturePrototypeBySchedule(schedule5)
                    .then((lecturePrototype) => {
                        dao._deleteLecturesBySchedule(schedule5, lecturePrototype)
                        .then((nLectures) => {
                            assert.ok(nLectures > 0, 'No lecture has been removed');
                            done();
                        })
                        .catch((err) => done()); // correct case
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it('wrong params should return the number of removed lectures or fail', function(done) {
                dao._deleteLecturesBySchedule(wrongSchedule, wrongLecturePrototype)
                    .then((nLectures) => {
                        assert.strictEqual(nLectures, 0, 'No lecture should be removed');
                        done();
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('_generateLectureByScheduleAndPrototype', function() {
            it('correct params should return the number of generated lectures', function(done) {
                dao._generateLecturePrototypeBySchedule(newSchedule)
                    .then((lecturePrototype) => {
                        dao._generateLectureByScheduleAndPrototype(newSchedule, lecturePrototype)
                            .then((lectures) => {
                                assert.ok(lectures.length > 0, 'No lecture has been generated');
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });
        });

        describe('_addLecturesByScheduleAndPrototype', function() {
            it('correct params should return the number of inserted lectures', function(done) {
                dao._generateLecturePrototypeBySchedule(newSchedule)
                    .then((lecturePrototype) => {
                        dao._addLecturesByScheduleAndPrototype(newSchedule, lecturePrototype)
                            .then((nLectures) => {
                                assert.ok(nLectures > 0, 'No lecture has been inserted');
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it('wrong params should reject the request or fail', function(done) {
                dao._addLecturesByScheduleAndPrototype(wrongSchedule, wrongLecturePrototype)
                    .then((nLectures) => {
                        assert.strictEqual(nLectures, 0, 'No lecture should be inserted');
                        done();
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('_generateClassBySchedule', function() {
            it('non existing class should accept the request', function(done) {
                dao._generateClassBySchedule(newSchedule) // this schedule does not exists in the DB
                    .then((retVal) => {
                        assert.ok(retVal, 1, 'The class has not been inserted');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('existing class should no modify the DB', function(done) {
                dao._generateClassBySchedule(schedule1) // this schedule already exists in the DB
                    .then((retVal) => {
                        assert.strictEqual(retVal, 0, 'The class should not be inserted');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err)
                    });
            });
        });

        describe('_generateCourseBySchedule', function() {
            // IMPORTANT: REMOVED FEATURE
            // it('non existing course should accept the request', function(done) {
            //     dao._generateCourseBySchedule(newSchedule) // this schedule does not exists in the DB
            //         .then((retVal) => {
            //             assert.strictEqual(retVal, 1, 'The course has not been inserted');
            //             done();
            //         })
            //         .catch((err) => done(err));
            // });

            it('existing course should no modify the DB', function(done) {
                dao._generateCourseBySchedule(schedule1) // this schedule already exists in the DB
                    .then((retVal) => {
                        assert.strictEqual(retVal, 0, 'The course should not be inserted');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err)
                    });
            });
        });

        describe('_generateLecturePrototypeBySchedule', function() {
            it('correct schedule should return a lecture prototype', function(done) {
                newSchedule.code = course1.code;
                console.log("TEST - newSchedule");
                console.log(newSchedule);
                dao._generateLecturePrototypeBySchedule(newSchedule)
                    .then((lecturePrototype) => {
                        console.log(lecturePrototype);
                        assert.strictEqual(lecturePrototype.courseId, course1.courseId, 'The generated lecture prototype is wrong');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('wrong schedule should reject the request', function(done) {
                dao._generateLecturePrototypeBySchedule(wrongSchedule)
                    .then((lecturePrototype) => {
                        console.log(lecturePrototype);
                        done('This must fail!');
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('_generateLecturesBySchedule', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should return the number of generated lectures', function(done) {
                dao._generateLecturesBySchedule(newSchedule)
                    .then((nLectures) => {
                        assert.ok(nLectures > 0, 'No lectures has been generated');
                        done();
                    })
                    .catch((err) => done(err));
            });

            // INVALID CASES: TRIGGER CHECKS ONLY ON SCHEDULE
            // 
            // it('overlapping schedule of the same course should return the number of generated lectures', function(done) {
            //     dao._generateLecturesBySchedule(overlappedScheduleSameCourse)
            //         .then((nLectures) => {
            //             assert.ok(!nLectures, `No lectures should be generated, but nLectures was ${nLectures}`);
            //             done();
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //             done(err);
            //         });
            // });
            // it('overlapping schedule of a different course should return the number of generated lectures', function(done) {
            //     dao._generateLecturesBySchedule(overlappedScheduleDifferentCourse)
            //         .then((nLectures) => {
            //             assert.ok(!nLectures, `No lectures should be generated, but nLectures was ${nLectures}`);
            //             done();
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //             done(err);
            //         });
            // });
        });

        describe('getSchedules', function() {
            it('correct params should return the list of schedules', function(done) {
                dao.getSchedules()
                    .then((schedules) => {
                        assert.strictEqual(schedules.length, 5, 'Wrong number of schedules');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('updateSchedule', function() {
            it('existing schedule with correct new params should update the schedule', function(done) {
                const updatedSchedule = Schedule.from(schedule1);
                updatedSchedule.roomId = class3.description;

                dao.updateSchedule(updatedSchedule)
                    .then((nLectures) => {
                        assert.ok(nLectures > 0, 'No lecture updated'); // the exact number of lectures depends on the date you run tests
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it('wrong schedule should reject the request', function(done) {
                dao.updateSchedule(wrongSchedule)
                    .then((nLectures) => done('This must fail!'))
                    .catch((err) => done()); // correct case
            });

            it('correct schedule but overlapped with another one of the same course should reject the request', function(done) {
                dao.updateSchedule(overlappedScheduleSameCourse)
                    .then((nLectures) => done('This must fail!'))
                    .catch((err) => done()); // correct case
            });

            it('correct schedule but overlapped with another one of a different course in the same class should reject the request', function(done) {
                dao.updateSchedule(overlappedScheduleDifferentCourse)
                    .then((nLectures) => done('This must fail!'))
                    .catch((err) => done()); // correct case
            });
        });

        describe('getClasses', function() {
            it('should return the correct number of classes', function(done) {
                dao.getClasses()
                    .then((classes) => {
                        assert.ok(classes.length, 3, 'Wrong number of classes retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
}

module.exports = suite;
