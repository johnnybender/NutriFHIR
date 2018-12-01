(function() {
/* Get static data - Eventually Johnny will have an api/specification for this
 */
populateDietaryData();

/* Get data from EHR */
FHIR.oauth2.ready(onReady, onError);

/* HEI Listeners */
try {
  document.getElementById('hei_value')
      .addEventListener('click', heiHandler_click, false);
} catch (err) {
  console.log(err);
}
/* AHEI Listeners */
try {
  document.getElementById('ahei_value')
      .addEventListener('click', aheiHandler_click, false);
} catch (err) {
  console.log(err);
}

/* DASH Listeners */
try {
  document.getElementById('dash_value')
      .addEventListener('click', dashHandler_click, false);
} catch (err) {
  console.log(err);
}
/* NutriSavings Listeners */
try {
  document.getElementById('nutrisavings_value')
      .addEventListener('click', nutrisavingsHandler_click, false);
} catch (err) {
  console.log(err);
}

/* Height Listener */
try {
  document.getElementById('height-text')
      .addEventListener('click', heightHandler, false);
} catch (err) {
  console.log(err);
}
/* Weight Listener */
try {
  document.getElementById('weight-text')
      .addEventListener('click', weightHandler, false);
} catch (err) {
  console.log(err);
}
/* BMI Listener */
try {
  document.getElementById('bmi-score')
      .addEventListener('click', bmiHandler, false);
} catch (err) {
  console.log(err);
}
/* Glucose Listener */
try {
  document.getElementById('gluc-score')
      .addEventListener('click', glucoseHandler, false);
} catch (err) {
  console.log(err);
}
/* HbA1c Listener */
try {
  document.getElementById('hba1c-score')
      .addEventListener('click', hba1cHandler, false);
} catch (err) {
  console.log(err);
}
/* BP Listener */
try {
  document.getElementById('bp-overall')
      .addEventListener('click', bpHandler, false);
} catch (err) {
  console.log(err);
}
/* Total Cholesterol Listener */
try {
  document.getElementById('chol').addEventListener('click', cholHandler, false);
} catch (err) {
  console.log(err);
}
/* HDL Listener */
try {
  document.getElementById('hdl-score')
      .addEventListener('click', hdlHandler, false);
} catch (err) {
  console.log(err);
}
/* LDL Listener */
try {
  document.getElementById('ldl-score')
      .addEventListener('click', ldlHandler, false);
} catch (err) {
  console.log(err);
}
/* Toggle Handlers */
try {
  document.getElementById('CS').addEventListener('click', csHandler, false);

  document.getElementById('SM').addEventListener('click', smHandler, false);

  document.getElementById('FM').addEventListener('click', fmHandler, false);
} catch (err) {
  console.log(err);
}

function waitForElement() {
  if (pat_addr == 'NA') {
    return;
  } else if (typeof pat_addr !== 'undefined' && pat_addr !== 'NA') {
    // console.log('got patient address for map data!');
    // console.log(pat_addr);
    if (typeof plotMap === 'function') {
      plotMap(pat_addr, 'Groceries');
    }
    // variable exists, do what you want
  } else {
    // console.log("wait");
    setTimeout(waitForElement, 250);
  }
}

try {
  waitForElement();
} catch (err) {
  console.log(err);
}

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