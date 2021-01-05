import React from 'react';
import { Bar } from 'react-chartjs-2';
import moment from "moment";
import API from '../api/Api';

class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        /*
        const colors = [
            'rgba(0, 222, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(182, 255, 108, 0.6)',
            'rgba(214, 114, 77,0.6)',
            'rgba(217, 196, 76,0.6)'
        ]*/
        //var description = courseName(this.props.courses, this.props.lecture.courseId);
        //var week = avgWeek(this.props.lectures, this.props.lecture);
        //var month = avgMonth(this.props.lectures, this.props.lecture);

        if (this.props.loading)
            return (<></>)
        if (this.props.granularity == "daily") {
            const days = prepareDates(this.props.lectures, this.props.from, this.props.to)
            console.log(days)
            const lectures = prepareLectures(this.props.lectures, this.props.from, this.props.to)
            return (<div>
                <Bar
                    data={
                        {
                            labels: days,
                            datasets: this.props.courses.map((course) => {
                                return {
                                    label: course.description,
                                    data: [2, 3, 5],
                                    borderWidth: 2
                                }
                            })
                        }
                    }
                    height={600}
                    width={600}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        fontSize: 15,
                                        precision: 2,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'stats',
                                        fontSize: 15,
                                        fontStyle: 'bold',
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    ticks: {
                                        fontSize: 15,
                                    }
                                }
                            ]
                        },
                        legend: {
                            labels: {
                                fontSize: 15,
                                fontStyle: 'bold',
                            }
                        }

                    }}
                />
            </div>)
        }
        else if (this.props.granularity == "weekly")
            return (<div>
                <Bar
                    data={
                        {
                            labels: this.props.weeks.map((w) => {
                                return w.name
                            }),
                            datasets: [{
                                label: [],
                                data: [],
                                backgroundColor: "red",
                                borderWidth: 2,
                            }]
                        }
                    }
                    height={600}
                    width={600}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        fontSize: 15,
                                        precision: 2,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'stats',
                                        fontSize: 15,
                                        fontStyle: 'bold',
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    ticks: {
                                        fontSize: 15,
                                    }
                                }
                            ]
                        },
                        legend: {
                            labels: {
                                fontSize: 15,
                                fontStyle: 'bold',
                            }
                        }

                    }}
                />
            </div>)
        else if (this.props.granularity == "monthly")
            return (<div>
                <Bar
                    data={
                        {
                            labels: this.props.months.map((m) => {
                                return m.name
                            }),
                            datasets: [{
                                label: [],
                                data: [],
                                backgroundColor: "green",
                                borderWidth: 2,
                            }]
                        }
                    }
                    height={600}
                    width={600}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        fontSize: 15,
                                        precision: 2,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'stats',
                                        fontSize: 15,
                                        fontStyle: 'bold',
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    ticks: {
                                        fontSize: 15,
                                    }
                                }
                            ]
                        },
                        legend: {
                            labels: {
                                fontSize: 15,
                                fontStyle: 'bold',
                            }
                        }

                    }}
                />
            </div>)
        else {
            return (<></>)
        }
    }
}
function prepareDates(lectures, from, to) {
    if (lectures.length === 0)
        return []
    let filteredLectures = []
    if (from && to)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.lecture.startingDate).isBefore(moment(to)) && moment(lecture.lecture.startingDate).isAfter(moment(from)) })
    else if (from)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.lecture.startingDate).isAfter(moment(from)) })
    else if (to)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.lecture.startingDate).isBefore(moment(to)) })
    else filteredLectures = lectures
    const dates = filteredLectures.map((lecture) => moment(lecture.lecture.startingDate).format("DD MMM YYYY")).sort((a, b) => moment(a).isBefore(b))
    console.log(dates)
    return dates
}
function prepareLectures(lectures, from, to) {

}
function courseName(courses, courseId) {
    for (let c of courses)
        if (c.courseId === courseId)
            return c.description;
}

function avgWeek(lectures, lecture) {
    let date = moment(lecture.startingDate);
    let thisWeek = date.week();
    let sum = 0, i = 0;
    for (let l of lectures) {
        if (l.courseId === lecture.courseId && moment(l.startingDate).week() === thisWeek) {
            sum += l.numBookings;
            i++;
        }
    }
    return sum / i;
}

function avgMonth(lectures, lecture) {
    let date = moment(lecture.startingDate);
    let thisMonth = date.month();
    let sum = 0, i = 0;
    for (let l of lectures) {
        if (l.courseId === lecture.courseId && moment(l.startingDate).month() === thisMonth) {
            sum += l.numBookings;
            i++;
        }
    }
    return sum / i;
}

function getColorIndex(courses, courseId) {
    let i;
    courses.forEach(function (item, index) {
        if (courseId === item.courseId)
            i = index;

    })
    return i;
}

export default Chart;