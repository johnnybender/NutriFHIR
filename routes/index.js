const express = require('express');
const path = require('path');

const cdsServices = require('../data/cds-services.json');
const nutrifhir = require('../data/cds-nutrifhir.json');

const router = express.Router();

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// GET /
router.get('/', function(req, res, next) {
  res.render('index', {title: 'NutriFHIR'});
});

// GET /summary
router.get('/summary', function(req, res, next) {
  res.locals.authenticated = true;
  res.render('summary', {title: 'Summary'});
});

// GET /patient
router.get('/patient', function(req, res, next) {
  res.locals.authenticated = true;
  res.render('patient', {title: 'Patient'});
});

// GET /diet
router.get('/diet', function(req, res, next) {
  res.locals.authenticated = true;
  res.render('diet', {title: 'Personal Diet'});
});

// GET /medications
router.get('/medications', function(req, res, next) {
  res.locals.authenticated = true;
  res.render('medications', {title: 'Medications'});
});

// GET /environment
router.get('/environment', function(req, res, next) {
  res.locals.authenticated = true;
  res.render('environment', {title: 'Environment'});
});

// GET /launchPatient
router.get('/launchPatient', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/launch-patient.html'));
});

// GET /launchProvider
router.get('/launchProvider', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/launch.html'));
});

// GET /cds-services
router.get('/cds-services', function(req, res, next) {
  res.json(cdsServices);
});

// POST /cds-services/nutrifhir
router.post('/cds-services/nutrifhir', function(req, res, next) {
  res.json(nutrifhir);
});

// GET /img/apple
router.get('/img/apple', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/images/apple.png'));
});

module.exports = router;
