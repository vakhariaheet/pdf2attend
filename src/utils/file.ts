export const fileSizeCalculator = (size: number, options?: {
    unit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';
    decimalPlaces?: number;
}) => {
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    const unit = units.indexOf(options?.unit || 'MB');
    const decimalPlaces = options?.decimalPlaces ;
    const result = size / Math.pow(1024, unit);
    return decimalPlaces?result.toFixed(decimalPlaces):result;
};