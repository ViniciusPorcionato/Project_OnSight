import { getMetricDetails } from "@/service/monitoringService";

import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Text, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const ChartDot = ({ cx, cy }) => {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={6}
            stroke='#AE8FF7'
            style={{opacity: "0.9"}}
            strokeWidth={4} 
            fill={"white"} 
        />
    );
}

const MetricDetails = ({ metricItem }) => {
    const [metricEvolutionData, setMetricEvolutionData] = useState([]);

    const data = [
        {
            day: 11, value: 6
        },
        {
            day: 12, value: 10
        },
        {
            day: 13, value: 8
        },
        {
            day: 14, value: 7
        },
        {
            day: 15, value: 13
        },
    ];

    async function initMetricDetails() {
        const metricChartData = await getMetricDetails(metricItem.metricCategoryId);

        console.log(metricChartData)

        const formattedChartData = metricChartData.map(record => {
            const formattedDay = new Date(record.metricDateTime).toDateString().slice(8, 10);
            
            return { 
                day: formattedDay, 
                value: record.value 
            }
        })

        console.log(metricChartData)

        setMetricEvolutionData(formattedChartData);
    }

    useEffect(() => {
        initMetricDetails();
    }, [metricItem]);

    return (
        <div className="flex flex-col gap-3 p-6">
            <p>{metricItem.metricDescription}</p>
            <ResponsiveContainer width='100%' aspect={1.5}>
                <h3 className="text-lg font-bold mt-6">KPI - {metricItem.metricCategoryName}</h3>
                <AreaChart 
                    width={320} height={240} 
                    data={metricEvolutionData} 
                    margin={{ top: 30, left: -34, right: 20 }}
                >
                <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#FD5DEF" stopOpacity={0.2}/>
                    <stop offset="90%" stopColor="#FD5DEF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginLeft: 30, paddingTop: 14 }} />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    dot={<ChartDot />} 
                    activeDot={{ r: 6 }}
                    stroke="#00456D" 
                    strokeWidth={5}
                    fill="url(#areaColor)"
                    name={`${metricItem.metricCategoryName} (${metricItem.metricUnit})`}
                />
                <XAxis dataKey="day" />
                <YAxis dataKey="value" />
                <Tooltip isAnimationActive={true} animationDuration={700} animationEasing="ease-in-out" labelFormatter={(label) => `Dia: ${label}`} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MetricDetails;