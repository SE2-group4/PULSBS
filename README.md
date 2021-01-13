[![Test Status](https://travis-ci.org/SE2-group4/PULSBS.svg?branch=main)](https://travis-ci.org/SE2-group4/PULSBS)
[![codecov](https://codecov.io/gh/SE2-group4/PULSBS/branch/main/graph/badge.svg)](https://codecov.io/gh/SE2-group4/PULSBS)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=bugs)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=code_smells)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=ncloc)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=security_rating)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=sqale_index)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=SE2-group4_PULSBS&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=SE2-group4_PULSBS)
# PULSBS
Pandemic University Lecture Seat Booking System.
## Calendar
[Sprint meetings](https://calendar.google.com/calendar/u/0/r?cid=N3A0ZzhsMjRydWtpazJtdjZya2M3NGFzYm9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&pli=1)

[Estimated time for Sprint 1](https://docs.google.com/spreadsheets/d/1icbW5-RjAeo9tewDkwckT8yB0Kz6KoK-puBTgJctIUM/edit)

## Design
[Database interface](https://app.creately.com/diagram/v2I2OxU6KJl/view)

~~[Public API skeleton](https://docs.google.com/document/d/1g7rZGhk2GJU-NiFqanrXhGMsG0u4hMfa0yhNFl68EPw/edit)~~ USE instead the openapi.yaml file as reference
## Installation
There are two main modes to run the PULSBS application. Using Nodejs installed locally or using the Docker image from DockerHub.
### Nodejs
- Install nodeJs (https://nodejs.org/it/download/).
- Clone this repository :  
```
git clone https://github.com/SE2-group4/PULSBS.git
```
- Open the terminal in the application folder
#### Starting server
```
cd server
npm install
npm start
```
#### Starting client
```
cd client 
npm install
npm start
```
From this point you could interact with the application visiting http://localhost:3000
### Docker
- Install Docker (https://www.docker.com/get-started)
- Import the DockerHub Image of the application writing in the terminal :
```
docker pull se2group4/pulsbs:release2
```
- Run the application writing in the terminal : 
```
docker run -p 3000:3000 se2group4/pulsbs:release2
```
- Visit http://localhost:3000 on your browser
## Usage
### Login Account
- Student : 
  - Email : fakeStudent.se2@gmail.com
  - Password : aldo
- Teacher :
  - Email : fakeTeacher.se2@gmail.com
  - Password : giacomo
- Booking Manager : 
  - Email : manager@test.it
  - Password : manager
- Support Officer : 
  - Email : officer1@test.it
  - Password : officer1
## Description

### Client
#### How to
* run tests
```
cd <root>/client
npm test
```
### Server
#### How to
* run the integration/unit tests
```
cd <root>/server
npm run test
```
* run the API tests
```
cd <root>/server
npm run testapi
```
