DELETE FROM User;
DELETE FROM Course;
DELETE FROM TeacherCourse;
DELETE FROM Class;
DELETE FROM Lecture;
DELETE FROM Booking;
DELETE FROM Enrollment;

INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(1, 'STUDENT', 'Aldo', 'Baglio', 'fakeStudent.se2@gmail.com', 'aldo');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(2, 'STUDENT', 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(3, 'STUDENT', 'Silvana', 'Fallisi', 'silvana.fallisi@agg.it', 'silvana');

INSERT INTO Course(courseId, description, year) VALUES(1, 'Software enginnering 2', 2020);
INSERT INTO Course(courseId, description, year) VALUES(2, 'Computer system security', 2020);
INSERT INTO Course(courseId, description, year) VALUES(3, 'Machine learning and artificial intelligence', 2020);
INSERT INTO Course(courseId, description, year) VALUES(4, 'Web application', 2020);
INSERT INTO Course(courseId, description, year) VALUES(5, 'Big data', 2020);

INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(4, 'TEACHER', 'Giacomo', 'Poretti', 'fakeTeacher.se2@gmail.com', 'giacomo');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(5, 'TEACHER', 'Marina', 'Massironi', 'enis.laron@extraale.com', 'marina');

INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 1, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 2, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 3, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 4, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 5, 1);

INSERT INTO Enrollment(studentId, courseId) VALUES(1, 1);
INSERT INTO Enrollment(studentId, courseId) VALUES(1, 2);
INSERT INTO Enrollment(studentId, courseId) VALUES(1, 3);
INSERT INTO Enrollment(studentId, courseId) VALUES(2, 3);
INSERT INTO Enrollment(studentId, courseId) VALUES(3, 3);
INSERT INTO Enrollment(studentId, courseId) VALUES(3, 4);

INSERT INTO Class(classId, description) VALUES(1, '1A');
INSERT INTO Class(classId, description) VALUES(2, '2B');
INSERT INTO Class(classId, description) VALUES(3, '3C');

INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(1, 1, 1, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 1);
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(4, 1, 3, DATETIME('now', '+2 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', '1 day', 'start of day', '23 hours', '59 minutes'), 1);
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(2, 2, 2, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 2);
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(3, 3, 3, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 2);
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(5, 1, 1, DATETIME('now', '+5 day', 'start of day', '17 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-1 day', 'start of day', '23 hours', '59 minutes'), 1);

INSERT INTO Booking(studentId, lectureId) VALUES(1, 1);
INSERT INTO Booking(studentId, lectureId) VALUES(2, 2);
INSERT INTO Booking(studentId, lectureId) VALUES(3, 3);

INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(6, 'STUDENT', 'Fake', 'Student', 'fakeStudent.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(7, 'TEACHER', 'Fake', 'Teacher', 'fakeTeacher.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');
