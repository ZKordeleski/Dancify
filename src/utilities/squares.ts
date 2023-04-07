export{

}

let sideLength: number;
let area: number;
let sideLengthsTotal = 0;
let areasTotal = 0;
let sideLengths = [];
let areas = [];

let i = 0
while (i < 1000) {
    sideLength = Math.random()*4;
    sideLengths.push(sideLength);
    sideLengthsTotal += sideLength;
    area = sideLength^2;
    areas.push(area);
    areasTotal += area;
}