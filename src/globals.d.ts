declare module '@rdilshan/gn-division' {
    export function getDistricts(): string[];
    export function getCities(districtName: string): string[];
    export function getDNDivisions(districtName: string, cityName: string): string[];
}

