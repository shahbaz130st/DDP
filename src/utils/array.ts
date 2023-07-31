export function arraysHaveSameNumbers(arrayA: any[], arrayB: any[]) {
    if (arrayA.length !== arrayB.length) return false;
    return arrayA.every(num => arrayB.includes(num));
}