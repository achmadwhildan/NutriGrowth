// Data Standar Pertumbuhan Anak WHO (0 - 60 Bulan)
// Data berikut adalah sampel (median) dari WHO Child Growth Standards.

export const whoWeightBoys = [
    { month: 0, ideal: 3.3, "-2": 2.5, "2": 4.3 },
    { month: 1, ideal: 4.5, "-2": 3.4, "2": 5.8 },
    { month: 2, ideal: 5.6, "-2": 4.3, "2": 7.1 },
    { month: 3, ideal: 6.4, "-2": 5.0, "2": 8.0 },
    { month: 6, ideal: 7.9, "-2": 6.4, "2": 9.8 },
    { month: 9, ideal: 8.9, "-2": 7.1, "2": 11.0 },
    { month: 12, ideal: 9.6, "-2": 7.7, "2": 11.9 },
    { month: 18, ideal: 10.9, "-2": 8.8, "2": 13.5 },
    { month: 24, ideal: 12.2, "-2": 9.7, "2": 15.3 },
    { month: 36, ideal: 14.3, "-2": 11.3, "2": 18.3 },
    { month: 48, ideal: 16.3, "-2": 12.7, "2": 21.2 },
    { month: 60, ideal: 18.3, "-2": 14.1, "2": 24.2 },
];

export const whoWeightGirls = [
    { month: 0, ideal: 3.2, "-2": 2.4, "2": 4.2 },
    { month: 1, ideal: 4.2, "-2": 3.2, "2": 5.5 },
    { month: 2, ideal: 5.1, "-2": 3.9, "2": 6.6 },
    { month: 3, ideal: 5.8, "-2": 4.5, "2": 7.5 },
    { month: 6, ideal: 7.3, "-2": 5.7, "2": 9.3 },
    { month: 9, ideal: 8.2, "-2": 6.5, "2": 10.5 },
    { month: 12, ideal: 8.9, "-2": 7.0, "2": 11.5 },
    { month: 18, ideal: 10.2, "-2": 8.1, "2": 13.2 },
    { month: 24, ideal: 11.5, "-2": 9.0, "2": 14.8 },
    { month: 36, ideal: 13.9, "-2": 10.8, "2": 18.1 },
    { month: 48, ideal: 16.1, "-2": 12.3, "2": 21.5 },
    { month: 60, ideal: 18.2, "-2": 13.7, "2": 24.9 },
];

export const whoHeightBoys = [
    { month: 0, ideal: 49.9, "-2": 46.1, "2": 53.7 },
    { month: 1, ideal: 54.7, "-2": 50.8, "2": 58.6 },
    { month: 2, ideal: 58.4, "-2": 54.4, "2": 62.4 },
    { month: 3, ideal: 61.4, "-2": 57.3, "2": 65.5 },
    { month: 6, ideal: 67.6, "-2": 63.3, "2": 71.9 },
    { month: 9, ideal: 72.0, "-2": 67.5, "2": 76.5 },
    { month: 12, ideal: 75.7, "-2": 71.0, "2": 80.5 },
    { month: 18, ideal: 82.3, "-2": 76.9, "2": 87.7 },
    { month: 24, ideal: 87.8, "-2": 81.7, "2": 93.9 },
    { month: 36, ideal: 96.1, "-2": 88.7, "2": 103.5 },
    { month: 48, ideal: 103.3, "-2": 94.9, "2": 111.7 },
    { month: 60, ideal: 110.0, "-2": 100.7, "2": 119.2 },
];

export const whoHeightGirls = [
    { month: 0, ideal: 49.1, "-2": 45.4, "2": 52.9 },
    { month: 1, ideal: 53.7, "-2": 49.8, "2": 57.6 },
    { month: 2, ideal: 57.1, "-2": 53.0, "2": 61.1 },
    { month: 3, ideal: 59.8, "-2": 55.6, "2": 64.0 },
    { month: 6, ideal: 65.7, "-2": 61.2, "2": 70.3 },
    { month: 9, ideal: 70.1, "-2": 65.3, "2": 75.0 },
    { month: 12, ideal: 74.0, "-2": 68.9, "2": 79.2 },
    { month: 18, ideal: 80.7, "-2": 74.9, "2": 86.5 },
    { month: 24, ideal: 86.4, "-2": 80.0, "2": 92.9 },
    { month: 36, ideal: 95.1, "-2": 87.4, "2": 102.7 },
    { month: 48, ideal: 102.7, "-2": 94.1, "2": 111.3 },
    { month: 60, ideal: 109.4, "-2": 99.9, "2": 118.9 },
];

/**
 * Mendapatkan nilai ideal interpolasi berdasarkan bulan untuk jenis kelamin tertentu
 */
export const getWhoIdealValue = (month: number, gender: string, type: 'weight' | 'height') => {
    const dataSet = type === 'weight' 
        ? (gender === 'L' ? whoWeightBoys : whoWeightGirls)
        : (gender === 'L' ? whoHeightBoys : whoHeightGirls);
    
    // Cari rentang bulan
    const exactMatch = dataSet.find(d => d.month === month);
    if (exactMatch) return exactMatch.ideal;

    const lower = [...dataSet].reverse().find(d => d.month < month);
    const upper = dataSet.find(d => d.month > month);

    if (!lower) return dataSet[0].ideal;
    if (!upper) return dataSet[dataSet.length - 1].ideal;

    // Interpolasi linear
    const diffMonth = upper.month - lower.month;
    const diffVal = upper.ideal - lower.ideal;
    const val = lower.ideal + ((month - lower.month) / diffMonth) * diffVal;
    
    return parseFloat(val.toFixed(1));
};
