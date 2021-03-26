const inpdate=document.getElementById("date");
const inpinflow=document.getElementById("inflow");
const inpoutflow=document.getElementById("outflow");
const btninsert=document.getElementById("btninsert");
const output=document.getElementById("lsoutput");
const output1=document.getElementById("lsoutput1");
const minfilter=document.getElementById("minfilter");
const maxfilter=document.getElementById("maxfilter");
const btnfilter=document.getElementById("btnfilter");
const btnreset=document.getElementById("btnreset");
const burn=document.getElementById("burn");
const startdate=document.getElementById("startdate");
const enddate=document.getElementById("enddate");
const btndate=document.getElementById("btndate");
const show=document.getElementById("show");
btnreset.onclick= function(){
    localStorage.clear();
    location.reload();
};
btninsert.onclick = function(){
    const key=inpdate.value;
    const keyin=key.concat("in");
    const keyout=key.concat("out");
    const inflow=inpinflow.value;
    const outflow=inpoutflow.value;
    if (key && inflow){
        localStorage.setItem(keyin,inflow);
        location.reload();
    }
    if (key && outflow){
        localStorage.setItem(keyout,outflow);
        location.reload();
    }
};

let arroutflow=[];
let arrinflow=[];
let arrnetflow=[];
for(let i=0; i<localStorage.length; i++){
key1=localStorage.key(i);
f=parseInt(localStorage.getItem(key1));
if(key1.substring(8,12)=="out"){
    let f1=-f;
    let t={date:parseInt(key1.substring(0,8)),flow:f1};
    let b={date:parseInt(key1.substring(0,8)),flow:f1};
    arroutflow.push(t); 
    arrnetflow.push(b); 
}
if(key1.substring(8,11)=="in"){
    const t={date:parseInt(key1.substring(0,8)),flow:f};
    arrinflow.push(t);  
}
}

for(let i=0;i<arrinflow.length; i++){
let ch=0;
for(let j=0;j<arrnetflow.length;j++){
    if (arrinflow[i].date==arrnetflow[j].date){
        ch=-1;
        arrnetflow[j].flow = arrnetflow[j].flow + arrinflow[i].flow;
        break;
    }
}
if(ch==0){
    arrnetflow.push(arrinflow[i]);
}
}

// sorting
arroutflow.sort(function(a,b){
    return a.date-b.date;
});

arrinflow.sort(function(a,b){
     return a.date-b.date;
});

arrnetflow.sort(function(a,b){
     return a.date-b.date;
});


function dateformat(a){
b=a.toString();
c=b[6]+b[7]+"/"+b[4]+b[5]+"/"+b[0]+b[1]+b[2]+b[3];
return c;
}


//search results
btnfilter.onclick = function(){
const min = minfilter.value;
const max = maxfilter.value;
output.innerHTML = `${"Your results would be here"}<br/>`;
for(let i=0; i<arrnetflow.length; i++){
   if(arrnetflow[i].flow>min && arrnetflow[i].flow<max){
   let d=arrnetflow[i].date;
   let date=dateformat(d);
   const flow=arrnetflow[i].flow;
   output.innerHTML +=`${date}  :  ${flow} Rs <br/>`;
}
}   
};
//search results
btndate.onclick = function(){
    const min = startdate.value;
    const max = enddate.value;
    output1.innerHTML = `${"Your results would be here"}<br/>`;
    for(let i=0; i<arrnetflow.length; i++){
       if(arrnetflow[i].date>min && arrnetflow[i].date<max){
       let d=arrnetflow[i].date;
       let date=dateformat(d);
       const flow=arrnetflow[i].flow;
       output1.innerHTML +=`${date}  :  ${flow} Rs <br/>`;
    }
    }   
    };
function flowfuc(a){
l=[]
for(let i=0;i<a.length;i++){
    l.push(a[i].flow);
}
return l;
}

function datefuc(a){
l=[]
for(let i=0;i<a.length;i++){
    let k=dateformat(a[i].date);
    l.push(k);
}
return l;
}

function totolfuc(a){
tot=[];
s=0;
for(let i=0;i<a.length;i++){
    s = s + a[i];
    tot.push(s);
}
return tot;
}


//burn out calc
let s=0;
for(let i=0;i<arrnetflow.length;i++){
s=s+arrnetflow[i].flow;
}
let s1=0;
for(let i=0;i<arroutflow.length;i++){
s1=s1-arroutflow[i].flow;
}
let burnrate=s1/arroutflow.length;
let days=s/burnrate;
burn.innerHTML+= `Burn Rate Is - ${burnrate} Rs/day `;

//Show Results
show.innerHTML = `Your balance is ${s} Rs...  Latest Netflow is ${arrnetflow[arrnetflow.length-1].flow} Rs <br/>Latest Outflow is ${arroutflow[arroutflow.length-1].flow} Rs....    Latest Inflow is ${arrinflow[arrinflow.length-1].flow} Rs <br/>  `

// balance chart 
var ctx = document.getElementById('balancechart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'line',
data: {
    labels: datefuc(arrnetflow),
    datasets: [{
        label: 'Banance analysis',
        data: totolfuc(flowfuc(arrnetflow)),
        backgroundColor: 
            'rgba(102, 249, 147, 0.5)',
        borderColor: 'rgba(102, 249, 147, 1)',
        borderWidth: 1
    }]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});

// netflow chart 
var ctx = document.getElementById('netflowchart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'bar',
data: {
    labels: datefuc(arrnetflow),
    datasets: [{
        label: 'Net total flow of money',
        data: flowfuc(arrnetflow),
        backgroundColor: 
            'rgba(161, 246, 242, 0.5)',
        borderColor: 'rgba(161, 246, 242, 1)',
        borderWidth: 1
    }]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
// inflow chart
var ctx = document.getElementById('inflowchart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'bar',
data: {
    labels: datefuc(arrinflow),
    datasets: [{
        label: 'Net inflow of money',
        data: flowfuc(arrinflow),
        backgroundColor: 
            'rgba(152, 249, 107, 0.5)',
        borderColor: 'rgba(152, 249, 107, 1)',
        borderWidth: 1
    }]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
//outflow chart
var ctx = document.getElementById('outflowchart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'bar',
data: {
    labels: datefuc(arroutflow),
    datasets: [{
        label: 'Net outflow of money',
        data: flowfuc(arroutflow),
        backgroundColor: 
            'rgba(239, 35, 35, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
