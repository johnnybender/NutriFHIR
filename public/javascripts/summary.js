(function() {
/* Get static data - Eventually Johnny will have an api/specification for this
 */
populateDietaryData();

/* Get data from EHR */
FHIR.oauth2.ready(onReady, onError);

/* HEI Listeners */
document.getElementById('hei_value')
    .addEventListener('click', heiHandler_click, false);

/* AHEI Listeners */
document.getElementById('ahei_value')
    .addEventListener('click', aheiHandler_click, false);

/* DASH Listeners */
document.getElementById('dash_value')
    .addEventListener('click', dashHandler_click, false);

/* NutriSavings Listeners */
document.getElementById('nutrisavings_value')
    .addEventListener('click', nutrisavingsHandler_click, false);


/* Height Listener */
document.getElementById('height-text')
    .addEventListener('click', heightHandler, false);

/* Weight Listener */
document.getElementById('weight-text')
    .addEventListener('click', weightHandler, false);

/* BMI Listener */
document.getElementById('bmi-score')
    .addEventListener('click', bmiHandler, false);

/* Glucose Listener */
document.getElementById('gluc-score')
    .addEventListener('click', glucoseHandler, false);

/* HbA1c Listener */
document.getElementById('hba1c-score')
    .addEventListener('click', hba1cHandler, false);

/* BP Listener */
document.getElementById('bp-overall')
    .addEventListener('click', bpHandler, false);

/* Total Cholesterol Listener */
document.getElementById('chol').addEventListener('click', cholHandler, false);

/* HDL Listener */
document.getElementById('hdl-score')
    .addEventListener('click', hdlHandler, false);

/* LDL Listener */
document.getElementById('ldl-score')
    .addEventListener('click', ldlHandler, false);

/* Toggle Handlers */
document.getElementById('CS').addEventListener('click', csHandler, false);

document.getElementById('SM').addEventListener('click', smHandler, false);

document.getElementById('FM').addEventListener('click', fmHandler, false);


function waitForElement() {
  if (pat_addr == 'NA') {
    return;
  } else if (typeof pat_addr !== 'undefined' && pat_addr !== 'NA') {
    // console.log('got patient address for map data!');
    // console.log(pat_addr);
    plotMap(pat_addr, 'Groceries');
    // variable exists, do what you want
  } else {
    // console.log("wait");
    setTimeout(waitForElement, 250);
  }
}

waitForElement();

$(function() {
  $('#summary').sortable({
    overflow: 'visible',
    handle: '.movable',
  });

  //$( "#summary" ).sortable({
  //  handle: ".card"
  //});
  $('#summary').disableSelection({overflow: 'visible'});
});
})();