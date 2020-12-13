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
const prepare = require('../src/db/preparedb.js');
const { fail } = require('assert');

const suite = function() {
    describe('Dao', function() {
        let student1, student2;
        let teacher4;
        let lecture1, lecture2, lecture3;
        let course1, course3;
        let emailQueue1;

        let wrongLecture;
        let wrongCourse;
        let wrongStudent;

        before(function(done) {
            done();
        });

        beforeEach(function(done) {
            reset(done);
        });

        const reset = (done) => {
            student1 = new Student(1, 'Aldo', 'Baglio');
            student2 = new Student(2, 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');
            teacher4 = new Teacher(4);
            lecture2 = new Lecture(2);
            lecture1 = new Lecture(1, 1, 1);
            lecture3 = new Lecture(3);
            course1 = new Course(1);
            course3 = new Course(3);
            emailQueue1 = new EmailQueue(1);

            wrongStudent = new Student(-1);
            wrongLecture = new Lecture(-1, -1);
            wrongCourse = new Course(-1);

            prepare('testing.db', 'testing.sql', false)
                .then(() => done())
                .catch((err) => done(err));
        }

        describe('login', function() {
            it('correct data should perform login', function(done) {
                dao.login(student2)
                    .then((retStudent) => {
                        assert.strictEqual(retStudent.studentId, student2.studentId, 'Wrong user retrieved');
                        done()
                    })
                    .catch((err) => done(err));
            });

            it('incorrect data should not perform login', function(done) {
                dao.login(new Student(-1, 'invalid', 'invalid', 'invalid', 'invalid'))
                    .then((retStudent) => {
                        done('No user should be retrieved');
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('addBooking', function() {
            it('correct data should insert a new booking', function(done) {
                dao.addBooking(student1, lecture2)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'Booking not added');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByStudent', function() {
            it('non empty lecture should get the list of students', function(done) {
                dao.getLecturesByStudent(student1)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 3, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getCoursesByStudent', function() {
            it('non empty course should get the list of students', function(done) {
                dao.getCoursesByStudent(student2)
                    .then((courses) => {
                        assert.ok(courses, 'No returned valued received');
                        assert.strictEqual(courses.length, 1, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourse', function() {
            it('non empty course should get the list of lectures', function(done) {
                dao.getLecturesByCourse(course3)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getStudentsByLecture', function() {
            it('non empty lecture should get the list of students', function(done) {
                dao.getStudentsByLecture(lecture3)
                    .then((students) => {
                        assert.ok(students, 'No returned valued received');
                        assert.ok(students.length === 1, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getStudentsByCourse', function() {
            it('non empty coure should get the list of students', function(done) {
                dao.getStudentsByCourse(course3)
                    .then((students) => {
                        assert.ok(students, 'No returned valued received');
                        assert.ok(students.length === 3, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByTeacher', function() {
            it('non empty teacher should get the list of lectures', function(done) {
                dao.getLecturesByTeacher(teacher4)
                    .then((lectures) => {
                        assert.ok(lectures, 'No returned valued received');
                        assert.ok(lectures.length === 3, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getCoursesByTeacher', function() {
            it('non empty teacher should get the list of courses', function(done) {
                dao.getCoursesByTeacher(teacher4)
                    .then((courses) => {
                        assert.ok(courses, 'No returned valued received');
                        assert.ok(courses.length == 2, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('_getCurrentAcademicYear', function() {
            it('should get this year', function(done) {
                const retVal = dao._getCurrentAcademicYear();
                assert.ok(retVal === 2020, 'Wrong academic year'); // check this manually
                done();
            });
        });

        describe('addEmail', function() {
            it('correct data should insert a new email', function(done) {
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

        describe('deleteBooking', function() {
            it('correct params should remove the booking', function(done) {
                dao.deleteBooking(student1, lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Booking not inserted');
                        done();
                    })
                    .catch((err) => done());
            });

            it('non existing student should reject the request', function(done) {
                dao.deleteBooking(-1, lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Not booking should be deleted');
                        done()
                    })
                    .catch((err) => done());
            });
        });

        describe('getBookingsByStudent', function() {
            it('correct params should return the list of lectures', function(done) {
                dao.getBookingsByStudent(student2)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done());
            });

            it('non existing student should return an empty list', function(done) {
                dao.getBookingsByStudent(-1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done());
            });
        });

        describe('getBookingsByStudentAndPeriodOfTime', function() {
            it('not specified period of time should return the list of lectures', function(done) {
                dao.getBookingsByStudentAndPeriodOfTime(student1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.from setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    from : moment().startOf('day').add(2, 'day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.to setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    to : moment().endOf('day').add(1, 'day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('both periodOfTime.from and periodOfTime.to setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    from : moment().add(2, 'day').startOf('day'),
                    to : moment().add(3, 'day').endOf('day')
                };
                dao.getBookingsByStudentAndPeriodOfTime(student1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourseAndPeriodOfTime', function() {
            it('not specified period of time should return the list of lectures', function(done) {
                dao.getLecturesByCourseAndPeriodOfTime(course1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.from setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    from : moment().startOf('day').add(2, 'day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('only periodOfTime.to setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    to : moment().endOf('day').add(1, 'day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('both periodOfTime.from and periodOfTime.to setted should return the list of lectures', function(done) {
                const periodOfTime = {
                    from : moment().add(2, 'day').startOf('day'),
                    to : moment().add(3, 'day').endOf('day')
                };
                dao.getLecturesByCourseAndPeriodOfTime(course1, periodOfTime)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLectureById', function() {
            it('correct params should return a lecture', function(done) {
                dao.getLectureById(lecture1)
                    .then((lecture) => {
                        assert.strictEqual(lecture.lectureId, lecture1.lectureId, 'Incorrect lectureId');
                        assert.strictEqual(lecture.courseId, lecture1.courseId, 'Incorrect courseId');
                        assert.strictEqual(lecture.classId, lecture1.classId, 'Incorrect classId');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('wrong params should return an error', function(done) {
                dao.getLectureById({ lectureId : -1 })
                    .then((lecture) => {
                        done('This must fail');
                    })
                    .catch((err) => done()); // correct case
            });
        });

        describe('deleteLectureById', function() {
            it('correct params should accept the request', function(done) {
                dao.deleteLectureById(lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Lecture not deleted');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing lecture should deny the request', function(done) {
                dao.deleteLectureById({ lectureId : -1 })
                .then((modifiedRows) => {
                    assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                    done();
                })
                .catch((err) => done(err));
            });
        });

        describe('deleteEmailQueueById', function() {
            it('correct params should accept the request', function(done) {
                dao.deleteEmailQueueById(emailQueue1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Email queue not deleted');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('incorrect params should deny the request', function(done) {
                dao.deleteEmailQueueById({ queueId : -1 })
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getEmailsInQueueByEmailType', function() {
            it('correct params should return the list of email queues', function(done) {
                dao.getEmailsInQueueByEmailType(Email.EmailType.LESSON_CANCELLED)
                    .then((emailQueues) => {
                        assert.strictEqual(emailQueues.length, 1, 'Wrong number of email queues');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing email type should return an empty list', function(done) {
                dao.getEmailsInQueueByEmailType('Unexisting type')
                    .then((emailQueues) => {
                        assert.strictEqual(emailQueues.length, 0, 'Wrong number of email queues');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('updateLectureDeliveryMode', function() {
            it('correct params should accept the request', function(done) {
                lecture1.delivery = Lecture.DeliveryType.REMOTE;
                dao.updateLectureDeliveryMode(lecture1)
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 1, 'Lecture not updated');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing lecture should deny the request', function(done) {
                dao.updateLectureDeliveryMode({ lectureId : -1, delivery : Lecture.DeliveryType.REMOTE })
                    .then((modifiedRows) => {
                        assert.strictEqual(modifiedRows, 0, 'Wrong DB content modified');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCoursePlusNumBookings', function() {
            it('correct params should return a complex list', function(done) {
                dao.getLecturesByCoursePlusNumBookings(course1)
                    .then((list) => {
                        assert.ok(list);
                        assert.ok(list[0]);
                        assert.strictEqual(list.length, 2, 'Wrong number of lectures');
                        
                        for(let currItem of list) {
                            switch(currItem.lecture.lectureId) {
                                case 1:
                                    assert.strictEqual(currItem.numBookings, 1, 'Wrong number of bookings');
                                    break;
                                case 4:
                                    assert.strictEqual(currItem.numBookings, 0, 'Wrong number of bookings');
                                    break;
                                default:
                                    fail('unexpected lecture');
                            }
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing course should return an empty list', function(done) {
                dao.getLecturesByCoursePlusNumBookings({ courseId : -1 })
                    .then((list) => {
                        assert.ok(list);
                        assert.strictEqual(list.length, 0, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getNumBookingsOfLecture', function() {
            it('correct params should return the number of bookings', function(done) {
                dao.getNumBookingsOfLecture(lecture2)
                    .then((nBooking) => {
                        assert.strictEqual(nBooking, 1, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('non existing lecture should return zero', function(done) {
                dao.getNumBookingsOfLecture(wrongLecture)
                    .then((nBooking) => {
                        assert.strictEqual(nBooking, 0, 'Wrong number of bookings');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('getLecturesByCourseId', function() {
            it('correct params should return a list of lectures', function(done) {
                dao.getLecturesByCourseId(course1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 2, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('non existing course should return an empty list', function(done) {
                dao.getLecturesByCourseId(wrongCourse)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('managerGetReport', function() {
            it('correct params should return the list of users', function(done) {
                dao.managerGetReport(student1)
                    .then((users) => {
                        console.log(users);
                        assert.strictEqual(users.length, 2, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('not existing student params should return an empty list', function(done) {
                dao.managerGetReport(wrongStudent)
                    .then((users) => {
                        assert.strictEqual(users.length, 0, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
}
module.exports = suite;