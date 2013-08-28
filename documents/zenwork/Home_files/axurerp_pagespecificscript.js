
var PageName = 'Home';
var PageId = '52fffa8b498a463299105dac9ebdd058'
var PageUrl = 'Home.html'
document.title = 'Home';
var PageNotes = 
{
"pageName":"Home",
"showNotesNames":"False"}
var $OnLoadVariable = '';

var $CSUM;

var hasQuery = false;
var query = window.location.hash.substring(1);
if (query.length > 0) hasQuery = true;
var vars = query.split("&");
for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0].length > 0) eval("$" + pair[0] + " = decodeURIComponent(pair[1]);");
} 

if (hasQuery && $CSUM != 1) {
alert('Prototype Warning: The variable values were too long to pass to this page.\nIf you are using IE, using Firefox will support more data.');
}

function GetQuerystring() {
    return '#OnLoadVariable=' + encodeURIComponent($OnLoadVariable) + '&CSUM=1';
}

function PopulateVariables(value) {
    var d = new Date();
  value = value.replace(/\[\[OnLoadVariable\]\]/g, $OnLoadVariable);
  value = value.replace(/\[\[PageName\]\]/g, PageName);
  value = value.replace(/\[\[GenDay\]\]/g, '8');
  value = value.replace(/\[\[GenMonth\]\]/g, '3');
  value = value.replace(/\[\[GenMonthName\]\]/g, 'March');
  value = value.replace(/\[\[GenDayOfWeek\]\]/g, 'Friday');
  value = value.replace(/\[\[GenYear\]\]/g, '2013');
  value = value.replace(/\[\[Day\]\]/g, d.getDate());
  value = value.replace(/\[\[Month\]\]/g, d.getMonth() + 1);
  value = value.replace(/\[\[MonthName\]\]/g, GetMonthString(d.getMonth()));
  value = value.replace(/\[\[DayOfWeek\]\]/g, GetDayString(d.getDay()));
  value = value.replace(/\[\[Year\]\]/g, d.getFullYear());
  return value;
}

function OnLoad(e) {

}

var u370 = document.getElementById('u370');

