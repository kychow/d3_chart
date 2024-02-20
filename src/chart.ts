import { Chart, ChartType, ScaleOptions, registerables } from 'chart.js';
import 'chartjs-plugin-annotation';

Chart.register(...registerables);

type FoodType = 'seafood' | 'nut' | 'dairy' | 'grain' | 'meat' | 'vegetable-based';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  price: number;
  density: number;
  type: FoodType;
  gramsOfProteinPerDollar?: number;
  percentageCaloriesFromProtein?: number;
}

const mockFoodItems: FoodItem[] = [
  { name: 'Tofu', calories: 70, protein: 8, price: 1.5, density: 0.8, type: 'vegetable-based' },
  { name: 'Protein Powder', calories: 120, protein: 24, price: 2, density: 0.9, type: 'dairy' },
  { name: 'Shrimp', calories: 99, protein: 24, price: 5, density: 0.5, type: 'seafood' },
  { name: 'Egg', calories: 155, protein: 13, price: 0.3, density: 1.1, type: 'dairy' },
  { name: 'Scallop', calories: 80, protein: 15, price: 6, density: 0.6, type: 'seafood' },
  { name: 'Seitan', calories: 100, protein: 20, price: 4, density: 1.2, type: 'vegetable-based' },
  { name: 'Fish', calories: 90, protein: 17, price: 5, density: 0.7, type: 'seafood' },
  { name: 'Almonds', calories: 160, protein: 6, price: 1.2, density: 0.4, type: 'nut' },
  { name: 'Greek Yogurt', calories: 120, protein: 10, price: 2, density: 1.0, type: 'dairy' },
  { name: 'Salmon', calories: 180, protein: 20, price: 7, density: 0.9, type: 'seafood' },
  { name: 'Quinoa', calories: 160, protein: 8, price: 3, density: 0.7, type: 'grain' },
  { name: 'Chicken Breasts', calories: 120, protein: 25, price: 5, density: 0.8, type: 'meat' },
  { name: 'Chicken Thighs', calories: 150, protein: 20, price: 4, density: 0.7, type: 'meat' },
  { name: 'Ground Pork', calories: 200, protein: 18, price: 6, density: 0.6, type: 'meat' },
  { name: 'Sausage', calories: 250, protein: 15, price: 4, density: 0.5, type: 'meat' }
];

const foodGroups: Record<FoodType, FoodItem[]> = {
  'meat': [],
  'dairy': [],
  'seafood': [],
  'nut': [],
  'grain': [],
  'vegetable-based': []
};

mockFoodItems.forEach(item => {
  item.gramsOfProteinPerDollar = item.protein / item.price;
  item.percentageCaloriesFromProtein = (item.protein * 4 / item.calories) * 100;
  foodGroups[item.type].push(item);
});


const data = {
  datasets: Object.entries(foodGroups).map(([foodType, items]) => ({
    label: foodType.replace('-', ' '), // Replace hyphens with spaces for better legend display
    data: items.map(item => ({ x: item.percentageCaloriesFromProtein, y: item.gramsOfProteinPerDollar, label: item.name })),
    backgroundColor: getColorForType(foodType as FoodType),
    borderColor: 'rgba(0, 0, 0, 1)',
    borderWidth: 1,
    type: 'scatter' as ChartType,
    pointRadius: 4,
  }))
};

function getColorForType(type: FoodType): string {
  switch (type) {
    case 'vegetable-based':
      return 'rgba(0, 128, 0, 0.5)'; // Green
    case 'dairy':
      return 'rgba(255, 255, 0, 0.5)'; // Yellow
    case 'meat':
      return 'rgba(255, 0, 0, 0.5)'; // Red
    case 'seafood':
      return 'rgba(0, 0, 255, 0.5)'; // Blue
    case 'nut':
      return 'rgba(139, 69, 19, 0.5)'; // Brown
    case 'grain':
      return 'rgba(255, 159, 64, 0.5)'; // Orange
    default:
      return 'rgba(0, 0, 0, 0.5)';
  }
}

const maxGramsOfProteinPerDollar = Math.max(
  ...mockFoodItems
    .map(item => item.gramsOfProteinPerDollar)
    .filter((value): value is number => typeof value === 'number')
);

const config = {
  type: 'scatter' as ChartType,
  data: data,
  options: {
    responsive: false, // Prevent resizing
    title: {
      display: true,
      text: 'Protein Comparison Chart' 
    },
    scales: {
      x: {
        type: 'linear' as 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: '% Calories from Protein'
        },
        min: 0,
        max: 100
      } as ScaleOptions<'linear'>,
      y: {
        title: {
          display: true,
          text: 'Grams of Protein per Dollar'
        },
        min: 0,
        max: Math.ceil(maxGramsOfProteinPerDollar)
      } as ScaleOptions<'linear'>
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.data[context.dataIndex].label;
            return label;
          }
        }
      },
      legend: {
        labels: {
          filter: function (legendItem: { text: string; }, chartData: any) {
            return Object.keys(foodGroups).includes(legendItem.text.replace(' ', '-')); // Filter out non-food group legend items
          }
        }
      },
      elements: {
        point: {
          hoverRadius: 0, // Disable hover animation
        }
      }
    }
  }
};

function createChart() {
  const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  if (ctx) {
    // Check if a chart instance already exists and destroy if so
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy(); 
    }
    
    // Create a new chart instance 
    new Chart(ctx, config);
  }
}

document.addEventListener('DOMContentLoaded', createChart);