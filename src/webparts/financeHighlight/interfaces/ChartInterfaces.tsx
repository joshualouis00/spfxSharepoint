/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { ViewHighlight } from "../interfaces/interfaces";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const DataChartInterfaces = (props: ViewHighlight) => {

  return (
    <>
      <ResponsiveContainer width='100%' height= '100%'>
            <BarChart
            data={props.FinData}
            margin={{
              top: 10,
              left: 2,
              bottom: 5,
            }}
            barGap={10}
            barCategoryGap={10}
            barSize={30}
            //key="name"
            >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={(value) => `${value}`} />
            <XAxis dataKey="xValue" stroke="black" strokeWidth={2}
            />
            <YAxis 
              stroke="black"
              strokeWidth={2}
              tickCount={20}
            />
            {/* <Legend width={400} align="left" /> */}
            
              <Bar dataKey="valueItem1" fill="#33ff33" />
              <Bar dataKey="rkap" fill="#4dd2ff" />
            
              <Bar dataKey="valueItem2" fill="#33ff33" />
              <Bar dataKey="rkapFullYear" fill="#4dd2ff" />
            
              <Bar dataKey="valueItem3" fill="#33ff33" />
              <Bar dataKey="preValue" fill="#4dd2ff" />
            </BarChart>
      </ResponsiveContainer>
    </>
  );
};
