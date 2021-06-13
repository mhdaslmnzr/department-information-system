// This is for able to see chart. We are using Apex Chart. U can check the documentation of Apex Charts too..
var ctxL = document.getElementById("lineChart").getContext('2d');
  var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
      labels: ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"],
      datasets: [{
          label: "CE",
          data: [81, 56, 55, 40],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(255, 0, 0)',
          ],
          borderWidth: 2
        },
        {
          label: "CSE",
          data: [28, 48, 40, 90],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(0,0,255)',
          ],
          borderWidth: 2
        },

        {
          label: "EC",
          data: [40, 25, 55, 40],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(255,0,255)',
          ],
          borderWidth: 2
        },
        {
          label: "EEE",
          data: [40, 25, 48, 52],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(255,165,0)',
          ],
          borderWidth: 2
        },
        {
          label: "IT",
          data: [10, 78, 40, 50],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(0,128,0)',
          ],
          borderWidth: 2
        },

        {
          label: "ME",
          data: [8, 35, 20, 26],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(128,128,0)',
          ],
          borderWidth: 2
        },

        {
          label: "SF",
          data: [33, 49, 75, 50],
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
          ],
          borderColor: [
            'rgb(112,128,144)',
          ],
          borderWidth: 2
        }

      ]
    },
    options: {
      responsive: true
    }
  });
  chart.render();



//logout-popup

function togglePopup(){
  document.getElementById("popup-1").classList.toggle("active");
  setTimeout('Redirect()', 5000);  
}

function Redirect() 
  {  
      window.location="logout.html"; 
  } 



//buttons on sidebarmanagement

