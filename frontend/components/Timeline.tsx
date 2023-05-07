import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import prettyMilliseconds from "pretty-ms";
import {Box, Card, CardHeader, Heading} from "@chakra-ui/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Timeline = ({tasks}) => {

    const firstTask = tasks.reduce((prev, current) => (prev.startTime < current.startTime) ? prev : current);
    const lastTask = tasks.reduce((prev, current) => (prev.endTime > current.endTime) ? prev : current);

    const durationMap: Map<string, number> = new Map<string, number>();
    tasks.forEach(t => durationMap.set(t.path, t.durationInMillis));

    const footer = (items) => {
        let duration = 0;

        items.forEach(i => {
            duration = (durationMap.get(i.label));
        })
        return 'Duration: ' + prettyMilliseconds(duration);
    };

    const options = {
        indexAxis: 'y' as const,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend:
                {
                    display: false
                },
            tooltip: {
                callbacks: {
                    footer: footer,
                }
            }
        },
        responsive: true,
        scale: {
            x: {
                min: firstTask.startTime,
                max: lastTask.endTime
            }
        }
    };

    const data = {
        labels: tasks.map(t => t.path),
        datasets: [
            {
                data: tasks.map(t => [t.startTime, t.endTime === t.startTime ? t.startTime + 1 : t.endTime]),
                backgroundColor: '#a855f7',
            }
        ],
    };

    return (
        <Card mt={6}>
            <CardHeader>
                <Heading size="md">Timeline</Heading>
            </CardHeader>
            <Bar className="mx-6" options={options} data={data}/>
        </Card>
    );
}

export default Timeline;