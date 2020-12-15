DELETE FROM User;
DELETE FROM Course;
DELETE FROM TeacherCourse;
DELETE FROM Class;
DELETE FROM Lecture;
DELETE FROM Booking;
DELETE FROM Enrollment;
DELETE FROM EmailQueue;

INSERT INTO User(userId, type, firstName, lastName, email, password,ssn) VALUES(1, 'STUDENT', 'Aldo', 'Baglio', 'ulric.kaven@extraale.com', 'aldo','aldo1');
INSERT INTO User(userId, type, firstName, lastName, email, password,ssn) VALUES(2, 'STUDENT', 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni','giovanni2');
INSERT INTO User(userId, type, firstName, lastName, email, password,ssn) VALUES(3, 'STUDENT', 'Silvana', 'Fallisi', 'silvana.fallisi@agg.it', 'silvana','silvana3');

INSERT INTO Course(courseId, description, year) VALUES(1, 'Software enginnering 2', 1);
INSERT INTO Course(courseId, description, year) VALUES(2, 'Computer system security', 1);
INSERT INTO Course(courseId, description, year) VALUES(3, 'Machine learning and artificial intelligence', 2);
INSERT INTO Course(courseId, description, year) VALUES(4, 'Web application', 2);
INSERT INTO Course(courseId, description, year) VALUES(5, 'Formal languages and compilers', 1);
INSERT INTO Course(courseId, description, year) VALUES(6, 'Big data', 2);

INSERT INTO User(userId, type, firstName, lastName, email, password,ssn) VALUES(4, 'TEACHER', 'Giacomo', 'Poretti', 'jamaree.bretley@extraale.com', 'giacomo','giacomo4');
INSERT INTO User(userId, type, firstName, lastName, email, password,ssn) VALUES(5, 'TEACHER', 'Marina', 'Massironi', 'enis.laron@extraale.com', 'marina','marina5');

INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 1, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 2, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 3, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 4, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 5, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 6, 1);

INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 6, 2020);

INSERT INTO Class(classId, description, capacity) VALUES(1, '1A', 10);
INSERT INTO Class(classId, description, capacity) VALUES(2, '2B', 10);
INSERT INTO Class(classId, description, capacity) VALUES(3, '3C', 10);

INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(1, 1, 1, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(4, 1, 3, DATETIME('now', '+2 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', '1 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(2, 2, 2, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(3, 3, 3, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(5, 6, 3, DATETIME('now', '-2 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-3 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');

INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 1, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 4, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 2, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 3, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 5, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 5, 'PRESENT');

INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(6, 'STUDENT', 'Fake', 'Student', 'fakeStudent.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(7, 'TEACHER', 'Fake', 'Teacher', 'fakeTeacher.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');

INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(1, 'test sender', 'test recipient', 'Software enginnering 2', 'STUDENT_NEW_BOOKING', 4, 1, 1, 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));
INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(2, 'test sender', 'test recipient', 'Software enginnering 2', 'LESSON_CANCELLED', 4, 1, 1, 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));
INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(3, 'test sender', 'test recipient', 'Software enginnering 2', 'TEACHER_ATTENDING_STUDENTS', 4, 1, 1, 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));

DROP trigger IF EXISTS delete_bookings_after_delete_lecture;
CREATE TRIGGER delete_bookings_after_delete_lecture BEFORE DELETE ON Lecture BEGIN INSERT INTO EmailQueue(sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) SELECT TempLecture.email, User.email, "LESSON_CANCELLED", TempLecture.teacherId, Booking.studentId, TempLecture.courseId, TempLecture.description, TempLecture.lectureId, TempLecture.startingDate FROM Booking, (SELECT * FROM Lecture, Course, TeacherCourse, User WHERE Lecture.lectureId = OLD.lectureId AND Lecture.courseId = TeacherCourse.courseId AND TeacherCourse.teacherId = User.userId AND Course.courseId = Lecture.courseId) AS TempLecture, User WHERE Booking.lectureId = OLD.lectureId AND Booking.studentId = User.userId AND Booking.lectureId = TempLecture.lectureId; DELETE FROM Booking WHERE Booking.lectureId = OLD.lectureId; END;