function mainshow1()
{
document.getElementById("main1").style.display="inline";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow2()
{
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="inline";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow3()
{
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="inline";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow4()
{
document.getElementById("main4").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow5()
{
document.getElementById("main5").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow6()
{
document.getElementById("main6").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}

function mainshow7()
{
document.getElementById("main7").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow8()
{
document.getElementById("main8").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow9()
{
document.getElementById("main9").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}

function mainshow10()
{
document.getElementById("main10").style.display="inline";
document.getElementById("main9").style.display="none";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("home").style.display="none";
}

//notice
function mainshow14()
{
document.getElementById("main14").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow15 ()
{
document.getElementById("main15").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow16()
{
document.getElementById("main16").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow17()
{
document.getElementById("main17").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main18").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("home").style.display="none";
}
function mainshow18()
{
document.getElementById("main18").style.display="inline";
document.getElementById("main1").style.display="none";
document.getElementById("main2").style.display="none";
document.getElementById("main3").style.display="none";
document.getElementById("main4").style.display="none";
document.getElementById("main5").style.display="none";
document.getElementById("main7").style.display="none";
document.getElementById("main8").style.display="none";
document.getElementById("main9").style.display="none";
document.getElementById("main14").style.display="none";
document.getElementById("main15").style.display="none";
document.getElementById("main6").style.display="none";
document.getElementById("main17").style.display="none";
document.getElementById("main16").style.display="none";
document.getElementById("main10").style.display="none";
document.getElementById("home").style.display="none";
}



//inside buttons on admn management
function show_hide1()
{
document.getElementById("one").style.display="inline";
document.getElementById("two").style.display="none";
document.getElementById("three").style.display="none";
document.getElementById("four").style.display="none";

}

function show_hide2()
{
document.getElementById("one").style.display="none";
document.getElementById("two").style.display="inline";
document.getElementById("three").style.display="none";
document.getElementById("four").style.display="none";
}

function show_hide3()
{
document.getElementById("one").style.display="none";
document.getElementById("two").style.display="none";
document.getElementById("three").style.display="inline";
document.getElementById("four").style.display="none";
}

function show_hide4()
{
document.getElementById("one").style.display="none";
document.getElementById("two").style.display="none";
document.getElementById("three").style.display="none";
document.getElementById("four").style.display="inline";
}
//inside buttons on teacher management
function show_hide5()
{
document.getElementById("tone").style.display="inline";
document.getElementById("ttwo").style.display="none";
document.getElementById("tthree").style.display="none";
document.getElementById("tfour").style.display="none";

}

function show_hide6()
{
document.getElementById("tone").style.display="none";
document.getElementById("ttwo").style.display="inline";
document.getElementById("tthree").style.display="none";
document.getElementById("tfour").style.display="none";
}

function show_hide6u()
{
document.getElementById("tone").style.display="none";
document.getElementById("ttwo").style.display="none";
document.getElementById("tthree").style.display="inline";
document.getElementById("tfour").style.display="none";
}

function show_hide8()
{
document.getElementById("tone").style.display="none";
document.getElementById("ttwo").style.display="none";
document.getElementById("tthree").style.display="none";
document.getElementById("tfour").style.display="inline";
}

//inside buttons on student management
function show_hide9()
{
document.getElementById("sone").style.display="inline";
document.getElementById("stwo").style.display="none";
document.getElementById("sthree").style.display="none";
document.getElementById("sfour").style.display="none";
}

function show_hide10()
{
document.getElementById("sone").style.display="none";
document.getElementById("stwo").style.display="inline";
document.getElementById("sthree").style.display="none";
document.getElementById("sfour").style.display="none";
}
function show_hide10u()
{
document.getElementById("sone").style.display="none";
document.getElementById("stwo").style.display="none";
document.getElementById("sthree").style.display="inline";
document.getElementById("sfour").style.display="none";
}

function show_hide12()
{
document.getElementById("sone").style.display="none";
document.getElementById("stwo").style.display="none";
document.getElementById("sthree").style.display="none";
document.getElementById("sfour").style.display="inline";
}

//inside buttons on requests-teachers
function show_hide13()
{
document.getElementById("rtwo").style.display="none";
document.getElementById("rthree").style.display="none";
document.getElementById("rone").style.display="inline";
}
function show_hide14()
{
document.getElementById("rone").style.display="none";
document.getElementById("rthree").style.display="none";
document.getElementById("rtwo").style.display="inline";
}
function show_hide15()
{
document.getElementById("rone").style.display="none";
document.getElementById("rtwo").style.display="none";
document.getElementById("rthree").style.display="inline";
}
//inside buttons on requests-students
function show_hide16()
{
document.getElementById("rstwo").style.display="none";
document.getElementById("rsthree").style.display="none";
document.getElementById("rsone").style.display="inline";
}
function show_hide17()
{
document.getElementById("rsone").style.display="none";
document.getElementById("rsthree").style.display="none";
document.getElementById("rstwo").style.display="inline";
}
function show_hide18()
{
document.getElementById("rsone").style.display="none";
document.getElementById("rstwo").style.display="none";
document.getElementById("rsthree").style.display="inline";
}
//inside buttons on 2015 scheme
function show_hide19()
{
document.getElementById("pdftwo").style.display="none";
document.getElementById("pdfone").style.display="inline";
}
function show_hide20()
{
document.getElementById("pdfone").style.display="none";
document.getElementById("pdftwo").style.display="inline";
}
//inside buttons on 2019 scheme
function show_hide21()
{
document.getElementById("pdf2019two").style.display="none";
document.getElementById("pdf2019one").style.display="inline";
}
function show_hide22()
{
document.getElementById("pdf2019one").style.display="none";
document.getElementById("pdf2019two").style.display="inline";
}
//inside buttons on add/delete scheme and syllabus
function show_hide23()
{
document.getElementById("sytwo").style.display="none";
document.getElementById("syone").style.display="inline";
}
function show_hide24()
{
document.getElementById("syone").style.display="none";
document.getElementById("sytwo").style.display="inline";
}

//box buttons - notice
function show_hide25()
{
document.getElementById("noticetwo").style.display="none";
document.getElementById("noticeone").style.display="inline";
}
function show_hide26()
{
document.getElementById("noticeone").style.display="none";
document.getElementById("noticetwo").style.display="inline";
}
//box buttons - news
function show_hide27()
{
document.getElementById("newstwo").style.display="none";
document.getElementById("newsone").style.display="inline";
document.getElementById("newsthree").style.display="none";
}
function show_hide28()
{
document.getElementById("newsone").style.display="none";
document.getElementById("newstwo").style.display="inline";
document.getElementById("newsthree").style.display="none";
}
function show_hide29()
{
document.getElementById("newsone").style.display="none";
document.getElementById("newstwo").style.display="none";
document.getElementById("newsthree").style.display="inline";
}