import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function ExpensesPeiChart({ data }) {
  return (
    <PieChart
      series={[
        {
          // data: [
          //   { id: 0, value: 10, label: "series A" },
          //   { id: 1, value: 15, label: "series B" },
          //   { id: 2, value: 20, label: "series C" },
          //   { id: 4, value: 20, label: "series D" },
          //   { id: 5, value: 20, label: "series D" },

          // ],
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
      // colors={[
      //   "#1f77b4",
      //   "#ff7f0e",
      //   "#2ca02c",
      //   "#d62728",
      //   "#9467bd",
      //   "#8c564b",
      //   "#e377c2",
      //   "#7f7f7f",
      //   "#bcbd22",
      //   "#17becf",
      // ]}
      // sx={{direction: "ltr"}}
      width={400}
      height={400}
    />
  );
}
