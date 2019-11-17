let millingHourlyRate = 300;
let edgingHourlyRate = 200;
let assemblyHourlyRate = 100;
let minPerComponent = 6;
let minPerDrawer =  10;
let minPerHinge = 2.5;
let minPerHandle = 2.5;
let CNCLMPerMin = 4;
let edgingPerMin = 2;
const GablesQ = 2;
const BottomQ = 1;
const BackQ  = 1;
const RailsQ = 2;
const KickboardFrontBackQ = 2;
const KickboardGussets = 3;
const DoorsQ = 2;
const PanelsQ = 1;
const InfillsQ = 1;
const KickboardFace = 1;
const DrawerBottom = 3;
const DrawerBack = 3;
const DoorBase2C = 7;
const DoorBase2D = 4;
const DrawerBase3C = 8;
const DrawerBase3D = 6;
const DoorUpper2C = 5;
const DoorUpper2D = 3;
const DoorTall2C = 7;
const DoorTall2D = 4;

function BaseCalculations(L, W, Q, EW1, EL1, EW2, EL2, label) {
    let m2Board = ((L * W) * Q) / 1000000;
    let lmMilling = (((L * 2)+(W * 2)) * Q) / 1000;
    let lmEdging = (((EW1 * W)+(EL1 * L)+(EW2 * W)+(EL2 * L)) * Q) / 1000;
    let partLabour = Q;
    return [m2Board, lmMilling, lmEdging, partLabour, label];
}

function CostCalculations(m2Sum, m2Cost, lmSum, lmCost, lmEdgingSum, lmEdgingMaterialCost, lmEdgingLabourCost, partSum, partLabourCost){
    let m2Total = m2Sum * m2Cost;
    let lmTotal = lmSum * lmCost;
    let lmEdgingMaterialTotal = lmEdgingSum * lmEdgingMaterialCost;
    let lmEdgingLabourTotal = lmEdgingSum * lmEdgingLabourCost;
    let partTotal = partSum * partLabourCost;
    m2Total = Math.round(m2Total * 100) / 100;
    lmTotal = Math.round(lmTotal * 100) / 100;
    lmEdgingMaterialTotal = Math.round(lmEdgingMaterialTotal * 100) / 100;
    lmEdgingLabourTotal = Math.round(lmEdgingLabourTotal * 100) / 100;
    partTotal = Math.round(partTotal * 100) / 100;
    console.log(m2Total);
    console.log(lmTotal);
    console.log(lmEdgingMaterialTotal);
    console.log(lmEdgingLabourTotal);
    console.log(partTotal);
}

function MainCalculations(H, W, D, Type, shelfCount, materialCost) {
    let carcaseStorage = [];
    let doorsPanelsStorage = [];
    carcaseStorage.push(BaseCalculations(H, D, GablesQ, 1, 0, 1, 1));
    carcaseStorage.push(BaseCalculations(W, D, BottomQ, 0,0,0,1));
    carcaseStorage.push(BaseCalculations(H, W, BackQ,0,0,1,0));


    doorsPanelsStorage.push(BaseCalculations(H, D, PanelsQ,1,0,1,1));
    doorsPanelsStorage.push(BaseCalculations(H, 150, InfillsQ,1,0,1,1));
    if (Type === "2_Door_Tall") {
        carcaseStorage.push(BaseCalculations(W, D, shelfCount,1,1,1,1));
        carcaseStorage.push(BaseCalculations(W, 100, RailsQ,0,1,0,1));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardFrontBackQ,0,0,0,0));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardGussets,0,0,0,0));
        doorsPanelsStorage.push(BaseCalculations(H, W/2, DoorsQ,1,1,1,1));
        doorsPanelsStorage.push(BaseCalculations(120, W, KickboardFace,0,0,0,0));
    } else if (Type === "2_Door_Upper") {
        carcaseStorage.push(BaseCalculations(W, D, shelfCount,1,1,1,1));
        carcaseStorage.push(BaseCalculations(W, D, 1,0,1,0,1));
        doorsPanelsStorage.push(BaseCalculations(H, W/2, DoorsQ,1,1,1,1));
    } else if (Type === "3_Drawer_Base") {
        carcaseStorage.push(BaseCalculations(W-76, 500, 3,0,0,0,1));
        carcaseStorage.push(BaseCalculations(W-76, 180, 3,0,0,0,1));
        carcaseStorage.push(BaseCalculations(W, 100, RailsQ,0,1,0,1));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardFrontBackQ,0,0,0,0));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardGussets,0,0,0,0));
        doorsPanelsStorage.push(BaseCalculations(H/3, D, 3,1,1,1,1));
        doorsPanelsStorage.push(BaseCalculations(120, W, KickboardFace,0,0,0,0));
    } else if (Type === "2_Door_Base"){
        carcaseStorage.push(BaseCalculations(W, D, shelfCount,1,1,1,1));
        carcaseStorage.push(BaseCalculations(W, 100, RailsQ,0,1,0,1));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardFrontBackQ,0,0,0,0));
        carcaseStorage.push(BaseCalculations(W, 120, KickboardGussets,0,0,0,0,));
        doorsPanelsStorage.push(BaseCalculations(H, W/2, DoorsQ,1,1,1,1));
        doorsPanelsStorage.push(BaseCalculations(120, W, KickboardFace,0,0,0,0));
    } else {
        return {error:"Unknown Cabinet Type"}
    }
    let m2CarcaseSum = 0;
    let lmCarcaseSum = 0;
    let lmEdgingCarcaseSum = 0;
    let partCarcaseSum = 0;
    let m2DoorsSum = 0;
    let lmDoorsSum = 0;
    let lmEdgingDoorsSum = 0;
    let partDoorsSum = 0;
   for (let i = 0; i < carcaseStorage.length; i++){
       let temp = carcaseStorage[i];
       m2CarcaseSum += temp[0];
       lmCarcaseSum += temp[1];
       lmEdgingCarcaseSum += temp[2];
       partCarcaseSum += temp[3];
   }
   for (let i = 0; i < doorsPanelsStorage.length; i++){
       let temp = doorsPanelsStorage[i];
       m2DoorsSum += temp[0];
       lmDoorsSum += temp[1];
       lmEdgingDoorsSum += temp[2];
       partDoorsSum += temp[3];
   }
   CostCalculations(m2CarcaseSum,9.52, lmCarcaseSum,(millingHourlyRate/60)/CNCLMPerMin,
       lmEdgingCarcaseSum, 0.2, (edgingHourlyRate/60)/edgingPerMin, partCarcaseSum,
       assemblyHourlyRate/(60/minPerComponent));

   CostCalculations(m2DoorsSum,materialCost, lmDoorsSum,(millingHourlyRate/60)/CNCLMPerMin,
       lmEdgingDoorsSum, 1.15, (edgingHourlyRate/60)/edgingPerMin, partDoorsSum,
       assemblyHourlyRate/(60/minPerComponent));

}

module.exports.Calculations = MainCalculations;
