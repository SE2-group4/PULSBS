-- created and filled by Gastaldi Paolo
-- check sections before modify
-- please modify only the << Special cases >> section, not << Default values >>
-- read comments to understand data insertion rules

-- << Reset DB >>

DELETE FROM User;
DELETE FROM Course;
DELETE FROM TeacherCourse;
DELETE FROM Class;
DELETE FROM Lecture;
DELETE FROM Booking;
DELETE FROM Enrollment;
DELETE FROM EmailQueue;
DELETE FROM WaitingList;

-- << Default values >>

-- Students
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(1, 'STUDENT', 'Aldo', 'Baglio', 'fakeStudent.se2@gmail.com', 'aldo');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(2, 'STUDENT', 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(3, 'STUDENT', 'Silvana', 'Fallisi', 'silvana.fallisi@agg.it', 'silvana');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(4, 'STUDENT', 'Gerri', 'Scotti', 'student4@test.it', 'student4');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(5, 'STUDENT', 'Pippo', 'Baudo', 'student5@test.it', 'student5');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(6, 'STUDENT', 'Ezio', 'Greggio', 'student6test.it', 'student6');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(7, 'STUDENT', 'Enzo', 'Iacchetti', 'student7@test.it', 'student7');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(8, 'STUDENT', 'Pippo', 'Franco', 'student8@test.it', 'student8');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(9, 'STUDENT', 'Maurizio', 'Costanzo', 'student9@test.it', 'student9');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(10, 'STUDENT', 'Fabio', 'Fazio', 'student10@test.it', 'student10');

-- Teachers
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(11, 'TEACHER', 'Giacomo', 'Poretti', 'fakeTeacher.se2@gmail.com', 'giacomo');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(12, 'TEACHER', 'Marina', 'Massironi', 'enis.laron@extraale.com', 'marina');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(13, 'TEACHER', 'Piero', 'Angela', 'teacher13@test.it', 'teacher13');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(14, 'TEACHER', 'Maurizio', 'Crozza', 'teacher14@test.it', 'teacher14');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(15, 'TEACHER', 'Vanessa', 'Incontrada', 'teacher15@test.it', 'teacher15');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(16, 'TEACHER', 'Mara', 'Venier', 'teacher16@test.it', 'teacher16');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(17, 'TEACHER', 'Carlo', 'Conti', 'teacher16@test.it', 'teacher16');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(18, 'TEACHER', 'Rosario', 'Fiorello', 'teacher18@test.it', 'teacher18');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(19, 'TEACHER', 'Amedeo', 'Umberto Rita', 'teacher19@test.it', 'teacher19');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(20, 'TEACHER', 'Michelle', 'Hunziker', 'teacher20@test.it', 'teacher20');

-- Managers
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(21, 'MANAGER', 'Bobo', 'Vieri', 'manager@test.it', 'manager');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(22, 'MANAGER', 'Antonella', 'Clerici', 'manager21@test.it', 'manager21');

-- Support officers
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(31, 'SUPPORT', 'Pino', 'Insegno', 'officer1@test.it', 'officer1');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(32, 'SUPPORT', 'Alberto', 'Angela', 'officer32@test.it', 'officer32');

-- Courses
INSERT INTO Course(courseId, description, year) VALUES(1, 'Software enginnering 2', 1);
INSERT INTO Course(courseId, description, year) VALUES(2, 'Computer system security', 1);
INSERT INTO Course(courseId, description, year) VALUES(3, 'Machine learning and artificial intelligence', 1);
INSERT INTO Course(courseId, description, year) VALUES(4, 'Web application', 1);
INSERT INTO Course(courseId, description, year) VALUES(5, 'Big data', 1);
INSERT INTO Course(courseId, description, year) VALUES(6, 'Optimization methods and algorithms', 1);
INSERT INTO Course(courseId, description, year) VALUES(7, 'System-on-chip architecture', 1);
INSERT INTO Course(courseId, description, year) VALUES(8, 'Human Computer Interaction', 1);
INSERT INTO Course(courseId, description, year) VALUES(9, 'Energy management for IoT', 1);
INSERT INTO Course(courseId, description, year) VALUES(10, 'GPU programming', 1);

-- TeacherCourse
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 1, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 2, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 5, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(12, 3, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 6, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 7, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(12, 8, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 9, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(11, 10, 1);

-- Enrollment
-- each student 'i' is enrolled in courses [i, (i+4)%10]
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 7, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(4, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(4, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(4, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(4, 7, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(4, 8, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(5, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(5, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(5, 7, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(5, 8, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(5, 9, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(6, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(6, 7, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(6, 8, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(6, 9, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(6, 10, 2020);

INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 7, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 8, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 9, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 10, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(7, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(8, 8, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(8, 9, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(8, 10, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(8, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(8, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(9, 9, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(9, 10, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(9, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(9, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(9, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(10, 10, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(10, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(10, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(10, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(10, 4, 2020);

-- Classes
INSERT INTO Class(classId, description, capacity) VALUES(1, '1A', 3);
INSERT INTO Class(classId, description, capacity) VALUES(2, '2A', 3);
INSERT INTO Class(classId, description, capacity) VALUES(3, '3A', 3);
INSERT INTO Class(classId, description, capacity) VALUES(4, '1B', 3);
INSERT INTO Class(classId, description, capacity) VALUES(5, '2B', 3);
INSERT INTO Class(classId, description, capacity) VALUES(6, '3B', 3);
INSERT INTO Class(classId, description, capacity) VALUES(7, '1C', 3);
INSERT INTO Class(classId, description, capacity) VALUES(8, '2C', 3);
INSERT INTO Class(classId, description, capacity) VALUES(9, '3C', 3);
INSERT INTO Class(classId, description, capacity) VALUES(10, '1D', 3);

-- Lectures
-- lectureId%10 = courseId
-- lectureId%3 == 0 ? REMOTE : PRESENCE

-- Future lectures
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(1, 1, 1, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(2, 2, 2, DATETIME('now', '+1 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(3, 3, 3, DATETIME('now', '+1 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(4, 4, 4, DATETIME('now', '+1 day', 'start of day', '17 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(5, 5, 5, DATETIME('now', '+1 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(6, 6, 6, DATETIME('now', '+1 day', 'start of day', '13 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(7, 7, 7, DATETIME('now', '+1 day', 'start of day', '16 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(8, 8, 8, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(9, 9, 9, DATETIME('now', '+1 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(10, 10, 10, DATETIME('now', '+3 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(11, 1, 1, DATETIME('now', '+3 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(12, 2, 2, DATETIME('now', '+3 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(13, 3, 3, DATETIME('now', '+3 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(14, 4, 4, DATETIME('now', '+3 day', 'start of day', '17 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(15, 5, 5, DATETIME('now', '+3 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(16, 6, 6, DATETIME('now', '+3 day', 'start of day', '13 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(17, 7, 7, DATETIME('now', '+3 day', 'start of day', '16 hours', '00 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(18, 8, 8, DATETIME('now', '+3 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(19, 9, 9, DATETIME('now', '+3 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(20, 10, 10, DATETIME('now', '+3 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');

-- Past lectures
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(21, 1, 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(22, 2, 2, DATETIME('now', '-1 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(23, 3, 3, DATETIME('now', '-1 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(24, 4, 4, DATETIME('now', '-1 day', 'start of day', '17 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(25, 5, 5, DATETIME('now', '-1 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(26, 6, 6, DATETIME('now', '-1 day', 'start of day', '13 hours', '00 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(27, 7, 7, DATETIME('now', '-1 day', 'start of day', '16 hours', '00 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'REMOTE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(28, 8, 8, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(29, 9, 9, DATETIME('now', '-1 day', 'start of day', '11 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(30, 10, 10, DATETIME('now', '-1 day', 'start of day', '14 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-2 day', 'start of day', '23 hours', '59 minutes'), 'REMOTE');

-- Booking
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 1, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 2, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 11, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 12, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 21, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 22, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 2, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 3, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 12, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 13, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 22, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 23, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 3, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 4, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 13, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 14, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 23, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 24, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 4, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 5, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 14, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 15, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 24, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(4, 25, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 5, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 6, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 15, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 16, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 25, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(5, 26, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 6, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 7, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 16, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 17, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 26, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(6, 27, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 7, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 8, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 17, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 18, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 27, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(7, 28, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 8, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 9, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 18, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 19, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 28, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(8, 29, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 9, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 10, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 19, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 20, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 29, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(9, 30, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 10, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 1, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 20, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 11, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 30, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(10, 21, 'PRESENT');

-- << Special cases >>

-- Full lecture 3 + waiting list
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 3, 'BOOKED');
 -- picked first
INSERT INTO WaitingList(studentId, lectureId, date) VALUES(2, 3, DATETIME('now', '-5 hour'));
INSERT INTO WaitingList(studentId, lectureId, date) VALUES(3, 3, DATETIME('now', '-1 hour'));

-- Full lecture 4 + waiting list
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 4, 'BOOKED');
INSERT INTO WaitingList(studentId, lectureId, date) VALUES(1, 4, DATETIME('now', '-1 hour'));
-- picked first
INSERT INTO WaitingList(studentId, lectureId, date) VALUES(10, 4, DATETIME('now', '-2 hour'));

-- More direct contacts for student 1 report
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 5, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 5, 'PRESENT');

-- << Triggers >>

DROP trigger IF EXISTS delete_bookings_after_delete_lecture;
CREATE TRIGGER delete_bookings_after_delete_lecture BEFORE DELETE ON Lecture BEGIN INSERT INTO EmailQueue(sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) SELECT TempLecture.email, User.email, "LESSON_CANCELLED", TempLecture.teacherId, Booking.studentId, TempLecture.courseId, TempLecture.description, TempLecture.lectureId, TempLecture.startingDate FROM Booking, (SELECT * FROM Lecture, Course, TeacherCourse, User WHERE Lecture.lectureId = OLD.lectureId AND Lecture.courseId = TeacherCourse.courseId AND TeacherCourse.teacherId = User.userId AND Course.courseId = Lecture.courseId) AS TempLecture, User WHERE Booking.lectureId = OLD.lectureId AND Booking.studentId = User.userId AND Booking.lectureId = TempLecture.lectureId; DELETE FROM Booking WHERE Booking.lectureId = OLD.lectureId; END;
