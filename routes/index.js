var express = require('express');
let router = express.Router();
let MainCalculations = require('../Functions/Calculations.js');
let currentJob = 1;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/materials', function (req, res, next) {
  let query = req.db.from('materials').select('*')
      .then((rows)=>{
        res.json({"Response":rows});
      })
});
router.get('/data', function (req, res, next) {
  let query = req.db.from('cabinetselection')
      .select('*')
      .then((cabinets)=>{
        let query2 = req.db.from('drawertable')
            .select('*')
            .where('cabinetKey', '=' , '1')
            .then((drawers)=>{
                res.json({"Cabinets":cabinets, "Draws":drawers})
            })
      })
});

router.post('/add/cabinet', function (req, res, next) {
    var cabinetCategory = req.body.cabinetCategory;
    var cabinetWidth = req.body.cabintWidth;
    var cabinetHeight = req.body.cabinetHeight;
    var cabinetDepth = req.body.cabinetDepth;
    var kickboardHeight = req.body.kickboardHeight;
    var cabinetType = req.body.cabinetType;
    var carcaseMaterial = req.body.carcaseMaterial;
    var doorMaterial = req.body.doorMaterial;
    var doorHandle = req.body.doorHandle;
    var drawerType = req.body.drawerType;
    var endPanels = req.body.endPanels;
    var infills = req.body.infills;
    class Drawer {
        constructor(drawerType, frontHeight, drawerHeight, drawerDepth){
            this.type = drawerType;
            this.frontHeight = frontHeight;
            this.drawerHeight = drawerHeight;
            this.drawerDepth = drawerDepth;
        }
    }
    var topDrawer = new Drawer("Top_Drawer", req.body.TDFrontHeight, req.body.TDDrawerHeight, req.body.TDDrawerDepth);
    var secondDrawer = new Drawer("Second_Drawer", req.body.SDFrontHeight, req.body.SDDrawerHeight, req.body.SDDrawerDepth);
    var bottomDrawer = new Drawer("Bottom_Drawer", req.body.BDFrontHeight, req.body.BDDrawerHeight, req.body.BDDrawerDepth);
    var shelfQty = req.body.shelfQty;
    var cabinetCount = req.body.cabinetCount;
    var drawers = [topDrawer, secondDrawer, bottomDrawer];
    req.db.from('cabinetselection').insert({
        cabinetCategory:cabinetCategory,
        cabinetWidth:cabinetWidth,
        cabinetHeight:cabinetHeight,
        cabinetDepth:cabinetDepth,
        kickboardHeight:kickboardHeight,
        cabinetType:cabinetType,
        carcaseMaterial:carcaseMaterial,
        doorMaterial:doorMaterial,
        handle:doorHandle,
        drawerType:drawerType,
        endPanels:endPanels,
        infills:infills,
        jobKey:1,
        cabinetKey:2,
        // cabinetCount:cabinetCount
        })
        .then((rows)=>{
            for (let i = 0; i < 3; i++){
                if (i === 0){
                    let drawer = topDrawer;
                } else if (i === 1){
                    let drawer = secondDrawer;
                } else {}
                let drawer = bottomDrawer;
                req.db.from('drawertable').insert({
                    type:drawer.type,
                    frontHeight:drawer.frontHeight,
                    drawerHeight:drawer.drawerHeight,
                    drawerDepth:drawer.drawerDepth,
                    jobKey:1,
                    cabinetKey:1
                })
                    .catch((err) =>{
                        res.status(500).send({error:err})
                    })
            }
            res.json({"Message":"Success"})
        })
        .catch((err)=>{
            res.status(500).send({error:err})
        });
});
router.get("/test", function (req, res, next) {
    req.db.from('cabinetselection').select('doorMaterial').where('jobKey','=', currentJob)
        .then((rows) => {
            let test = JSON.stringify(rows);
            let regex = /[A-Za-z1-9]+(?=_)/g;
            regex.compile(regex);
            let data = [];
            data.push(regex.exec(test));
            data.push(regex.exec(test));
            data.push(regex.exec(test));
            req.db.from('material').select('*')
        });
    MainCalculations.Calculations(2250, 1000, 580, "2_Door_Tall", 1, 42.08)
});
router.post("/add/roomparams", function (req, res, next) {
    var room = req.body.room;
    var jobKey = req.body.jobKey;
    var kickboardHeight = req.body.kickboardHeight;
    var benchHeight = req.body.benchHeight;
    var benchTopThickness = req.body.benchTopThickness;
    var benchTopOverhang = req.body.benchTopOverhang;
    var splashbackHeight = req.body.splashbackHeight;
    var overheadCabinetHeight = req.body.overheadCabinetHeight;
    var overheadCabinetDepth = req.body.overheadCabinetDepth;
    var tallCabinetHeight = req.body.tallCabinetHeight;
    var tallCabinetDepth = req.body.tallCabinetDepth;
    var ceilingHeight = req.body.ceilingHeight;
    req.db.from('cabinetselection').insert({
        room:room,
        kickboardHeight:kickboardHeight,
        benchHeight:benchHeight,
        benchTopThickness:benchTopThickness,
        benchTopOverhang:benchTopOverhang,
        splashbackHeight:splashbackHeight,
        overheadCabinetHeight:overheadCabinetHeight,
        overheadCabinetDepth:overheadCabinetDepth,
        tallCabinetHeight:tallCabinetHeight,
        tallCabinetDepth:tallCabinetDepth,
        ceilingHeight:ceilingHeight,
        jobKey:jobKey})
        .then((rows)=>{
            res.json({"Message":"INSERT SUCCESSFUL",rows})
        })
        .catch((err)=>{
            res.status(500).send({error:err})
        });
});
module.exports = router;