u370.style.cursor = 'pointer';
if (bIE) u370.attachEvent("onclick", Clicku370);
else u370.addEventListener("click", Clicku370, true);
function Clicku370(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/17/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u393 = document.getElementById('u393');
gv_vAlignTable['u393'] = 'top';
var u167 = document.getElementById('u167');

u167.style.cursor = 'pointer';
if (bIE) u167.attachEvent("onclick", Clicku167);
else u167.addEventListener("click", Clicku167, true);
function Clicku167(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/29/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u299 = document.getElementById('u299');
gv_vAlignTable['u299'] = 'top';
var u465 = document.getElementById('u465');
gv_vAlignTable['u465'] = 'top';
var u421 = document.getElementById('u421');
gv_vAlignTable['u421'] = 'top';
var u202 = document.getElementById('u202');

var u180 = document.getElementById('u180');
gv_vAlignTable['u180'] = 'top';
var u136 = document.getElementById('u136');
gv_vAlignTable['u136'] = 'top';
var u216 = document.getElementById('u216');
gv_vAlignTable['u216'] = 'top';
var u194 = document.getElementById('u194');
gv_vAlignTable['u194'] = 'top';
var u72 = document.getElementById('u72');

var u333 = document.getElementById('u333');
gv_vAlignTable['u333'] = 'center';
var u97 = document.getElementById('u97');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u97ann'), "<div id='u97Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u97Note').click(function(e) { ToggleWorkflow(e, 'u97', 300, 150, false); return false; });
var u97Ann = 
{
"label":"link",
"Description":"Open attachment dialog"};
gv_vAlignTable['u97'] = 'top';
var u152 = document.getElementById('u152');
gv_vAlignTable['u152'] = 'top';
var u450 = document.getElementById('u450');

var u231 = document.getElementById('u231');

u231.style.cursor = 'pointer';
if (bIE) u231.attachEvent("onclick", Clicku231);
else u231.addEventListener("click", Clicku231, true);
function Clicku231(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/9/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u60 = document.getElementById('u60');

var u78 = document.getElementById('u78');

u78.style.cursor = 'pointer';
if (bIE) u78.attachEvent("onclick", Clicku78);
else u78.addEventListener("click", Clicku78, true);
function Clicku78(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u307','','none',500);

	SetPanelVisibility('u71','hidden','none',500);

	SetPanelVisibility('u80','hidden','none',500);

}

}

var u363 = document.getElementById('u363');
gv_vAlignTable['u363'] = 'top';
var u166 = document.getElementById('u166');
gv_vAlignTable['u166'] = 'top';
var u298 = document.getElementById('u298');
gv_vAlignTable['u298'] = 'top';
var u464 = document.getElementById('u464');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u464ann'), "<div id='u464Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u464Note').click(function(e) { ToggleWorkflow(e, 'u464', 300, 150, false); return false; });
var u464Ann = 
{
"label":"checkbox",
"Description":"Click open popup confirm workload"};

u464.style.cursor = 'pointer';
if (bIE) u464.attachEvent("onclick", Clicku464);
else u464.addEventListener("click", Clicku464, true);
function Clicku464(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u474','','none',500);

}

}

var u139 = document.getElementById('u139');

u139.style.cursor = 'pointer';
if (bIE) u139.attachEvent("onclick", Clicku139);
else u139.addEventListener("click", Clicku139, true);
function Clicku139(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/15/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u201 = document.getElementById('u201');
gv_vAlignTable['u201'] = 'top';
var u1 = document.getElementById('u1');
gv_vAlignTable['u1'] = 'center';
var u215 = document.getElementById('u215');

u215.style.cursor = 'pointer';
if (bIE) u215.attachEvent("onclick", Clicku215);
else u215.addEventListener("click", Clicku215, true);
function Clicku215(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/1/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u193 = document.getElementById('u193');

u193.style.cursor = 'pointer';
if (bIE) u193.attachEvent("onclick", Clicku193);
else u193.addEventListener("click", Clicku193, true);
function Clicku193(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/12/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u11 = document.getElementById('u11');

var u126 = document.getElementById('u126');
gv_vAlignTable['u126'] = 'top';
var u413 = document.getElementById('u413');
gv_vAlignTable['u413'] = 'top';
var u332 = document.getElementById('u332');

var u151 = document.getElementById('u151');

u151.style.cursor = 'pointer';
if (bIE) u151.attachEvent("onclick", Clicku151);
else u151.addEventListener("click", Clicku151, true);
function Clicku151(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/21/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u346 = document.getElementById('u346');

u346.style.cursor = 'pointer';
if (bIE) u346.attachEvent("onclick", Clicku346);
else u346.addEventListener("click", Clicku346, true);
function Clicku346(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/5/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u26 = document.getElementById('u26');
gv_vAlignTable['u26'] = 'center';
var u389 = document.getElementById('u389');
gv_vAlignTable['u389'] = 'top';
var u165 = document.getElementById('u165');

u165.style.cursor = 'pointer';
if (bIE) u165.attachEvent("onclick", Clicku165);
else u165.addEventListener("click", Clicku165, true);
function Clicku165(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/28/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u378 = document.getElementById('u378');

u378.style.cursor = 'pointer';
if (bIE) u378.attachEvent("onclick", Clicku378);
else u378.addEventListener("click", Clicku378, true);
function Clicku378(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/21/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u463 = document.getElementById('u463');
gv_vAlignTable['u463'] = 'center';
var u138 = document.getElementById('u138');
gv_vAlignTable['u138'] = 'top';
var u425 = document.getElementById('u425');
gv_vAlignTable['u425'] = 'top';
var u100 = document.getElementById('u100');

u100.style.cursor = 'pointer';
if (bIE) u100.attachEvent("onclick", Clicku100);
else u100.addEventListener("click", Clicku100, true);
function Clicku100(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u102','toggle','none',500);

}

}

var u54 = document.getElementById('u54');
gv_vAlignTable['u54'] = 'top';
var u236 = document.getElementById('u236');
gv_vAlignTable['u236'] = 'top';
var u214 = document.getElementById('u214');

var u192 = document.getElementById('u192');
gv_vAlignTable['u192'] = 'top';
var u67 = document.getElementById('u67');
gv_vAlignTable['u67'] = 'center';
var u269 = document.getElementById('u269');

u269.style.cursor = 'pointer';
if (bIE) u269.attachEvent("onclick", Clicku269);
else u269.addEventListener("click", Clicku269, true);
function Clicku269(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/28/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u331 = document.getElementById('u331');
gv_vAlignTable['u331'] = 'center';
var u321 = document.getElementById('u321');

var u150 = document.getElementById('u150');
gv_vAlignTable['u150'] = 'top';
var u287 = document.getElementById('u287');

u287.style.cursor = 'pointer';
if (bIE) u287.attachEvent("onclick", Clicku287);
else u287.addEventListener("click", Clicku287, true);
function Clicku287(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/7/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u436 = document.getElementById('u436');
gv_vAlignTable['u436'] = 'center';
var u48 = document.getElementById('u48');
gv_vAlignTable['u48'] = 'top';
var u327 = document.getElementById('u327');

u327.style.cursor = 'pointer';
if (bIE) u327.attachEvent("onclick", Clicku327);
else u327.addEventListener("click", Clicku327, true);
function Clicku327(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u329','toggle','none',500);

}

}

var u340 = document.getElementById('u340');

u340.style.cursor = 'pointer';
if (bIE) u340.attachEvent("onclick", Clicku340);
else u340.addEventListener("click", Clicku340, true);
function Clicku340(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/2/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u24 = document.getElementById('u24');

var u80 = document.getElementById('u80');

var u65 = document.getElementById('u65');

var u476 = document.getElementById('u476');
gv_vAlignTable['u476'] = 'center';
var u318 = document.getElementById('u318');
gv_vAlignTable['u318'] = 'top';
var u365 = document.getElementById('u365');
gv_vAlignTable['u365'] = 'top';
var u113 = document.getElementById('u113');

u113.style.cursor = 'pointer';
if (bIE) u113.attachEvent("onclick", Clicku113);
else u113.addEventListener("click", Clicku113, true);
function Clicku113(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/2/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u268 = document.getElementById('u268');
gv_vAlignTable['u268'] = 'top';
var u330 = document.getElementById('u330');

var u274 = document.getElementById('u274');
gv_vAlignTable['u274'] = 'top';
var u227 = document.getElementById('u227');

u227.style.cursor = 'pointer';
if (bIE) u227.attachEvent("onclick", Clicku227);
else u227.addEventListener("click", Clicku227, true);
function Clicku227(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/7/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u42 = document.getElementById('u42');
gv_vAlignTable['u42'] = 'top';
var u344 = document.getElementById('u344');

u344.style.cursor = 'pointer';
if (bIE) u344.attachEvent("onclick", Clicku344);
else u344.addEventListener("click", Clicku344, true);
function Clicku344(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/4/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u163 = document.getElementById('u163');

u163.style.cursor = 'pointer';
if (bIE) u163.attachEvent("onclick", Clicku163);
else u163.addEventListener("click", Clicku163, true);
function Clicku163(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/27/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u63 = document.getElementById('u63');

var u449 = document.getElementById('u449');

u449.style.cursor = 'pointer';
if (bIE) u449.attachEvent("onclick", Clicku449);
else u449.addEventListener("click", Clicku449, true);
function Clicku449(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u429','','none',500);

}

}

if (bIE) u449.attachEvent("onmouseover", MouseOveru449);
else u449.addEventListener("mouseover", MouseOveru449, true);
function MouseOveru449(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u449',e)) return;
if (true) {

SetWidgetSelected('u439');
}

}

if (bIE) u449.attachEvent("onmouseout", MouseOutu449);
else u449.addEventListener("mouseout", MouseOutu449, true);
function MouseOutu449(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u449',e)) return;
if (true) {

SetWidgetNotSelected('u439');
}

}

var u326 = document.getElementById('u326');
gv_vAlignTable['u326'] = 'top';
var u400 = document.getElementById('u400');

u400.style.cursor = 'pointer';
if (bIE) u400.attachEvent("onclick", Clicku400);
else u400.addEventListener("click", Clicku400, true);
function Clicku400(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/2/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u177 = document.getElementById('u177');

u177.style.cursor = 'pointer';
if (bIE) u177.attachEvent("onclick", Clicku177);
else u177.addEventListener("click", Clicku177, true);
function Clicku177(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/4/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u475 = document.getElementById('u475');

var u37 = document.getElementById('u37');
gv_vAlignTable['u37'] = 'top';
var u93 = document.getElementById('u93');

var u112 = document.getElementById('u112');
gv_vAlignTable['u112'] = 'top';
var u46 = document.getElementById('u46');
gv_vAlignTable['u46'] = 'top';
var u419 = document.getElementById('u419');
gv_vAlignTable['u419'] = 'top';
var u307 = document.getElementById('u307');

var u285 = document.getElementById('u285');

u285.style.cursor = 'pointer';
if (bIE) u285.attachEvent("onclick", Clicku285);
else u285.addEventListener("click", Clicku285, true);
function Clicku285(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/6/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u18 = document.getElementById('u18');

var u50 = document.getElementById('u50');
gv_vAlignTable['u50'] = 'center';
var u424 = document.getElementById('u424');
gv_vAlignTable['u424'] = 'top';
var u74 = document.getElementById('u74');

var u162 = document.getElementById('u162');
gv_vAlignTable['u162'] = 'top';
var u460 = document.getElementById('u460');

u460.style.cursor = 'pointer';
if (bIE) u460.attachEvent("onclick", Clicku460);
else u460.addEventListener("click", Clicku460, true);
function Clicku460(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u69','','none',500);

	SetPanelVisibility('u71','','none',500);

	SetPanelVisibility('u80','hidden','none',500);

	SetPanelVisibility('u307','hidden','none',500);

}

}

if (bIE) u460.attachEvent("onmouseover", MouseOveru460);
else u460.addEventListener("mouseover", MouseOveru460, true);
function MouseOveru460(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u460',e)) return;
if (true) {

SetWidgetSelected('u454');
}

}

if (bIE) u460.attachEvent("onmouseout", MouseOutu460);
else u460.addEventListener("mouseout", MouseOutu460, true);
function MouseOutu460(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u460',e)) return;
if (true) {

SetWidgetNotSelected('u454');
}

}

var u357 = document.getElementById('u357');
gv_vAlignTable['u357'] = 'top';
var u79 = document.getElementById('u79');
gv_vAlignTable['u79'] = 'center';
var u176 = document.getElementById('u176');
gv_vAlignTable['u176'] = 'top';
var u55 = document.getElementById('u55');

u55.style.cursor = 'pointer';
if (bIE) u55.attachEvent("onclick", Clicku55);
else u55.addEventListener("click", Clicku55, true);
function Clicku55(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u57','','none',500);

}

}
gv_vAlignTable['u55'] = 'top';
var u411 = document.getElementById('u411');
gv_vAlignTable['u411'] = 'top';
var u149 = document.getElementById('u149');

u149.style.cursor = 'pointer';
if (bIE) u149.attachEvent("onclick", Clicku149);
else u149.addEventListener("click", Clicku149, true);
function Clicku149(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/20/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u111 = document.getElementById('u111');

u111.style.cursor = 'pointer';
if (bIE) u111.attachEvent("onclick", Clicku111);
else u111.addEventListener("click", Clicku111, true);
function Clicku111(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/1/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u391 = document.getElementById('u391');
gv_vAlignTable['u391'] = 'top';
var u306 = document.getElementById('u306');

var u284 = document.getElementById('u284');
gv_vAlignTable['u284'] = 'top';
var u12 = document.getElementById('u12');
gv_vAlignTable['u12'] = 'center';
var u423 = document.getElementById('u423');
gv_vAlignTable['u423'] = 'top';
var u342 = document.getElementById('u342');

u342.style.cursor = 'pointer';
if (bIE) u342.attachEvent("onclick", Clicku342);
else u342.addEventListener("click", Clicku342, true);
function Clicku342(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/3/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u161 = document.getElementById('u161');

u161.style.cursor = 'pointer';
if (bIE) u161.attachEvent("onclick", Clicku161);
else u161.addEventListener("click", Clicku161, true);
function Clicku161(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/26/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u329 = document.getElementById('u329');

var u437 = document.getElementById('u437');

var u356 = document.getElementById('u356');

u356.style.cursor = 'pointer';
if (bIE) u356.attachEvent("onclick", Clicku356);
else u356.addEventListener("click", Clicku356, true);
function Clicku356(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/10/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u175 = document.getElementById('u175');

u175.style.cursor = 'pointer';
if (bIE) u175.attachEvent("onclick", Clicku175);
else u175.addEventListener("click", Clicku175, true);
function Clicku175(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/3/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u229 = document.getElementById('u229');

u229.style.cursor = 'pointer';
if (bIE) u229.attachEvent("onclick", Clicku229);
else u229.addEventListener("click", Clicku229, true);
function Clicku229(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/8/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u148 = document.getElementById('u148');
gv_vAlignTable['u148'] = 'top';
var u110 = document.getElementById('u110');

var u348 = document.getElementById('u348');

u348.style.cursor = 'pointer';
if (bIE) u348.attachEvent("onclick", Clicku348);
else u348.addEventListener("click", Clicku348, true);
function Clicku348(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/6/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u461 = document.getElementById('u461');

u461.style.cursor = 'pointer';
if (bIE) u461.attachEvent("onclick", Clicku461);
else u461.addEventListener("click", Clicku461, true);
function Clicku461(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u69','','none',500);

	SetPanelVisibility('u71','','none',500);

	SetPanelVisibility('u80','hidden','none',500);

	SetPanelVisibility('u307','hidden','none',500);

}

}

if (bIE) u461.attachEvent("onmouseover", MouseOveru461);
else u461.addEventListener("mouseover", MouseOveru461, true);
function MouseOveru461(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u461',e)) return;
if (true) {

SetWidgetSelected('u451');
}

}

if (bIE) u461.attachEvent("onmouseout", MouseOutu461);
else u461.addEventListener("mouseout", MouseOutu461, true);
function MouseOutu461(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u461',e)) return;
if (true) {

SetWidgetNotSelected('u451');
}

}

var u305 = document.getElementById('u305');
gv_vAlignTable['u305'] = 'top';
var u283 = document.getElementById('u283');

u283.style.cursor = 'pointer';
if (bIE) u283.attachEvent("onclick", Clicku283);
else u283.addEventListener("click", Clicku283, true);
function Clicku283(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/5/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u20 = document.getElementById('u20');

var u159 = document.getElementById('u159');

u159.style.cursor = 'pointer';
if (bIE) u159.attachEvent("onclick", Clicku159);
else u159.addEventListener("click", Clicku159, true);
function Clicku159(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/25/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u279 = document.getElementById('u279');

u279.style.cursor = 'pointer';
if (bIE) u279.attachEvent("onclick", Clicku279);
else u279.addEventListener("click", Clicku279, true);
function Clicku279(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/3/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u241 = document.getElementById('u241');

u241.style.cursor = 'pointer';
if (bIE) u241.attachEvent("onclick", Clicku241);
else u241.addEventListener("click", Clicku241, true);
function Clicku241(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/14/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u160 = document.getElementById('u160');
gv_vAlignTable['u160'] = 'top';
var u297 = document.getElementById('u297');

u297.style.cursor = 'pointer';
if (bIE) u297.attachEvent("onclick", Clicku297);
else u297.addEventListener("click", Clicku297, true);
function Clicku297(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/12/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u8 = document.getElementById('u8');
gv_vAlignTable['u8'] = 'top';
var u49 = document.getElementById('u49');

var u355 = document.getElementById('u355');
gv_vAlignTable['u355'] = 'top';
var u25 = document.getElementById('u25');

var u81 = document.getElementById('u81');

var u474 = document.getElementById('u474');

var u228 = document.getElementById('u228');
gv_vAlignTable['u228'] = 'top';
var u88 = document.getElementById('u88');
gv_vAlignTable['u88'] = 'top';
var u304 = document.getElementById('u304');
gv_vAlignTable['u304'] = 'top';
var u282 = document.getElementById('u282');
gv_vAlignTable['u282'] = 'top';
var u76 = document.getElementById('u76');

u76.style.cursor = 'pointer';
if (bIE) u76.attachEvent("onclick", Clicku76);
else u76.addEventListener("click", Clicku76, true);
function Clicku76(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u80','','none',500);

	SetPanelVisibility('u71','hidden','none',500);

	SetPanelVisibility('u307','hidden','none',500);

}

}

var u123 = document.getElementById('u123');

u123.style.cursor = 'pointer';
if (bIE) u123.attachEvent("onclick", Clicku123);
else u123.addEventListener("click", Clicku123, true);
function Clicku123(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/7/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u278 = document.getElementById('u278');
gv_vAlignTable['u278'] = 'top';
var u240 = document.getElementById('u240');
gv_vAlignTable['u240'] = 'top';
var u296 = document.getElementById('u296');
gv_vAlignTable['u296'] = 'top';
var u137 = document.getElementById('u137');

u137.style.cursor = 'pointer';
if (bIE) u137.attachEvent("onclick", Clicku137);
else u137.addEventListener("click", Clicku137, true);
function Clicku137(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/14/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u426 = document.getElementById('u426');
gv_vAlignTable['u426'] = 'top';
var u33 = document.getElementById('u33');
gv_vAlignTable['u33'] = 'center';
var u254 = document.getElementById('u254');
gv_vAlignTable['u254'] = 'top';
var u173 = document.getElementById('u173');

u173.style.cursor = 'pointer';
if (bIE) u173.attachEvent("onclick", Clicku173);
else u173.addEventListener("click", Clicku173, true);
function Clicku173(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/2/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u422 = document.getElementById('u422');
gv_vAlignTable['u422'] = 'top';
var u343 = document.getElementById('u343');
gv_vAlignTable['u343'] = 'top';
var u438 = document.getElementById('u438');
gv_vAlignTable['u438'] = 'center';
var u213 = document.getElementById('u213');
gv_vAlignTable['u213'] = 'top';
var u303 = document.getElementById('u303');
gv_vAlignTable['u303'] = 'top';
var u281 = document.getElementById('u281');

u281.style.cursor = 'pointer';
if (bIE) u281.attachEvent("onclick", Clicku281);
else u281.addEventListener("click", Clicku281, true);
function Clicku281(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/4/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u94 = document.getElementById('u94');

var u122 = document.getElementById('u122');
gv_vAlignTable['u122'] = 'top';
var u358 = document.getElementById('u358');

u358.style.cursor = 'pointer';
if (bIE) u358.attachEvent("onclick", Clicku358);
else u358.addEventListener("click", Clicku358, true);
function Clicku358(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/11/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u420 = document.getElementById('u420');

u420.style.cursor = 'pointer';
if (bIE) u420.attachEvent("onclick", Clicku420);
else u420.addEventListener("click", Clicku420, true);
function Clicku420(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/12/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u5 = document.getElementById('u5');
gv_vAlignTable['u5'] = 'center';
var u317 = document.getElementById('u317');
gv_vAlignTable['u317'] = 'center';
var u295 = document.getElementById('u295');

u295.style.cursor = 'pointer';
if (bIE) u295.attachEvent("onclick", Clicku295);
else u295.addEventListener("click", Clicku295, true);
function Clicku295(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/11/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u19 = document.getElementById('u19');
gv_vAlignTable['u19'] = 'center';
var u51 = document.getElementById('u51');

var u434 = document.getElementById('u434');
gv_vAlignTable['u434'] = 'center';
var u109 = document.getElementById('u109');
gv_vAlignTable['u109'] = 'top';
var u253 = document.getElementById('u253');

u253.style.cursor = 'pointer';
if (bIE) u253.attachEvent("onclick", Clicku253);
else u253.addEventListener("click", Clicku253, true);
function Clicku253(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/20/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u172 = document.getElementById('u172');
gv_vAlignTable['u172'] = 'top';
var u470 = document.getElementById('u470');

var u410 = document.getElementById('u410');

u410.style.cursor = 'pointer';
if (bIE) u410.attachEvent("onclick", Clicku410);
else u410.addEventListener("click", Clicku410, true);
function Clicku410(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/7/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u359 = document.getElementById('u359');
gv_vAlignTable['u359'] = 'top';
var u472 = document.getElementById('u472');

var u267 = document.getElementById('u267');

u267.style.cursor = 'pointer';
if (bIE) u267.attachEvent("onclick", Clicku267);
else u267.addEventListener("click", Clicku267, true);
function Clicku267(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/27/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u399 = document.getElementById('u399');
gv_vAlignTable['u399'] = 'top';
var u302 = document.getElementById('u302');
gv_vAlignTable['u302'] = 'top';
var u280 = document.getElementById('u280');
gv_vAlignTable['u280'] = 'top';
var u121 = document.getElementById('u121');

u121.style.cursor = 'pointer';
if (bIE) u121.attachEvent("onclick", Clicku121);
else u121.addEventListener("click", Clicku121, true);
function Clicku121(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/6/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u414 = document.getElementById('u414');

u414.style.cursor = 'pointer';
if (bIE) u414.attachEvent("onclick", Clicku414);
else u414.addEventListener("click", Clicku414, true);
function Clicku414(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/9/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u409 = document.getElementById('u409');
gv_vAlignTable['u409'] = 'top';
var u316 = document.getElementById('u316');

var u294 = document.getElementById('u294');
gv_vAlignTable['u294'] = 'top';
var u135 = document.getElementById('u135');

u135.style.cursor = 'pointer';
if (bIE) u135.attachEvent("onclick", Clicku135);
else u135.addEventListener("click", Clicku135, true);
function Clicku135(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/13/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u433 = document.getElementById('u433');

var u108 = document.getElementById('u108');
gv_vAlignTable['u108'] = 'center';
var u252 = document.getElementById('u252');
gv_vAlignTable['u252'] = 'top';
var u171 = document.getElementById('u171');

u171.style.cursor = 'pointer';
if (bIE) u171.attachEvent("onclick", Clicku171);
else u171.addEventListener("click", Clicku171, true);
function Clicku171(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/1/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u447 = document.getElementById('u447');
gv_vAlignTable['u447'] = 'center';
var u386 = document.getElementById('u386');

u386.style.cursor = 'pointer';
if (bIE) u386.attachEvent("onclick", Clicku386);
else u386.addEventListener("click", Clicku386, true);
function Clicku386(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/25/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u266 = document.getElementById('u266');
gv_vAlignTable['u266'] = 'top';
var u64 = document.getElementById('u64');
gv_vAlignTable['u64'] = 'center';
var u239 = document.getElementById('u239');

u239.style.cursor = 'pointer';
if (bIE) u239.attachEvent("onclick", Clicku239);
else u239.addEventListener("click", Clicku239, true);
function Clicku239(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/13/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u301 = document.getElementById('u301');
gv_vAlignTable['u301'] = 'top';
var u120 = document.getElementById('u120');
gv_vAlignTable['u120'] = 'top';
var u2 = document.getElementById('u2');

u2.style.cursor = 'pointer';
if (bIE) u2.attachEvent("onclick", Clicku2);
else u2.addEventListener("click", Clicku2, true);
function Clicku2(e)
{
windowEvent = e;


if (true) {

	self.location.href="Deliver.html" + GetQuerystring();

}

}

var u315 = document.getElementById('u315');
gv_vAlignTable['u315'] = 'top';
var u293 = document.getElementById('u293');

u293.style.cursor = 'pointer';
if (bIE) u293.attachEvent("onclick", Clicku293);
else u293.addEventListener("click", Clicku293, true);
function Clicku293(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/10/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u21 = document.getElementById('u21');
gv_vAlignTable['u21'] = 'center';
var u134 = document.getElementById('u134');
gv_vAlignTable['u134'] = 'top';
var u432 = document.getElementById('u432');
gv_vAlignTable['u432'] = 'center';
var u251 = document.getElementById('u251');

u251.style.cursor = 'pointer';
if (bIE) u251.attachEvent("onclick", Clicku251);
else u251.addEventListener("click", Clicku251, true);
function Clicku251(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/19/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u170 = document.getElementById('u170');
gv_vAlignTable['u170'] = 'top';
var u446 = document.getElementById('u446');

var u373 = document.getElementById('u373');
gv_vAlignTable['u373'] = 'top';
var u265 = document.getElementById('u265');

u265.style.cursor = 'pointer';
if (bIE) u265.attachEvent("onclick", Clicku265);
else u265.addEventListener("click", Clicku265, true);
function Clicku265(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/26/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u82 = document.getElementById('u82');
gv_vAlignTable['u82'] = 'center';
var u16 = document.getElementById('u16');

var u238 = document.getElementById('u238');
gv_vAlignTable['u238'] = 'top';
var u200 = document.getElementById('u200');
gv_vAlignTable['u200'] = 'top';
var u314 = document.getElementById('u314');
gv_vAlignTable['u314'] = 'top';
var u292 = document.getElementById('u292');
gv_vAlignTable['u292'] = 'top';
var u77 = document.getElementById('u77');
gv_vAlignTable['u77'] = 'center';
var u133 = document.getElementById('u133');

u133.style.cursor = 'pointer';
if (bIE) u133.attachEvent("onclick", Clicku133);
else u133.addEventListener("click", Clicku133, true);
function Clicku133(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/12/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u369 = document.getElementById('u369');
gv_vAlignTable['u369'] = 'top';
var u431 = document.getElementById('u431');

var u250 = document.getElementById('u250');
gv_vAlignTable['u250'] = 'top';
var u387 = document.getElementById('u387');
gv_vAlignTable['u387'] = 'top';
var u147 = document.getElementById('u147');

u147.style.cursor = 'pointer';
if (bIE) u147.attachEvent("onclick", Clicku147);
else u147.addEventListener("click", Clicku147, true);
function Clicku147(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/19/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u58 = document.getElementById('u58');

var u445 = document.getElementById('u445');

var u34 = document.getElementById('u34');

var u90 = document.getElementById('u90');
gv_vAlignTable['u90'] = 'center';
var u61 = document.getElementById('u61');

var u164 = document.getElementById('u164');
gv_vAlignTable['u164'] = 'top';
var u95 = document.getElementById('u95');

var u191 = document.getElementById('u191');

u191.style.cursor = 'pointer';
if (bIE) u191.attachEvent("onclick", Clicku191);
else u191.addEventListener("click", Clicku191, true);
function Clicku191(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/11/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u368 = document.getElementById('u368');

u368.style.cursor = 'pointer';
if (bIE) u368.attachEvent("onclick", Clicku368);
else u368.addEventListener("click", Clicku368, true);
function Clicku368(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/16/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u430 = document.getElementById('u430');

if (bIE) u430.attachEvent("onmouseover", MouseOveru430);
else u430.addEventListener("mouseover", MouseOveru430, true);
function MouseOveru430(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u430',e)) return;
if (true) {

	SetPanelVisibility('u429','hidden','none',500);

}

}

var u255 = document.getElementById('u255');

u255.style.cursor = 'pointer';
if (bIE) u255.attachEvent("onclick", Clicku255);
else u255.addEventListener("click", Clicku255, true);
function Clicku255(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/21/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u146 = document.getElementById('u146');
gv_vAlignTable['u146'] = 'top';
var u52 = document.getElementById('u52');

var u444 = document.getElementById('u444');

var u125 = document.getElementById('u125');

u125.style.cursor = 'pointer';
if (bIE) u125.attachEvent("onclick", Clicku125);
else u125.addEventListener("click", Clicku125, true);
function Clicku125(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/8/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u263 = document.getElementById('u263');

u263.style.cursor = 'pointer';
if (bIE) u263.attachEvent("onclick", Clicku263);
else u263.addEventListener("click", Clicku263, true);
function Clicku263(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/25/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u459 = document.getElementById('u459');
gv_vAlignTable['u459'] = 'center';
var u277 = document.getElementById('u277');

u277.style.cursor = 'pointer';
if (bIE) u277.attachEvent("onclick", Clicku277);
else u277.addEventListener("click", Clicku277, true);
function Clicku277(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/2/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u388 = document.getElementById('u388');

u388.style.cursor = 'pointer';
if (bIE) u388.attachEvent("onclick", Clicku388);
else u388.addEventListener("click", Clicku388, true);
function Clicku388(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/26/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u47 = document.getElementById('u47');

var u212 = document.getElementById('u212');
gv_vAlignTable['u212'] = 'center';
var u190 = document.getElementById('u190');
gv_vAlignTable['u190'] = 'top';
var u407 = document.getElementById('u407');
gv_vAlignTable['u407'] = 'top';
var u385 = document.getElementById('u385');
gv_vAlignTable['u385'] = 'top';
var u28 = document.getElementById('u28');
gv_vAlignTable['u28'] = 'center';
var u145 = document.getElementById('u145');

u145.style.cursor = 'pointer';
if (bIE) u145.attachEvent("onclick", Clicku145);
else u145.addEventListener("click", Clicku145, true);
function Clicku145(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/18/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u443 = document.getElementById('u443');
gv_vAlignTable['u443'] = 'center';
var u118 = document.getElementById('u118');
gv_vAlignTable['u118'] = 'top';
var u262 = document.getElementById('u262');
gv_vAlignTable['u262'] = 'top';
var u322 = document.getElementById('u322');

var u457 = document.getElementById('u457');

var u131 = document.getElementById('u131');

u131.style.cursor = 'pointer';
if (bIE) u131.attachEvent("onclick", Clicku131);
else u131.addEventListener("click", Clicku131, true);
function Clicku131(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/11/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u276 = document.getElementById('u276');
gv_vAlignTable['u276'] = 'top';
var u89 = document.getElementById('u89');

var u249 = document.getElementById('u249');

u249.style.cursor = 'pointer';
if (bIE) u249.attachEvent("onclick", Clicku249);
else u249.addEventListener("click", Clicku249, true);
function Clicku249(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/18/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u211 = document.getElementById('u211');

var u130 = document.getElementById('u130');
gv_vAlignTable['u130'] = 'top';
var u345 = document.getElementById('u345');
gv_vAlignTable['u345'] = 'top';
var u85 = document.getElementById('u85');

var u403 = document.getElementById('u403');
gv_vAlignTable['u403'] = 'top';
var u406 = document.getElementById('u406');

u406.style.cursor = 'pointer';
if (bIE) u406.attachEvent("onclick", Clicku406);
else u406.addEventListener("click", Clicku406, true);
function Clicku406(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/5/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u384 = document.getElementById('u384');

u384.style.cursor = 'pointer';
if (bIE) u384.attachEvent("onclick", Clicku384);
else u384.addEventListener("click", Clicku384, true);
function Clicku384(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/24/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u22 = document.getElementById('u22');
gv_vAlignTable['u22'] = 'top';
var u144 = document.getElementById('u144');
gv_vAlignTable['u144'] = 'top';
var u442 = document.getElementById('u442');

var u261 = document.getElementById('u261');

u261.style.cursor = 'pointer';
if (bIE) u261.attachEvent("onclick", Clicku261);
else u261.addEventListener("click", Clicku261, true);
function Clicku261(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/24/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u43 = document.getElementById('u43');

var u456 = document.getElementById('u456');

var u275 = document.getElementById('u275');

u275.style.cursor = 'pointer';
if (bIE) u275.attachEvent("onclick", Clicku275);
else u275.addEventListener("click", Clicku275, true);
function Clicku275(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/1/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u17 = document.getElementById('u17');
gv_vAlignTable['u17'] = 'center';
var u248 = document.getElementById('u248');
gv_vAlignTable['u248'] = 'top';
var u210 = document.getElementById('u210');
gv_vAlignTable['u210'] = 'center';
var u325 = document.getElementById('u325');

var u107 = document.getElementById('u107');

var u44 = document.getElementById('u44');
gv_vAlignTable['u44'] = 'top';
var u405 = document.getElementById('u405');
gv_vAlignTable['u405'] = 'top';
var u383 = document.getElementById('u383');
gv_vAlignTable['u383'] = 'top';
var u30 = document.getElementById('u30');

var u224 = document.getElementById('u224');
gv_vAlignTable['u224'] = 'top';
var u143 = document.getElementById('u143');

u143.style.cursor = 'pointer';
if (bIE) u143.attachEvent("onclick", Clicku143);
else u143.addEventListener("click", Clicku143, true);
function Clicku143(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/17/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u379 = document.getElementById('u379');
gv_vAlignTable['u379'] = 'top';
var u341 = document.getElementById('u341');
gv_vAlignTable['u341'] = 'top';
var u260 = document.getElementById('u260');
gv_vAlignTable['u260'] = 'top';
var u397 = document.getElementById('u397');
gv_vAlignTable['u397'] = 'top';
var u9 = document.getElementById('u9');

var u157 = document.getElementById('u157');

u157.style.cursor = 'pointer';
if (bIE) u157.attachEvent("onclick", Clicku157);
else u157.addEventListener("click", Clicku157, true);
function Clicku157(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/24/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u59 = document.getElementById('u59');
gv_vAlignTable['u59'] = 'center';
var u455 = document.getElementById('u455');
gv_vAlignTable['u455'] = 'center';
var u189 = document.getElementById('u189');

u189.style.cursor = 'pointer';
if (bIE) u189.attachEvent("onclick", Clicku189);
else u189.addEventListener("click", Clicku189, true);
function Clicku189(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/10/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u35 = document.getElementById('u35');
gv_vAlignTable['u35'] = 'center';
var u91 = document.getElementById('u91');
gv_vAlignTable['u91'] = 'top';
var u309 = document.getElementById('u309');
gv_vAlignTable['u309'] = 'center';
var u328 = document.getElementById('u328');
gv_vAlignTable['u328'] = 'center';
var u435 = document.getElementById('u435');

var u106 = document.getElementById('u106');
gv_vAlignTable['u106'] = 'center';
var u404 = document.getElementById('u404');

u404.style.cursor = 'pointer';
if (bIE) u404.attachEvent("onclick", Clicku404);
else u404.addEventListener("click", Clicku404, true);
function Clicku404(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/4/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u382 = document.getElementById('u382');

u382.style.cursor = 'pointer';
if (bIE) u382.attachEvent("onclick", Clicku382);
else u382.addEventListener("click", Clicku382, true);
function Clicku382(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/23/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u223 = document.getElementById('u223');

u223.style.cursor = 'pointer';
if (bIE) u223.attachEvent("onclick", Clicku223);
else u223.addEventListener("click", Clicku223, true);
function Clicku223(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/5/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u142 = document.getElementById('u142');
gv_vAlignTable['u142'] = 'top';
var u86 = document.getElementById('u86');
gv_vAlignTable['u86'] = 'center';
var u70 = document.getElementById('u70');

if (bIE) u70.attachEvent("onmouseover", MouseOveru70);
else u70.addEventListener("mouseover", MouseOveru70, true);
function MouseOveru70(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u70',e)) return;
if (true) {

	SetPanelVisibility('u71','hidden','none',500);

}

}

var u396 = document.getElementById('u396');

u396.style.cursor = 'pointer';
if (bIE) u396.attachEvent("onclick", Clicku396);
else u396.addEventListener("click", Clicku396, true);
function Clicku396(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/30/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u237 = document.getElementById('u237');

u237.style.cursor = 'pointer';
if (bIE) u237.attachEvent("onclick", Clicku237);
else u237.addEventListener("click", Clicku237, true);
function Clicku237(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/12/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u156 = document.getElementById('u156');
gv_vAlignTable['u156'] = 'top';
var u188 = document.getElementById('u188');
gv_vAlignTable['u188'] = 'top';
var u354 = document.getElementById('u354');

u354.style.cursor = 'pointer';
if (bIE) u354.attachEvent("onclick", Clicku354);
else u354.addEventListener("click", Clicku354, true);
function Clicku354(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/9/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u273 = document.getElementById('u273');

u273.style.cursor = 'pointer';
if (bIE) u273.attachEvent("onclick", Clicku273);
else u273.addEventListener("click", Clicku273, true);
function Clicku273(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/30/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u53 = document.getElementById('u53');
gv_vAlignTable['u53'] = 'center';
var u226 = document.getElementById('u226');
gv_vAlignTable['u226'] = 'top';
var u375 = document.getElementById('u375');
gv_vAlignTable['u375'] = 'top';
var u381 = document.getElementById('u381');
gv_vAlignTable['u381'] = 'top';
var u222 = document.getElementById('u222');
gv_vAlignTable['u222'] = 'top';
var u458 = document.getElementById('u458');

var u311 = document.getElementById('u311');
gv_vAlignTable['u311'] = 'center';
var u6 = document.getElementById('u6');

var u36 = document.getElementById('u36');
gv_vAlignTable['u36'] = 'top';
var u395 = document.getElementById('u395');
gv_vAlignTable['u395'] = 'top';
var u29 = document.getElementById('u29');

var u155 = document.getElementById('u155');

u155.style.cursor = 'pointer';
if (bIE) u155.attachEvent("onclick", Clicku155);
else u155.addEventListener("click", Clicku155, true);
function Clicku155(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/23/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u209 = document.getElementById('u209');

var u353 = document.getElementById('u353');
gv_vAlignTable['u353'] = 'top';
var u272 = document.getElementById('u272');
gv_vAlignTable['u272'] = 'top';
var u402 = document.getElementById('u402');

u402.style.cursor = 'pointer';
if (bIE) u402.attachEvent("onclick", Clicku402);
else u402.addEventListener("click", Clicku402, true);
function Clicku402(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/3/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u336 = document.getElementById('u336');
gv_vAlignTable['u336'] = 'top';
var u367 = document.getElementById('u367');
gv_vAlignTable['u367'] = 'top';
var u104 = document.getElementById('u104');
gv_vAlignTable['u104'] = 'center';
var u308 = document.getElementById('u308');

var u259 = document.getElementById('u259');

u259.style.cursor = 'pointer';
if (bIE) u259.attachEvent("onclick", Clicku259);
else u259.addEventListener("click", Clicku259, true);
function Clicku259(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/23/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u380 = document.getElementById('u380');

u380.style.cursor = 'pointer';
if (bIE) u380.attachEvent("onclick", Clicku380);
else u380.addEventListener("click", Clicku380, true);
function Clicku380(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/22/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u221 = document.getElementById('u221');

u221.style.cursor = 'pointer';
if (bIE) u221.attachEvent("onclick", Clicku221);
else u221.addEventListener("click", Clicku221, true);
function Clicku221(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/4/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u119 = document.getElementById('u119');

u119.style.cursor = 'pointer';
if (bIE) u119.attachEvent("onclick", Clicku119);
else u119.addEventListener("click", Clicku119, true);
function Clicku119(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/5/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u416 = document.getElementById('u416');

u416.style.cursor = 'pointer';
if (bIE) u416.attachEvent("onclick", Clicku416);
else u416.addEventListener("click", Clicku416, true);
function Clicku416(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/10/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u394 = document.getElementById('u394');

u394.style.cursor = 'pointer';
if (bIE) u394.attachEvent("onclick", Clicku394);
else u394.addEventListener("click", Clicku394, true);
function Clicku394(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/29/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u235 = document.getElementById('u235');

u235.style.cursor = 'pointer';
if (bIE) u235.attachEvent("onclick", Clicku235);
else u235.addEventListener("click", Clicku235, true);
function Clicku235(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/11/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u75 = document.getElementById('u75');
gv_vAlignTable['u75'] = 'center';
var u13 = document.getElementById('u13');

var u208 = document.getElementById('u208');
gv_vAlignTable['u208'] = 'center';
var u352 = document.getElementById('u352');

u352.style.cursor = 'pointer';
if (bIE) u352.attachEvent("onclick", Clicku352);
else u352.addEventListener("click", Clicku352, true);
function Clicku352(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/8/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u271 = document.getElementById('u271');

u271.style.cursor = 'pointer';
if (bIE) u271.attachEvent("onclick", Clicku271);
else u271.addEventListener("click", Clicku271, true);
function Clicku271(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/29/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u312 = document.getElementById('u312');

var u418 = document.getElementById('u418');

u418.style.cursor = 'pointer';
if (bIE) u418.attachEvent("onclick", Clicku418);
else u418.addEventListener("click", Clicku418, true);
function Clicku418(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/11/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u366 = document.getElementById('u366');

u366.style.cursor = 'pointer';
if (bIE) u366.attachEvent("onclick", Clicku366);
else u366.addEventListener("click", Clicku366, true);
function Clicku366(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/15/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u98 = document.getElementById('u98');

var u103 = document.getElementById('u103');

var u339 = document.getElementById('u339');
gv_vAlignTable['u339'] = 'top';
var u401 = document.getElementById('u401');
gv_vAlignTable['u401'] = 'top';
var u158 = document.getElementById('u158');
gv_vAlignTable['u158'] = 'top';
var u220 = document.getElementById('u220');
gv_vAlignTable['u220'] = 'top';
var u3 = document.getElementById('u3');
gv_vAlignTable['u3'] = 'center';
var u117 = document.getElementById('u117');

u117.style.cursor = 'pointer';
if (bIE) u117.attachEvent("onclick", Clicku117);
else u117.addEventListener("click", Clicku117, true);
function Clicku117(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/4/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u415 = document.getElementById('u415');
gv_vAlignTable['u415'] = 'top';
var u361 = document.getElementById('u361');
gv_vAlignTable['u361'] = 'top';
var u31 = document.getElementById('u31');
gv_vAlignTable['u31'] = 'center';
var u234 = document.getElementById('u234');
gv_vAlignTable['u234'] = 'top';
var u73 = document.getElementById('u73');
gv_vAlignTable['u73'] = 'center';
var u351 = document.getElementById('u351');
gv_vAlignTable['u351'] = 'top';
var u270 = document.getElementById('u270');
gv_vAlignTable['u270'] = 'top';
var u199 = document.getElementById('u199');
gv_vAlignTable['u199'] = 'top';
var u319 = document.getElementById('u319');

var u92 = document.getElementById('u92');

var u102 = document.getElementById('u102');

var u56 = document.getElementById('u56');

var u300 = document.getElementById('u300');
gv_vAlignTable['u300'] = 'top';
var u471 = document.getElementById('u471');
gv_vAlignTable['u471'] = 'top';
var u417 = document.getElementById('u417');
gv_vAlignTable['u417'] = 'top';
var u116 = document.getElementById('u116');
gv_vAlignTable['u116'] = 'top';
var u186 = document.getElementById('u186');
gv_vAlignTable['u186'] = 'top';
var u392 = document.getElementById('u392');

u392.style.cursor = 'pointer';
if (bIE) u392.attachEvent("onclick", Clicku392);
else u392.addEventListener("click", Clicku392, true);
function Clicku392(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/28/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u233 = document.getElementById('u233');

u233.style.cursor = 'pointer';
if (bIE) u233.attachEvent("onclick", Clicku233);
else u233.addEventListener("click", Clicku233, true);
function Clicku233(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/10/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u469 = document.getElementById('u469');
gv_vAlignTable['u469'] = 'top';
var u87 = document.getElementById('u87');
gv_vAlignTable['u87'] = 'top';
var u350 = document.getElementById('u350');

u350.style.cursor = 'pointer';
if (bIE) u350.attachEvent("onclick", Clicku350);
else u350.addEventListener("click", Clicku350, true);
function Clicku350(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/7/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u347 = document.getElementById('u347');
gv_vAlignTable['u347'] = 'top';
var u247 = document.getElementById('u247');

u247.style.cursor = 'pointer';
if (bIE) u247.attachEvent("onclick", Clicku247);
else u247.addEventListener("click", Clicku247, true);
function Clicku247(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/17/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u68 = document.getElementById('u68');
gv_vAlignTable['u68'] = 'top';
var u198 = document.getElementById('u198');
gv_vAlignTable['u198'] = 'top';
var u364 = document.getElementById('u364');

u364.style.cursor = 'pointer';
if (bIE) u364.attachEvent("onclick", Clicku364);
else u364.addEventListener("click", Clicku364, true);
function Clicku364(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/14/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u101 = document.getElementById('u101');
gv_vAlignTable['u101'] = 'center';
var u452 = document.getElementById('u452');
gv_vAlignTable['u452'] = 'center';
var u0 = document.getElementById('u0');

u0.style.cursor = 'pointer';
if (bIE) u0.attachEvent("onclick", Clicku0);
else u0.addEventListener("click", Clicku0, true);
function Clicku0(e)
{
windowEvent = e;


if (true) {

	self.location.href="Project.html" + GetQuerystring();

}

}

var u338 = document.getElementById('u338');

u338.style.cursor = 'pointer';
if (bIE) u338.attachEvent("onclick", Clicku338);
else u338.addEventListener("click", Clicku338, true);
function Clicku338(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/1/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u115 = document.getElementById('u115');

u115.style.cursor = 'pointer';
if (bIE) u115.attachEvent("onclick", Clicku115);
else u115.addEventListener("click", Clicku115, true);
function Clicku115(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/3/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u313 = document.getElementById('u313');
gv_vAlignTable['u313'] = 'center';
var u232 = document.getElementById('u232');
gv_vAlignTable['u232'] = 'top';
var u468 = document.getElementById('u468');

var u427 = document.getElementById('u427');
gv_vAlignTable['u427'] = 'top';
var u7 = document.getElementById('u7');
gv_vAlignTable['u7'] = 'center';
var u246 = document.getElementById('u246');
gv_vAlignTable['u246'] = 'top';
var u62 = document.getElementById('u62');
gv_vAlignTable['u62'] = 'center';
var u219 = document.getElementById('u219');

u219.style.cursor = 'pointer';
if (bIE) u219.attachEvent("onclick", Clicku219);
else u219.addEventListener("click", Clicku219, true);
function Clicku219(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/3/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u412 = document.getElementById('u412');

u412.style.cursor = 'pointer';
if (bIE) u412.attachEvent("onclick", Clicku412);
else u412.addEventListener("click", Clicku412, true);
function Clicku412(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/8/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u448 = document.getElementById('u448');

u448.style.cursor = 'pointer';
if (bIE) u448.attachEvent("onclick", Clicku448);
else u448.addEventListener("click", Clicku448, true);
function Clicku448(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u429','','none',500);

}

}

if (bIE) u448.attachEvent("onmouseover", MouseOveru448);
else u448.addEventListener("mouseover", MouseOveru448, true);
function MouseOveru448(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u448',e)) return;
if (true) {

SetWidgetSelected('u442');
}

}

if (bIE) u448.attachEvent("onmouseout", MouseOutu448);
else u448.addEventListener("mouseout", MouseOutu448, true);
function MouseOutu448(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u448',e)) return;
if (true) {

SetWidgetNotSelected('u442');
}

}

var u132 = document.getElementById('u132');
gv_vAlignTable['u132'] = 'top';
var u377 = document.getElementById('u377');
gv_vAlignTable['u377'] = 'top';
var u372 = document.getElementById('u372');

u372.style.cursor = 'pointer';
if (bIE) u372.attachEvent("onclick", Clicku372);
else u372.addEventListener("click", Clicku372, true);
function Clicku372(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/18/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u114 = document.getElementById('u114');
gv_vAlignTable['u114'] = 'top';
var u57 = document.getElementById('u57');

var u169 = document.getElementById('u169');

u169.style.cursor = 'pointer';
if (bIE) u169.attachEvent("onclick", Clicku169);
else u169.addEventListener("click", Clicku169, true);
function Clicku169(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/30/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u290 = document.getElementById('u290');
gv_vAlignTable['u290'] = 'top';
var u408 = document.getElementById('u408');

u408.style.cursor = 'pointer';
if (bIE) u408.attachEvent("onclick", Clicku408);
else u408.addEventListener("click", Clicku408, true);
function Clicku408(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/6/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u187 = document.getElementById('u187');

u187.style.cursor = 'pointer';
if (bIE) u187.attachEvent("onclick", Clicku187);
else u187.addEventListener("click", Clicku187, true);
function Clicku187(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/9/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u485 = document.getElementById('u485');

var u38 = document.getElementById('u38');
gv_vAlignTable['u38'] = 'top';
var u245 = document.getElementById('u245');

u245.style.cursor = 'pointer';
if (bIE) u245.attachEvent("onclick", Clicku245);
else u245.addEventListener("click", Clicku245, true);
function Clicku245(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/16/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'center';
var u218 = document.getElementById('u218');
gv_vAlignTable['u218'] = 'top';
var u362 = document.getElementById('u362');

u362.style.cursor = 'pointer';
if (bIE) u362.attachEvent("onclick", Clicku362);
else u362.addEventListener("click", Clicku362, true);
function Clicku362(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/13/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u376 = document.getElementById('u376');

u376.style.cursor = 'pointer';
if (bIE) u376.attachEvent("onclick", Clicku376);
else u376.addEventListener("click", Clicku376, true);
function Clicku376(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/20/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u99 = document.getElementById('u99');
gv_vAlignTable['u99'] = 'top';
var u286 = document.getElementById('u286');
gv_vAlignTable['u286'] = 'top';
var u349 = document.getElementById('u349');
gv_vAlignTable['u349'] = 'top';
var u168 = document.getElementById('u168');
gv_vAlignTable['u168'] = 'top';
var u230 = document.getElementById('u230');
gv_vAlignTable['u230'] = 'top';
var u127 = document.getElementById('u127');

u127.style.cursor = 'pointer';
if (bIE) u127.attachEvent("onclick", Clicku127);
else u127.addEventListener("click", Clicku127, true);
function Clicku127(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/9/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u484 = document.getElementById('u484');

var u32 = document.getElementById('u32');

var u244 = document.getElementById('u244');
gv_vAlignTable['u244'] = 'top';
var u390 = document.getElementById('u390');

u390.style.cursor = 'pointer';
if (bIE) u390.attachEvent("onclick", Clicku390);
else u390.addEventListener("click", Clicku390, true);
function Clicku390(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/27/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u105 = document.getElementById('u105');

var u462 = document.getElementById('u462');

u462.style.cursor = 'pointer';
if (bIE) u462.attachEvent("onclick", Clicku462);
else u462.addEventListener("click", Clicku462, true);
function Clicku462(e)
{
windowEvent = e;


if (true) {

	self.location.href="resources/reload.html#" + encodeURI(PageUrl + GetQuerystring());

}

}

var u124 = document.getElementById('u124');
gv_vAlignTable['u124'] = 'top';
var u27 = document.getElementById('u27');

var u83 = document.getElementById('u83');

var u310 = document.getElementById('u310');

var u478 = document.getElementById('u478');
gv_vAlignTable['u478'] = 'center';
var u207 = document.getElementById('u207');

var u185 = document.getElementById('u185');

u185.style.cursor = 'pointer';
if (bIE) u185.attachEvent("onclick", Clicku185);
else u185.addEventListener("click", Clicku185, true);
function Clicku185(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/8/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u483 = document.getElementById('u483');

var u40 = document.getElementById('u40');
gv_vAlignTable['u40'] = 'top';
var u324 = document.getElementById('u324');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u324ann'), "<div id='u324Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u324Note').click(function(e) { ToggleWorkflow(e, 'u324', 300, 150, false); return false; });
var u324Ann = 
{
"label":"link",
"Description":"Open attachment dialog"};
gv_vAlignTable['u324'] = 'top';
var u243 = document.getElementById('u243');

u243.style.cursor = 'pointer';
if (bIE) u243.attachEvent("onclick", Clicku243);
else u243.addEventListener("click", Clicku243, true);
function Clicku243(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/15/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u479 = document.getElementById('u479');

var u441 = document.getElementById('u441');
gv_vAlignTable['u441'] = 'top';
var u360 = document.getElementById('u360');

u360.style.cursor = 'pointer';
if (bIE) u360.attachEvent("onclick", Clicku360);
else u360.addEventListener("click", Clicku360, true);
function Clicku360(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/12/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u257 = document.getElementById('u257');

u257.style.cursor = 'pointer';
if (bIE) u257.attachEvent("onclick", Clicku257);
else u257.addEventListener("click", Clicku257, true);
function Clicku257(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/22/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u69 = document.getElementById('u69');

var u289 = document.getElementById('u289');

u289.style.cursor = 'pointer';
if (bIE) u289.attachEvent("onclick", Clicku289);
else u289.addEventListener("click", Clicku289, true);
function Clicku289(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/8/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u45 = document.getElementById('u45');

var u374 = document.getElementById('u374');

u374.style.cursor = 'pointer';
if (bIE) u374.attachEvent("onclick", Clicku374);
else u374.addEventListener("click", Clicku374, true);
function Clicku374(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '11/19/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u428 = document.getElementById('u428');
gv_vAlignTable['u428'] = 'top';
var u206 = document.getElementById('u206');

var u184 = document.getElementById('u184');
gv_vAlignTable['u184'] = 'top';
var u482 = document.getElementById('u482');
gv_vAlignTable['u482'] = 'top';
var u323 = document.getElementById('u323');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u323ann'), "<div id='u323Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u323Note').click(function(e) { ToggleWorkflow(e, 'u323', 300, 150, false); return false; });
var u323Ann = 
{
"label":"textarea",
"Description":"Auto expand height when typing"};

var u242 = document.getElementById('u242');
gv_vAlignTable['u242'] = 'top';
var u96 = document.getElementById('u96');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u96ann'), "<div id='u96Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u96Note').click(function(e) { ToggleWorkflow(e, 'u96', 300, 150, false); return false; });
var u96Ann = 
{
"label":"textarea",
"Description":"Auto expand height when typing"};

var u439 = document.getElementById('u439');

var u291 = document.getElementById('u291');

u291.style.cursor = 'pointer';
if (bIE) u291.attachEvent("onclick", Clicku291);
else u291.addEventListener("click", Clicku291, true);
function Clicku291(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '12/9/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u486 = document.getElementById('u486');
gv_vAlignTable['u486'] = 'center';
var u337 = document.getElementById('u337');

var u256 = document.getElementById('u256');
gv_vAlignTable['u256'] = 'top';
var u288 = document.getElementById('u288');
gv_vAlignTable['u288'] = 'top';
var u454 = document.getElementById('u454');

var u129 = document.getElementById('u129');

u129.style.cursor = 'pointer';
if (bIE) u129.attachEvent("onclick", Clicku129);
else u129.addEventListener("click", Clicku129, true);
function Clicku129(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/10/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u174 = document.getElementById('u174');
gv_vAlignTable['u174'] = 'top';
var u440 = document.getElementById('u440');
gv_vAlignTable['u440'] = 'center';
var u205 = document.getElementById('u205');
gv_vAlignTable['u205'] = 'center';
var u183 = document.getElementById('u183');

u183.style.cursor = 'pointer';
if (bIE) u183.attachEvent("onclick", Clicku183);
else u183.addEventListener("click", Clicku183, true);
function Clicku183(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/7/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u10 = document.getElementById('u10');
gv_vAlignTable['u10'] = 'center';
var u481 = document.getElementById('u481');
gv_vAlignTable['u481'] = 'top';
var u179 = document.getElementById('u179');

u179.style.cursor = 'pointer';
if (bIE) u179.attachEvent("onclick", Clicku179);
else u179.addEventListener("click", Clicku179, true);
function Clicku179(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/5/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u141 = document.getElementById('u141');

u141.style.cursor = 'pointer';
if (bIE) u141.attachEvent("onclick", Clicku141);
else u141.addEventListener("click", Clicku141, true);
function Clicku141(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/16/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u197 = document.getElementById('u197');
gv_vAlignTable['u197'] = 'top';
var u473 = document.getElementById('u473');
gv_vAlignTable['u473'] = 'top';
var u39 = document.getElementById('u39');

var u71 = document.getElementById('u71');

var u15 = document.getElementById('u15');
gv_vAlignTable['u15'] = 'top';
var u477 = document.getElementById('u477');

var u453 = document.getElementById('u453');
gv_vAlignTable['u453'] = 'top';
var u128 = document.getElementById('u128');
gv_vAlignTable['u128'] = 'top';
var u467 = document.getElementById('u467');
gv_vAlignTable['u467'] = 'top';
var u398 = document.getElementById('u398');

u398.style.cursor = 'pointer';
if (bIE) u398.attachEvent("onclick", Clicku398);
else u398.addEventListener("click", Clicku398, true);
function Clicku398(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u325', '12/1/2009');

	SetPanelVisibility('u329','hidden','none',500);

}

}

var u204 = document.getElementById('u204');

u204.style.cursor = 'pointer';
if (bIE) u204.attachEvent("onclick", Clicku204);
else u204.addEventListener("click", Clicku204, true);
function Clicku204(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u206','toggle','none',500);

}

}

var u182 = document.getElementById('u182');
gv_vAlignTable['u182'] = 'top';
var u66 = document.getElementById('u66');

var u480 = document.getElementById('u480');
gv_vAlignTable['u480'] = 'center';
var u178 = document.getElementById('u178');
gv_vAlignTable['u178'] = 'top';
var u140 = document.getElementById('u140');
gv_vAlignTable['u140'] = 'top';
var u196 = document.getElementById('u196');
gv_vAlignTable['u196'] = 'top';
var u335 = document.getElementById('u335');
gv_vAlignTable['u335'] = 'center';
var u23 = document.getElementById('u23');
gv_vAlignTable['u23'] = 'top';
var u154 = document.getElementById('u154');
gv_vAlignTable['u154'] = 'top';
var u264 = document.getElementById('u264');
gv_vAlignTable['u264'] = 'top';
var u371 = document.getElementById('u371');
gv_vAlignTable['u371'] = 'top';
var u466 = document.getElementById('u466');

var u429 = document.getElementById('u429');

var u203 = document.getElementById('u203');
gv_vAlignTable['u203'] = 'top';
var u181 = document.getElementById('u181');

u181.style.cursor = 'pointer';
if (bIE) u181.attachEvent("onclick", Clicku181);
else u181.addEventListener("click", Clicku181, true);
function Clicku181(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '12/6/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u84 = document.getElementById('u84');
gv_vAlignTable['u84'] = 'center';
var u258 = document.getElementById('u258');
gv_vAlignTable['u258'] = 'top';
var u320 = document.getElementById('u320');

var u4 = document.getElementById('u4');

var u217 = document.getElementById('u217');

u217.style.cursor = 'pointer';
if (bIE) u217.attachEvent("onclick", Clicku217);
else u217.addEventListener("click", Clicku217, true);
function Clicku217(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/2/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u195 = document.getElementById('u195');
gv_vAlignTable['u195'] = 'top';
var u225 = document.getElementById('u225');

u225.style.cursor = 'pointer';
if (bIE) u225.attachEvent("onclick", Clicku225);
else u225.addEventListener("click", Clicku225, true);
function Clicku225(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u202', '11/6/2009');

	SetPanelVisibility('u206','hidden','none',500);

}

}

var u41 = document.getElementById('u41');

var u334 = document.getElementById('u334');

var u153 = document.getElementById('u153');

u153.style.cursor = 'pointer';
if (bIE) u153.attachEvent("onclick", Clicku153);
else u153.addEventListener("click", Clicku153, true);
function Clicku153(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u98', '11/22/2009');

	SetPanelVisibility('u102','hidden','none',500);

}

}

var u451 = document.getElementById('u451');

if (window.OnLoad) OnLoad();
