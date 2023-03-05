import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Vesting schedule",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Release schedule",
      data: [200, 300, 400, 500, 600, 700, 800],
      borderColor: "rgba(92,182,228,1)",
      backgroundColor: "rgba(92,182,228,0.4)",
      fill: true,
    },
  ],
};

export default function VestingChart() {
  return <Line options={options} data={data} />;
}
