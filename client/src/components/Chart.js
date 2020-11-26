import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = () => {
    return (
        <div>
            <Line
                data={
                    {
                        labels: ['21/11/2020', '22/11/2020', '23/11/2020', '24/11/2020', '25/11/2020', '26/11/2020'], //TODO take this from server
                        datasets: [{
                            label: '$COURSENAME # of bookings', //TODO take course name
                            data: [35, 27, 22, 10, 8, 8], //TODO take this from server
                            backgroundColor: 'orange',
                        }]
                    }
                }
                height={400}
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
        </div>
    )
}

export default Chart;