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
        if (this.props.loading)
            return (<></>)
        if (this.props.granularity == "daily") {
            const days = prepareDates(this.props.lectures, this.props.from, this.props.to)
            let data = {};
            if (this.props.userType === "MANAGER")
                data =
                {

                    labels: days,
                    datasets: [
                        {
                            label: "Attendances",
                            data: computeAttendaces(this.props.lectures),
                            backgroundColor: 'rgb(0,255,0)'
                        },
                        {

                            label: "Cancellations",
                            data: computeCancellations(this.props.lectures),
                            backgroundColor: 'rgb(255,0,0)'
                        },

                        {
                            label: "Reservations",
                            data: computeBookings(this.props.lectures),
                            backgroundColor: 'rgb(0,0,255)'
                        }
                    ]
                }
            else data = {

                labels: days,
                datasets: [
                    {
                        label: "Attendances",
                        data: computeAttendaces(this.props.lectures),
                        backgroundColor: 'rgb(0,255,0)'
                    },

                    {
                        label: "Reservations",
                        data: computeBookings(this.props.lectures),
                        backgroundColor: 'rgb(0,0,255)'
                    }
                ]
            }
            return (<div>
                <Bar

                    data={data}

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
                                        labelString: '# Students',
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
        else if (this.props.granularity == "weekly") {
            const weeks = this.props.weeks.map((weekRange) => {
                const tokens = weekRange.name.split("-")
                return tokens[0] + " - " + tokens[1]
            })
            let data = {};
            if (this.props.userType === "MANAGER")
                data = {
                    labels: weeks,
                    datasets: [
                        {
                            label: "Attendances",
                            data: computeWeeklyAvgAttendaces(this.props.lectures, this.props.weeks),
                            backgroundColor: 'rgb(0,255,0)'
                        },
                        {
                            label: "Cancellations",
                            data: computeWeeklyAvgCancellations(this.props.lectures, this.props.weeks),
                            backgroundColor: 'rgb(255,0,0)'
                        },
                        {
                            label: "Reservations",
                            data: computeWeeklyAvgBookings(this.props.lectures, this.props.weeks),
                            backgroundColor: 'rgb(0,0,255)'
                        }
                    ]
                }
            else data = {
                labels: weeks,
                datasets: [
                    {
                        label: "Attendances",
                        data: computeWeeklyAvgAttendaces(this.props.lectures, this.props.weeks),
                        backgroundColor: 'rgb(0,255,0)'
                    },

                    {
                        label: "Reservations",
                        data: computeWeeklyAvgBookings(this.props.lectures, this.props.weeks),
                        backgroundColor: 'rgb(0,0,255)'
                    }
                ]
            }
            return (<div>
                <Bar
                    data={data}
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
                                        labelString: 'Average #Students',
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
        else if (this.props.granularity == "monthly") {
            const months = this.props.months.map((month) => { return month.name })
            let data;
            if (this.props.userType === "MANAGER")
                data = {
                    labels: months,
                    datasets: [
                        {
                            label: "Attendances",
                            data: computeMonthlyAvgAttendaces(this.props.lectures, this.props.months),
                            backgroundColor: 'rgb(0,255,0)'
                        },
                        {
                            label: "Cancellations",
                            data: computeMonthlyAvgCancellations(this.props.lectures, this.props.months),
                            backgroundColor: 'rgb(255,0,0)'
                        },
                        {
                            label: "Reservations",
                            data: computeMonthlyAvgBookings(this.props.lectures, this.props.months),
                            backgroundColor: 'rgb(0,0,255)'
                        }
                    ]
                }
            else data = {
                labels: months,
                datasets: [
                    {
                        label: "Attendances",
                        data: computeMonthlyAvgAttendaces(this.props.lectures, this.props.months),
                        backgroundColor: 'rgb(0,255,0)'
                    },
                    {
                        label: "Reservations",
                        data: computeMonthlyAvgBookings(this.props.lectures, this.props.months),
                        backgroundColor: 'rgb(0,0,255)'
                    }
                ]
            }
            return (<div>
                <Bar
                    data={data}
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
                                        labelString: 'Average #Students',
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
        else {
            return (<></>)
        }
    }
}
function prepareDates(lectures, from, to) {
    console.log(lectures)
    console.log(from)
    console.log(to)
    if (lectures.length === 0)
        return []
    let filteredLectures = []
    if (from && to)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.startingDate).isBefore(moment(to)) && moment(lecture.startingDate).isAfter(moment(from)) })
    else if (from)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.startingDate).isAfter(moment(from)) })
    else if (to)
        filteredLectures = lectures.filter((lecture) => { return moment(lecture.startingDate).isBefore(moment(to)) })
    else filteredLectures = lectures
    let dates = filteredLectures.map((lecture) => moment(lecture.startingDate).format("DD MMM YYYY")).sort((a, b) => moment(a).isBefore(b))
    console.log(dates)
    dates = dropDuplicate(dates)
    console.log(dates)
    return dates
}
function dropDuplicate(dates) {
    let res = []
    for (let date of dates)
        if (!res.includes(date))
            res.push(date)
    return res
}
function computeAttendaces(lectures) {
    return lectures.map((lecture) => { return lecture.attendances })
}
function computeCancellations(lectures) {
    return lectures.map((lecture) => { return lecture.cancellations })
}
function computeBookings(lectures) {
    return lectures.map((lecture) => { return lecture.numBookings })
}






