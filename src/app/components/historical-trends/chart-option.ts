import { ChartOptions } from 'chart.js';

export const getHistoricalDataChartOption = (title: string, theme: string): ChartOptions => {
  return {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: `${theme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'}`
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        },
      },
      tooltip: {
        // TOOD: Fix colors
        backgroundColor: `${theme === 'light' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}`,
        titleColor: `${theme === 'light' ? '#fff' : '#000'}`,
        bodyColor: `${theme === 'light' ? '#fff' : '#000'}`,
        boxPadding: 5,
        titleMarginBottom: 5,
        borderColor: `${theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (ctx) {
            const label = ctx.dataset.label || '';
            const value = ctx.parsed.y;

            return `${label}: ${value.toFixed(6)}`;
          },
          title: function (ctx) {
            return new Date(ctx[0].label).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          font: {
            size: 11,
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          callback: function (value: any) {
            return value.toFixed(4);
          },
          font: {
            size: 11,
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    },
  }
};
