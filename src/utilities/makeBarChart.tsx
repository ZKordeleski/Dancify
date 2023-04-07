import * as Chart from 'chart.js';
import { Bar } from 'react-chartjs-2';

// TODO: Consider the size of these charts. Currently, just need to change number of partitions in each to adjust. Could pass argument into both chart makers to handle it.
// NOTE: Spiky charts can look weird. Could maybe consider doing a smooth distribution or adjusting based on the number of entries.
// const labels = ['0%-10%', '10%-20%', '20%-30%', '30%-40%', '40%-50%', '50%-60%', '60%-70%', '70%-80%', '80%-90%', '90%-100%'];
let labels: string[] = [];
const numberOfPartitions = 50;
for (let i = 0; i < numberOfPartitions; i++) {
  labels.push(i.toString());
}

export function makeBarChart(name: string, dataset: number[], color: string = 'rgba(255, 99, 132, 0.5)', max: number, labelArray: string[] = labels) {
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend
    );
      
        const options = {
          layout: {
            padding: {
              left: -4,
              right: 4
            }
          },
          scales: {
            y: {
                min: 0,
                max: max+.2,
                ticks: {
                  display: false
                },
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
            },
            x: {
              min: 0,
              max: 100,
              ticks: {
                display: false
              },
              grid: {
                display: false
              },
              border: {
                display: false
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
              display: false
            },
            title: {
              display: false,
            },
          },
        };
        
        const chart = {
          labels,
          datasets: [
            {
              label: name,
              data: dataset,
              backgroundColor: color,
            }
          ],
        };

    let chartUI = <Bar className='bar-chart' options={options} data={chart} />;

    return chartUI;
}