function computeWeeklyAvgAttendaces(lectures, weeks) {
    let values = []
    for (let week of weeks) {
        const tokens = week.name.split("-")
        let items = lectures.filter((lecture) => { return moment(lecture.startingDate).isSameOrBefore(tokens[1]) && moment(lecture.startingDate).isSameOrAfter(tokens[0]) })
        let sum = 0
        for (let item of items)
            sum += item.attendances
        values.push(sum / items.length)
    }
    return values
}
function computeWeeklyAvgCancellations(lectures, weeks) {
    let values = []
    for (let week of weeks) {
        const tokens = week.name.split("-")
        let items = lectures.filter((lecture) => { return moment(lecture.startingDate).isSameOrBefore(tokens[1]) && moment(lecture.startingDate).isSameOrAfter(tokens[0]) })
        let sum = 0
        for (let item of items)
            sum += item.cancellations
        values.push(sum / items.length)
    }
    return values
}
function computeWeeklyAvgBookings(lectures, weeks) {
    let values = []
    for (let week of weeks) {
        const tokens = week.name.split("-")
        let items = lectures.filter((lecture) => { return moment(lecture.startingDate).isSameOrBefore(tokens[1]) && moment(lecture.startingDate).isSameOrAfter(tokens[0]) })
        let sum = 0
        for (let item of items)
            sum += item.numBookings
        values.push(sum / items.length)
    }
    return values
}


function computeMonthlyAvgAttendaces(lectures, months) {
    let values = []
    for (let month of months) {
        month = month.name
        let items = lectures.filter((lecture) => { return month === moment(lecture.startingDate).format("MMM YY") })
        let sum = 0
        for (let item of items)
            sum += item.attendances
        values.push(sum / items.length)
    }
    return values
}
function computeMonthlyAvgCancellations(lectures, months) {
    let values = []
    for (let month of months) {
        month = month.name
        let items = lectures.filter((lecture) => { return month === moment(lecture.startingDate).format("MMM YY") })
        let sum = 0
        for (let item of items)
            sum += item.cancellations
        values.push(sum / items.length)
    }
    return values
}
function computeMonthlyAvgBookings(lectures, months) {
    let values = []
    for (let month of months) {
        month = month.name
        let items = lectures.filter((lecture) => { return month === moment(lecture.startingDate).format("MMM YY") })
        let sum = 0
        for (let item of items)
            sum += item.numBookings
        values.push(sum / items.length)
    }
    return values
}
export default Chart;