DELETE FROM Booking;
DELETE FROM Enrollment;
DELETE FROM EmailQueue;
DELETE FROM Email;
DELETE FROM WaitingList;
DELETE FROM Lecture;
DELETE FROM Class;
DELETE FROM Schedule;
DELETE FROM TeacherCourse;
DELETE FROM Course;
DELETE FROM User;
DELETE FROM Calendar;

INSERT INTO User(userId, type, firstName, lastName, email, password, ssn, city, serialNumber, birthday) VALUES(1, 'STUDENT', 'Aldo', 'Baglio', 'tjw85.student.baglio@inbox.testmail.app', 'aldo', 'aldo1', 'Turin', '1', DATETIME('now', '-20 year', 'start of day'));
INSERT INTO User(userId, type, firstName, lastName, email, password, ssn, city, serialNumber, birthday) VALUES(2, 'STUDENT', 'Giovanni', 'Storti', 'tjw85.student.storti@inbox.testmail.app', 'giovanni', 'giacomo2', 'Turin', '2', DATETIME('now', '-20 year', 'start of day'));
INSERT INTO User(userId, type, firstName, lastName, email, password, ssn, city, serialNumber, birthday) VALUES(3, 'STUDENT', 'Silvana', 'Fallisi', 'tjw85.student.fallisi@inbox.testmail.app', 'silvana', 'silvana3', 'Turin', '3', DATETIME('now', '-20 year', 'start of day'));

INSERT INTO Course(courseId, description, year, code, semester) VALUES(1, 'Software enginnering 2', 1, '1', '1');
INSERT INTO Course(courseId, description, year, code, semester) VALUES(2, 'Computer system security', 1, '2', '1');
INSERT INTO Course(courseId, description, year, code, semester) VALUES(3, 'Machine learning and artificial intelligence', 2, '3', '2');
INSERT INTO Course(courseId, description, year, code, semester) VALUES(4, 'Web application', 2, '4', '1');
INSERT INTO Course(courseId, description, year, code, semester) VALUES(5, 'Formal languages and compilers', 1, '5', '1');
INSERT INTO Course(courseId, description, year, code, semester) VALUES(6, 'Big data', 2, '6', '1');

INSERT INTO User(userId, type, firstName, lastName, email, password, ssn, city, serialNumber, birthday) VALUES(4, 'TEACHER', 'Giacomo', 'Poretti', 'tjw85.teacher.poretti@inbox.testmail.app', 'giacomo', 'giacomo4', 'Turin', '4', DATETIME('now', '-20 year', 'start of day'));
INSERT INTO User(userId, type, firstName, lastName, email, password, ssn, city, serialNumber, birthday) VALUES(5, 'TEACHER', 'Marina', 'Massironi', 'tjw85.teacher.massironi@inbox.testmail.app', 'marina', 'marina5', 'Turin', '5', DATETIME('now', '-20 year', 'start of day'));

INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 1, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 2, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 3, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 4, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(5, 5, 1);
INSERT INTO TeacherCourse(teacherId, courseId, isValid) VALUES(4, 6, 1);

INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 1, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 2, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 5, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(1, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(2, 6, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 3, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 4, 2020);
INSERT INTO Enrollment(studentId, courseId, year) VALUES(3, 6, 2020);

INSERT INTO Class(classId, description, capacity) VALUES(1, '1A', 10);
INSERT INTO Class(classId, description, capacity) VALUES(2, '2B', 10);
INSERT INTO Class(classId, description, capacity) VALUES(3, '3C', 10);

INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(1, 1, 1, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(2, 2, 2, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(3, 3, 3, DATETIME('now', '+1 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(4, 1, 3, DATETIME('now', '+2 day', 'start of day', '10 hours', '00 minutes'), 1000*60*90, DATETIME('now', '1 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(5, 6, 3, DATETIME('now', '-2 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', '-3 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(6, 6, 3, DATETIME('now', '+2 day', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', '+1 day', 'start of day', '23 hours', '59 minutes'), 'PRESENCE');

INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 1, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 4, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(1, 5, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 2, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(2, 5, 'PRESENT');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 3, 'BOOKED');
INSERT INTO Booking(studentId, lectureId, status) VALUES(3, 6, 'BOOKED');

INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(6, 'STUDENT', 'Fake', 'Student', 'fakeStudent.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');
INSERT INTO User(userId, type, firstName, lastName, email, password) VALUES(7, 'TEACHER', 'Fake', 'Teacher', 'fakeTeacher.se2@gmail.com', 'anvzRPuDd1mvCXJBfn');

INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(1, 'test sender', 'test recipient', 'STUDENT_NEW_BOOKING', 4, 1, 1, 'Software enginnering 2', 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));
INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(2, 'test sender', 'test recipient', 'LESSON_CANCELLED', 4, 1, 1, 'Software enginnering 2', 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));
INSERT INTO EmailQueue(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) VALUES(3, 'test sender', 'test recipient', 'TEACHER_ATTENDING_STUDENTS', 4, 1, 1, 'Software enginnering 2', 1, DATETIME('now', '-1 day', 'start of day', '8 hours', '30 minutes'));

INSERT INTO WaitingList(studentId, lectureId, date) VALUES(1, 6, DATETIME('now'));
INSERT INTO WaitingList(studentId, lectureId, date) VALUES(2, 6, DATETIME('now', '-1 hour'));

INSERT INTO Schedule(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) VALUES(1, '1', '2020', '1', '1A', '10', 'Mon', DATETIME('08:30'), DATETIME('10:00'));
INSERT INTO Schedule(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) VALUES(2, '2', '2020', '1', '2B', '10', 'Mon', DATETIME('08:30'), DATETIME('10:00'));
INSERT INTO Schedule(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) VALUES(3, '3', '2020', '2', '3C', '10', 'Mon', DATETIME('08:30'), DATETIME('10:00'));
INSERT INTO Schedule(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) VALUES(4, '4', '2020', '2', '9Z', '10', 'Tue', DATETIME('08:30'), DATETIME('10:00'));
INSERT INTO Schedule(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) VALUES(5, '5', '2020', '1', '2B', '10', 'Tue', DATETIME('08:30'), DATETIME('10:00'));

-- Lecture related to schedules
-- weekday: 0 Sunday, 1 Monday, 2 Tuesday ...
INSERT INTO Lecture(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery) VALUES(8, 4, 2, DATETIME('now', 'weekday 1', 'start of day', '8 hours', '30 minutes'), 1000*60*90, DATETIME('now', 'weekday 1', 'start of day', '23 hours', '00 minutes'), 'PRESENCE');

INSERT INTO Calendar(calendarId, startingDate, endingDate, type, isAValidPeriod) VALUES(1, DATETIME('now', '-1 month', 'start of day'), DATETIME('now', '+8 month', 'start of day'), 'ACADEMIC_YEAR', 1);
INSERT INTO Calendar(calendarId, startingDate, endingDate, type, isAValidPeriod) VALUES(2, DATETIME('now', '-1 month', 'start of day'), DATETIME('now', '+3 month', 'start of day'), 'SEMESTER', 1);
INSERT INTO Calendar(calendarId, startingDate, endingDate, type, isAValidPeriod) VALUES(3, DATETIME('now', '+4 month', 'start of day'), DATETIME('now', '+8 month', 'start of day'), 'SEMESTER', 1);
INSERT INTO Calendar(calendarId, startingDate, endingDate, type, isAValidPeriod) VALUES(4, DATETIME('now', '+7 day', 'start of day'), DATETIME('now', '+14 day', 'start of day'), 'HOLIDAYS', 0);
INSERT INTO Calendar(calendarId, startingDate, endingDate, type, isAValidPeriod) VALUES(5, DATETIME('now', '+30 day', 'start of day'), DATETIME('now', '+32 day', 'start of day'), 'HOLIDAYS', 0);

DROP TRIGGER IF EXISTS check_time_overlapping_before_insert_schedule;
CREATE TRIGGER check_time_overlapping_before_insert_schedule
	BEFORE INSERT ON Schedule
	BEGIN
		SELECT CASE WHEN (
            SELECT COUNT(*) <> 0
                FROM Schedule
                WHERE
                    code = NEW.code
                    AND scheduleId <> NEW.scheduleId
                    AND dayOfWeek = NEW.dayOfWeek
                    AND DATETIME(NEW.startingTime) < DATETIME(endingTime)
                    AND DATETIME(NEW.endingTime) > DATETIME(startingTime) )
			THEN RAISE(ABORT, 'New schedule overlapped with an existing one with the same code')
		END IF;
		SELECT CASE WHEN (
            SELECT COUNT(*) <> 0
                FROM Schedule
                WHERE
                    code <> NEW.code
                    AND roomId = NEW.roomId
                    AND AAyear = NEW.AAyear
                    AND semester = NEW.semester
                    AND dayOfWeek = NEW.dayOfWeek
                    AND DATETIME(NEW.startingTime) < DATETIME(endingTime)
                    AND DATETIME(NEW.endingTime) > DATETIME(startingTime) )
			THEN RAISE(ABORT, 'New schedule overlapped with an existing one in the same class')
		END IF;
	END;

DROP TRIGGER IF EXISTS check_time_overlapping_before_update_schedule;
CREATE TRIGGER check_time_overlapping_before_update_schedule
	BEFORE UPDATE ON Schedule
	BEGIN
		SELECT CASE WHEN (
            SELECT COUNT(*) <> 0 FROM Schedule
                WHERE
                    code = NEW.code
                    AND scheduleId <> NEW.scheduleId
                    AND dayOfWeek = NEW.dayOfWeek
                    AND DATETIME(NEW.startingTime) < DATETIME(endingTime)
                    AND DATETIME(NEW.endingTime) > DATETIME(startingTime) )
			THEN RAISE(ABORT, 'New schedule overlapped with an existing one with the same code')
		END IF;
		SELECT CASE WHEN (
            SELECT COUNT(*) <> 0 FROM Schedule
                WHERE
                    code <> NEW.code
                    AND roomId = NEW.roomId
                    AND AAyear = NEW.AAyear
                    AND semester = NEW.semester
                    AND dayOfWeek = NEW.dayOfWeek
                    AND DATETIME(NEW.startingTime) < DATETIME(endingTime)
                    AND DATETIME(NEW.endingTime) > DATETIME(startingTime) )
			THEN RAISE(ABORT, 'New schedule overlapped with an existing one in the same class')
		END IF;
	END;

DROP trigger IF EXISTS delete_bookings_after_delete_lecture;
CREATE TRIGGER delete_bookings_after_delete_lecture
    BEFORE DELETE ON Lecture
    BEGIN
        INSERT INTO EmailQueue(sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate)
            SELECT TempLecture.email, User.email, "LESSON_CANCELLED", TempLecture.teacherId, Booking.studentId, TempLecture.courseId, TempLecture.description, TempLecture.lectureId, TempLecture.startingDate
                FROM Booking, (
                    SELECT * FROM Lecture, Course, TeacherCourse, User
                        WHERE Lecture.lectureId = OLD.lectureId
                            AND Lecture.courseId = TeacherCourse.courseId
                            AND TeacherCourse.teacherId = User.userId
                            AND Course.courseId = Lecture.courseId
                    ) AS TempLecture, User
                WHERE Booking.lectureId = OLD.lectureId
                    AND Booking.studentId = User.userId
                    AND Booking.lectureId = TempLecture.lectureId;
        DELETE FROM Booking
            WHERE Booking.lectureId = OLD.lectureId;
        DELETE FROM WaitingList
            WHERE WaitingList.lectureId = OLD.lectureId;
    END;
