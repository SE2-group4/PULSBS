# Manual tests

These tests have been performed manually due very difficult procedures to automate or for a lack of time.

## Support officer

### Update schedule - check update and winter/summer time adaptations

**Get all the generated lectures referred to that schedule:**
```
SELECT Lecture.* FROM Lecture
	JOIN Course On Lecture.courseId = Course.courseId
	JOIN Schedule ON Course.code = Schedule.code
	WHERE Schedule.code = 'XY1211'
	GROUP BY Lecture.lectureId
	ORDER BY Lecture.startingDate;
```

**Check if some lectures still exists (so the delete has not worked):**
```
SELECT * FROM Lecture
            WHERE courseId = 1513
                AND STRFTIME('%w', startingDate) = STRFTIME('%w', DATETIME('2021-01-11T16:37:00.905Z', 'localtime'))
                AND STRFTIME('%H', startingDate) = STRFTIME('%H', DATETIME('2021-01-12T07:30:00.000Z', 'localtime'))
                AND STRFTIME('%M', startingDate) = STRFTIME('%M', DATETIME('2021-01-12T07:30:00.000Z', 'localtime'))
                AND duration = 10800000
                AND classId = 255
			ORDER BY Lecture.startingDate;
```

**Check single values:**
```
SELECT Lecture.lectureId,
	STRFTIME('%w', DATETIME(startingDate)), STRFTIME('%w', DATETIME('2021-01-11T15:56:21.206Z', 'localtime')),
	STRFTIME('%w', startingDate) =  STRFTIME('%w', DATETIME('2021-01-11T15:56:21.206Z', 'localtime')) as COMPARE,
	STRFTIME('%H', startingDate), STRFTIME('%H', DATETIME('2021-01-17T07:30:00.000Z', 'localtime')),
	STRFTIME('%M', startingDate), STRFTIME('%M', DATETIME('2021-01-17T07:30:00.000Z', 'localtime')),
	startingDate, DATETIME('2021-01-17T07:30:00.000Z', 'localtime')
	FROM Lecture
		WHERE courseId = 1452
			AND classId = '239';
```

### Update schedule - check student emails

**Initial situation:**

The student `1` (Aldo Baglio) is actually booked for the lecture `1`. The lecture `1` is referred to the schedule `1`.

**Step:**

1. run all unit tests with `npm test`. There is a test which will modify the schedule `1` (which is related to lecture `1`);
2. check emails at the following link (it may require authentication): https://api.testmail.app/api/json?apikey=1714443a-b87e-4616-8c6f-19d1d6cf2eee&namespace=tjw85&pretty=true . The email should be sent to the student who was previously booked. The subject is to inform the student `1` that he/she has to book again.

Emails are sorted by receiving date descending, so the interested email should be the first one.