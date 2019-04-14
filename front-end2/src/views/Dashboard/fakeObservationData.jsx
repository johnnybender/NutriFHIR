import React from 'react';

const n = 17;
var dates = Array(n).fill().map(() => new Date());
dates.forEach((d,i) => {
    d.setHours(d.getHours() + i*24);
});

var loinc_uri = "https://s.details.loinc.org/LOINC/2085-9.html?sections=Comprehensive";
var loinc = <a href={loinc_uri} rel="noopener noreferrer" target="_blank">LOINC</a>

const data = {
    observations: [
        ["Blood Presure", "2018-01-30", 158, 'good']
    ],
    observation_dict: {
        HDL: { 
            data: {
                labels: dates.map(d => d.toLocaleDateString("en-US")),
                datasets: [
                    {data:[4,4,3,4,4,4,5,5,6,7,6,6,5,4,4,4,3].map(n => n), label: 'value', fill:false, pointBorderColor: 'rgba(75, 192, 192, 1)', borderColor:'rgba(75,192,192,1)'},
                    {data: Array(n).fill().map(() => 6), label:'high', fill:false, borderColor:'rgba(255,0,0,1)'},
                    {data: Array(n).fill().map(() => 3), label:'low', fill:false, borderColor:'rgba(255,0,0,1)'},
                ]
            },
            loinc: loinc,
        },
    },
    observation_tags: ['HDL']
};

export default data;