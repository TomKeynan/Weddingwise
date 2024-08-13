import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function ExpensesPeiChart({ data }) {
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 270,
          cx: 150,
          cy: 190,
        },
      ]}
      colors={[
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
      ]}
      sx={{direction: "ltr"}}
      width={250}
      height={220}
      margin={{
        left: 0,
        top: -80,
      }}
      slotProps={{
        legend: {
          hidden: true,
        },
      }}
    />
  );
}
