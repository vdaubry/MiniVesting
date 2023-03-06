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
import { truncatedAmount, formatDate } from "../utils/format";

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

export default function VestingChart({
  startDate,
  cliffDate,
  durationDate,
  vestingAmount,
  amountVested,
}) {
  const options = {
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

  const labels = [
    formatDate(startDate),
    formatDate(cliffDate),
    formatDate(durationDate),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Release schedule",
        data: [0, 0, truncatedAmount(vestingAmount)],
        borderColor: "rgba(92,182,228,1)",
        backgroundColor: "rgba(92,182,228,0.4)",
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
