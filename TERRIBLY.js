import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const App = () => {
  const [histogramData, setHistogramData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://www.terriblytinytales.com/test.txt'
      );
      const words = response.data.split(/\s+/); 
      const frequencyMap = {};

      
      words.forEach((word) => {
        if (frequencyMap[word]) {
          frequencyMap[word] += 1;
        } else {
          frequencyMap[word] = 1;
        }
      });

  
      const sortedWords = Object.keys(frequencyMap).sort(
        (a, b) => frequencyMap[b] - frequencyMap[a]
      );

      const top20Words = sortedWords.slice(0, 20);
      const histogramChartData = {
        labels: top20Words,
        datasets: [
          {
            label: 'Occurrences',
            data: top20Words.map((word) => frequencyMap[word]),
          },
        ],
      };

      setHistogramData(histogramChartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportCSV = () => {
    if (histogramData) {
      const csvContent = [
        'Word,Occurrences',
        ...histogramData.labels.map(
          (label, index) =>
            `${label},${histogramData.datasets[0].data[index]}`
        ),
      ].join('\n');

      const element = document.createElement('a');
      const file = new Blob([csvContent], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = 'histogram.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {histogramData && (
        <>
          <Bar
            data={histogramData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
          <button onClick={exportCSV}>Export</button>
        </>
      )}
    </div>
  );
};

export default App;
