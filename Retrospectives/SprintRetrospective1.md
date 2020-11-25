SPRINT RETROSPECTIVE 1 (TEAM 4)
=====================================

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done : 4 vs 1
- Total points committed vs done : 29 vs 8
- Nr of hours planned vs spent (as a team) : 72h vs 66h 30m
- Unit Tests passing : 45/48
- Code review completed : 0/0
- Code present on VCS : 2758 lines
- End-to-End tests performed : 31

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual | Status |
|--------|---------|--------|------------|--------------|--------|
| #0   |         |    -   |            |              |        |
| | 26 | | 6h | 7h 30m | done   | 
| | 30 | | 3h | 3h 10m | done   |
| | 27 | | 5h | 2h 20m | done   |
| | 48 | | 6h | 2h 30m | done   |
| | 49 | | 2h | 1h 45m | done   |
| #1 | | 5  |        |      | |
| | 29 | | 2h | 2h 30m | done | 
| | 31 | | 1h 30m | 1h 20m | done | 
| | 32 | | 1h | 45m    | done   | 
| | 33 | | 2h | 3h     | done   | 
| | 40 | | 2h | 4h 20m | done   | 
| | 41 | | 2h | 2h 20m | review | 
| | 42 | | 2h | 3h 30m | done | 
| #2 | | 13 | | | |
| | 28 | | 4h | 3h     | done | 
| | 34 | | 5h | 3h     | done | 
| | 43 | | 6h | 6h 30m | done | 
| | 35 | | 3h | 4h     | done | 
| | 36 | | 3h | 1h     | done | 
| #3 | | 3 | | |     |
| | 37 | | 2h | 3h 30m | done |
| | 38 | | 1h 30m | 2h | done |
| | 44 | | 3h | 2h 50m | review |
| | 45 | | 2h | 4h     | done |
| | 46 | | 2h | 1h 15m | done |
| #4 | | 8 | | | |
| | 39 | | 2h | 25m    | done |
| | 47 | | 2h | 0h     | review |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - average: 2.77 hours
  - standard deviation: 1.74 hours 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  - error ratio: 1.05 

## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated : 17 hours
  - Total hours spent : 17 hours 9 minutes
  - Nr of automated unit test cases:
    - Client-side : 28 tests
    - Server-side : 20 tests
  - Coverage : 54.39 %
- E2E testing:
  - Total hours estimated : 4 hours
  - Total hours spent : 7 hours 30 minutes
- Code review 
  - Total hours estimated : 0 hours
  - Total hours spent : 0 hours
- Technical Debt management:
  - Total hours estimated : 0 hours
  - Total hours spent : 0 hours
  - Hours estimated for remediation by SonarQube : 1 hour
  - Hours spent on remediation : 10 minutes
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") : 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) : A, A, A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Task 27 (Learning testing tools for the frontend)  
    - we thought learning testing tools required a lot of effort, for this reason we overestimated this task
  - Task 48 (frontend implement login page):
    - There was a communication issue with the assignee of this task
  - Task 40 (testing gui student webpage):
    - learning the new tools was easy but implemented the tests in practice required more effort
  - Task 42 (Testing: back-end API related to the student/teacher/login): 
    - there were more use cases than initially predicted, thus it required more time to write the API's tests
  - Task 34 (Implement email sending service)
    - we didn't know how to implement mails with node but it has proved easier than expected
  - Task 36 (Front-end: implement front-end APIs function):
    - after the effort of implementing the first API, the other ones were much faster to do
  - Task 37 (Back-end: implement back-end APIs functions related to retrieving all the students booked for a lecture taught by a particular teacher): 
    - it was tracked an additional part related to setting up the controllers and services routines
  - Task 45 (Testing: back-end API related to retrieving students): 
    - same reason as for task 42
    - it took extra time to readapt the tests after changes were made midway the sprint.
  - Task 46 (Testing: db and queries related to retrieving the students): 
    - more effort needed to integrate other modules with the whole system, no more time for this task. 
  - Task 39 : 
  - Task 47 (Testing: back-end emailfunctions about seat booking): 
    - misunderstanding between team members lead to tracking time issues, such as clocking the work log in other similar tasks.

- What lessons did you learn (both positive and negative) in this sprint?
  - POSITIVE
    - automation is your best friend
    - group discussions helps while developing a web application  
    - defining more detailed tasks was a good choice
  - NEGATIVE
    - working in parallel on the same file may cause frustration and annoyance. Those were caused in part by:
      - spending extra time in understanding the code written by other people
      - distinct structure of a problem's solution (good and bad at the same time)
    - not having a coherent set of APIs lead to different implementation styles in some part of the system  
    - testing should not be understimated because it is essential

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - Discuss before making any breaking changes with your
teammates (or at least the people affected by it)
PARTIAL
  - Reflect more in depth about the workload needed by a
task. It is better to divide a task in subtasks if the
estimation it is not clear or well defined.
DONE
  - Define a coherent and a systematic approach for managing
the project folder structure.
DONE

- Which ones you were not able to achieve? Why?
  - Discuss before making any breaking changes with your
teammates (or at least the people affected by it)
    - Lack of proper communication lead to misunderstandings, conflicts in the work.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - do more group discussions
  - code review
  - augment and define threshold for coverage
  - define better APIs

- One thing you are proud of as a Team!!  
During this first sprint we built a solid base in our project in order to deploy a very good application at the end!
