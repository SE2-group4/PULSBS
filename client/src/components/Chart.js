import React from 'react';
import { Bar } from 'react-chartjs-2';
import moment from "moment";


class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const colors = [
            'rgba(0, 222, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(182, 255, 108, 0.6)',
            'rgba(214, 114, 77,0.6)',
            'rgba(217, 196, 76,0.6)'
        ]
        var description = courseName(this.props.courses, this.props.lecture.courseId);
        var week = avgWeek(this.props.lectures, this.props.lecture);
        var month = avgMonth(this.props.lectures, this.props.lecture);
        return (<div>
            <Bar
                data={
                    {
                        labels: [moment(this.props.lecture.startingDate).format('DD/MM/YYYY'),
                        ["average week", moment(this.props.lecture.startingDate).startOf('week').format('DD/MM/YYYY') + " - " + moment(this.props.lecture.startingDate).endOf('week').format('DD/MM/YYYY')],
                        ["average month", moment(this.props.lecture.startingDate).startOf('month').format('DD/MM/YYYY') + " - " + moment(this.props.lecture.startingDate).endOf('month').format('DD/MM/YYYY')]],
                        datasets: [{
                            label: description,
                            data: [this.props.lecture.numBookings, week, month],
                            backgroundColor: colors[getColorIndex(this.props.courses, this.props.lecture.courseId)],
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
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: '# bookings',
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
}

function courseName(courses, courseId) {
    for (let c of courses)
        if (c.courseId === courseId)
            return c.description;
}

function avgWeek(lectures, lecture) {
    let date = moment(lecture.startingDate);
    let thisWeek = date.week();
    console.log(date.startOf('week').format('DD/MM/YYYY'));
    console.log(date.endOf('week').format('DD/MM/YYYY'));
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