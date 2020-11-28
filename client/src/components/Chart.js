import React from 'react';
import { Bar } from 'react-chartjs-2';
import moment from "moment";


class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            lectureDates: [], bookings: [],                         //elements
            fetchErrorC: false, fetchErrorL: false, fetchErrorS: false,       //fetch errors

        };
    }

    render() {
        const colors = [
            'rgba(0, 222, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(182, 255, 108, 0.6)',
            'green',
            'yellow'
        ]
        var i = 0;
        return (<div>
            <Bar
                data={
                    {
                        labels: this.props.lectures.map((l) => moment(l.startingDate).format('DD/MM/YYYY')),
                        datasets: this.props.courses.map((c) => {
                            return {
                                label: c.description,
                                data: [35, 5, 22, 8], //TODO take this from server
                                backgroundColor: colors[i++],
                            }
                        }
                        )
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
                                }
                            }
                        ]
                    }

                }}
            />
        </div>)
    }
}

export default Chart;