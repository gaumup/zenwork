
var PageName = 'Issue tracking';
var PageId = '97ebe13131064061848d396821cacc9a'
var PageUrl = 'Issue_tracking.html'
document.title = 'Issue tracking';
var PageNotes = 
{
"pageName":"Issue tracking",
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

var u167 = document.getElementById('u167');
gv_vAlignTable['u167'] = 'top';
var u299 = document.getElementById('u299');

u299.style.cursor = 'pointer';
if (bIE) u299.attachEvent("onclick", Clicku299);
else u299.addEventListener("click", Clicku299, true);
function Clicku299(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/26/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u202 = document.getElementById('u202');
gv_vAlignTable['u202'] = 'center';
var u180 = document.getElementById('u180');

u180.style.cursor = 'pointer';
if (bIE) u180.attachEvent("onclick", Clicku180);
else u180.addEventListener("click", Clicku180, true);
function Clicku180(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/12/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u136 = document.getElementById('u136');

u136.style.cursor = 'pointer';
if (bIE) u136.attachEvent("onclick", Clicku136);
else u136.addEventListener("click", Clicku136, true);
function Clicku136(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/20/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u216 = document.getElementById('u216');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u216ann'), "<div id='u216Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u216Note').click(function(e) { ToggleWorkflow(e, 'u216', 300, 150, false); return false; });
var u216Ann = 
{
"label":"menu button secondary",
"Description":"Only creator or PM can edit"};

u216.style.cursor = 'pointer';
if (bIE) u216.attachEvent("onclick", Clicku216);
else u216.addEventListener("click", Clicku216, true);
function Clicku216(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u193','','none',500);

}

}

if (bIE) u216.attachEvent("onmouseover", MouseOveru216);
else u216.addEventListener("mouseover", MouseOveru216, true);
function MouseOveru216(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u216',e)) return;
if (true) {

SetWidgetSelected('u210');
}

}

if (bIE) u216.attachEvent("onmouseout", MouseOutu216);
else u216.addEventListener("mouseout", MouseOutu216, true);
function MouseOutu216(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u216',e)) return;
if (true) {

SetWidgetNotSelected('u210');
}

}

var u194 = document.getElementById('u194');

if (bIE) u194.attachEvent("onmouseover", MouseOveru194);
else u194.addEventListener("mouseover", MouseOveru194, true);
function MouseOveru194(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u194',e)) return;
if (true) {

	SetPanelVisibility('u193','hidden','none',500);

}

}

var u333 = document.getElementById('u333');
gv_vAlignTable['u333'] = 'top';
var u97 = document.getElementById('u97');

var u152 = document.getElementById('u152');

u152.style.cursor = 'pointer';
if (bIE) u152.attachEvent("onclick", Clicku152);
else u152.addEventListener("click", Clicku152, true);
function Clicku152(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/28/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u60 = document.getElementById('u60');
gv_vAlignTable['u60'] = 'top';
var u78 = document.getElementById('u78');

var u166 = document.getElementById('u166');

u166.style.cursor = 'pointer';
if (bIE) u166.attachEvent("onclick", Clicku166);
else u166.addEventListener("click", Clicku166, true);
function Clicku166(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/5/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u298 = document.getElementById('u298');
gv_vAlignTable['u298'] = 'top';
var u139 = document.getElementById('u139');
gv_vAlignTable['u139'] = 'top';
var u201 = document.getElementById('u201');

var u1 = document.getElementById('u1');
gv_vAlignTable['u1'] = 'center';
var u215 = document.getElementById('u215');
gv_vAlignTable['u215'] = 'center';
var u193 = document.getElementById('u193');

var u11 = document.getElementById('u11');

var u126 = document.getElementById('u126');

u126.style.cursor = 'pointer';
if (bIE) u126.attachEvent("onclick", Clicku126);
else u126.addEventListener("click", Clicku126, true);
function Clicku126(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/15/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u332 = document.getElementById('u332');
gv_vAlignTable['u332'] = 'top';
var u275 = document.getElementById('u275');

u275.style.cursor = 'pointer';
if (bIE) u275.attachEvent("onclick", Clicku275);
else u275.addEventListener("click", Clicku275, true);
function Clicku275(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/14/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u151 = document.getElementById('u151');
gv_vAlignTable['u151'] = 'top';
var u346 = document.getElementById('u346');

var u26 = document.getElementById('u26');

var u165 = document.getElementById('u165');
gv_vAlignTable['u165'] = 'top';
var u138 = document.getElementById('u138');

u138.style.cursor = 'pointer';
if (bIE) u138.attachEvent("onclick", Clicku138);
else u138.addEventListener("click", Clicku138, true);
function Clicku138(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/21/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u100 = document.getElementById('u100');

u100.style.cursor = 'pointer';
if (bIE) u100.attachEvent("onclick", Clicku100);
else u100.addEventListener("click", Clicku100, true);
function Clicku100(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/2/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u54 = document.getElementById('u54');
gv_vAlignTable['u54'] = 'top';
var u302 = document.getElementById('u302');
gv_vAlignTable['u302'] = 'top';
var u236 = document.getElementById('u236');

var u214 = document.getElementById('u214');

var u192 = document.getElementById('u192');
gv_vAlignTable['u192'] = 'center';
var u67 = document.getElementById('u67');

var u269 = document.getElementById('u269');

u269.style.cursor = 'pointer';
if (bIE) u269.attachEvent("onclick", Clicku269);
else u269.addEventListener("click", Clicku269, true);
function Clicku269(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/11/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u331 = document.getElementById('u331');

u331.style.cursor = 'pointer';
if (bIE) u331.attachEvent("onclick", Clicku331);
else u331.addEventListener("click", Clicku331, true);
function Clicku331(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/12/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u321 = document.getElementById('u321');

u321.style.cursor = 'pointer';
if (bIE) u321.attachEvent("onclick", Clicku321);
else u321.addEventListener("click", Clicku321, true);
function Clicku321(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/7/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u150 = document.getElementById('u150');

u150.style.cursor = 'pointer';
if (bIE) u150.attachEvent("onclick", Clicku150);
else u150.addEventListener("click", Clicku150, true);
function Clicku150(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/27/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u287 = document.getElementById('u287');

u287.style.cursor = 'pointer';
if (bIE) u287.attachEvent("onclick", Clicku287);
else u287.addEventListener("click", Clicku287, true);
function Clicku287(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/20/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u48 = document.getElementById('u48');
gv_vAlignTable['u48'] = 'top';
var u345 = document.getElementById('u345');
gv_vAlignTable['u345'] = 'center';
var u24 = document.getElementById('u24');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u24ann'), "<div id='u24Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u24Note').click(function(e) { ToggleWorkflow(e, 'u24', 300, 150, false); return false; });
var u24Ann = 
{
"label":"paragraph",
"Description":"Visual chart thể hiện cơ cấu thành phần nhân sự tham dự dự án. Nếu có được 1 widget cho phép tạo dynamic cấu trúc nhân sự theo dạng cây thì quá tốt"};
gv_vAlignTable['u24'] = 'top';
var u80 = document.getElementById('u80');

var u65 = document.getElementById('u65');
gv_vAlignTable['u65'] = 'center';
var u318 = document.getElementById('u318');
gv_vAlignTable['u318'] = 'top';
var u113 = document.getElementById('u113');
gv_vAlignTable['u113'] = 'top';
var u268 = document.getElementById('u268');
gv_vAlignTable['u268'] = 'top';
var u330 = document.getElementById('u330');
gv_vAlignTable['u330'] = 'top';
var u274 = document.getElementById('u274');
gv_vAlignTable['u274'] = 'top';
var u227 = document.getElementById('u227');

var u42 = document.getElementById('u42');
gv_vAlignTable['u42'] = 'top';
var u159 = document.getElementById('u159');
gv_vAlignTable['u159'] = 'top';
var u163 = document.getElementById('u163');
gv_vAlignTable['u163'] = 'top';
var u63 = document.getElementById('u63');

var u177 = document.getElementById('u177');
gv_vAlignTable['u177'] = 'top';
var u37 = document.getElementById('u37');

var u93 = document.getElementById('u93');
gv_vAlignTable['u93'] = 'center';
var u112 = document.getElementById('u112');

u112.style.cursor = 'pointer';
if (bIE) u112.attachEvent("onclick", Clicku112);
else u112.addEventListener("click", Clicku112, true);
function Clicku112(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/8/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u307 = document.getElementById('u307');

u307.style.cursor = 'pointer';
if (bIE) u307.attachEvent("onclick", Clicku307);
else u307.addEventListener("click", Clicku307, true);
function Clicku307(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/30/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u285 = document.getElementById('u285');

u285.style.cursor = 'pointer';
if (bIE) u285.attachEvent("onclick", Clicku285);
else u285.addEventListener("click", Clicku285, true);
function Clicku285(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/19/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u18 = document.getElementById('u18');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u18ann'), "<div id='u18Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u18Note').click(function(e) { ToggleWorkflow(e, 'u18', 300, 150, false); return false; });
var u18Ann = 
{
"label":"link",
"Description":"Thể hiện những thông tin cơ bản như:<BR>- Mô tả dự án<BR>- Goal<BR>- Scope<BR>- Product mà dự án hỗ trợ<BR>- Partner của product<BR>- Timeline(start - end)<BR>- Project manager"};

u18.style.cursor = 'pointer';
if (bIE) u18.attachEvent("onclick", Clicku18);
else u18.addEventListener("click", Clicku18, true);
function Clicku18(e)
{
windowEvent = e;


if (true) {

	self.location.href="Details.html" + GetQuerystring();

}

}
gv_vAlignTable['u18'] = 'top';
var u50 = document.getElementById('u50');
gv_vAlignTable['u50'] = 'top';
var u74 = document.getElementById('u74');

var u162 = document.getElementById('u162');

u162.style.cursor = 'pointer';
if (bIE) u162.attachEvent("onclick", Clicku162);
else u162.addEventListener("click", Clicku162, true);
function Clicku162(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/3/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u357 = document.getElementById('u357');

var u79 = document.getElementById('u79');
gv_vAlignTable['u79'] = 'center';
var u176 = document.getElementById('u176');

u176.style.cursor = 'pointer';
if (bIE) u176.attachEvent("onclick", Clicku176);
else u176.addEventListener("click", Clicku176, true);
function Clicku176(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/10/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u55 = document.getElementById('u55');

var u149 = document.getElementById('u149');
gv_vAlignTable['u149'] = 'top';
var u111 = document.getElementById('u111');
gv_vAlignTable['u111'] = 'top';
var u306 = document.getElementById('u306');
gv_vAlignTable['u306'] = 'top';
var u284 = document.getElementById('u284');
gv_vAlignTable['u284'] = 'top';
var u12 = document.getElementById('u12');

var u342 = document.getElementById('u342');

var u161 = document.getElementById('u161');
gv_vAlignTable['u161'] = 'top';
var u329 = document.getElementById('u329');

u329.style.cursor = 'pointer';
if (bIE) u329.attachEvent("onclick", Clicku329);
else u329.addEventListener("click", Clicku329, true);
function Clicku329(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/11/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u356 = document.getElementById('u356');

var u175 = document.getElementById('u175');
gv_vAlignTable['u175'] = 'top';
var u229 = document.getElementById('u229');
gv_vAlignTable['u229'] = 'top';
var u148 = document.getElementById('u148');

u148.style.cursor = 'pointer';
if (bIE) u148.attachEvent("onclick", Clicku148);
else u148.addEventListener("click", Clicku148, true);
function Clicku148(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/26/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u110 = document.getElementById('u110');

u110.style.cursor = 'pointer';
if (bIE) u110.attachEvent("onclick", Clicku110);
else u110.addEventListener("click", Clicku110, true);
function Clicku110(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/7/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u348 = document.getElementById('u348');

var u305 = document.getElementById('u305');

u305.style.cursor = 'pointer';
if (bIE) u305.attachEvent("onclick", Clicku305);
else u305.addEventListener("click", Clicku305, true);
function Clicku305(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/29/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u283 = document.getElementById('u283');

u283.style.cursor = 'pointer';
if (bIE) u283.attachEvent("onclick", Clicku283);
else u283.addEventListener("click", Clicku283, true);
function Clicku283(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/18/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u20 = document.getElementById('u20');

u20.style.cursor = 'pointer';
if (bIE) u20.attachEvent("onclick", Clicku20);
else u20.addEventListener("click", Clicku20, true);
function Clicku20(e)
{
windowEvent = e;


if (true) {

	self.location.href="Project.html" + GetQuerystring();

}

}
gv_vAlignTable['u20'] = 'top';
var u124 = document.getElementById('u124');

u124.style.cursor = 'pointer';
if (bIE) u124.attachEvent("onclick", Clicku124);
else u124.addEventListener("click", Clicku124, true);
function Clicku124(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/14/2009');

	SetPanelVisibility('u89','hidden','none',500);

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

SetWidgetFormText('u236', '11/16/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u38 = document.getElementById('u38');

var u241 = document.getElementById('u241');

var u160 = document.getElementById('u160');

u160.style.cursor = 'pointer';
if (bIE) u160.attachEvent("onclick", Clicku160);
else u160.addEventListener("click", Clicku160, true);
function Clicku160(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/2/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u297 = document.getElementById('u297');

u297.style.cursor = 'pointer';
if (bIE) u297.attachEvent("onclick", Clicku297);
else u297.addEventListener("click", Clicku297, true);
function Clicku297(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/25/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u8 = document.getElementById('u8');

var u49 = document.getElementById('u49');

var u355 = document.getElementById('u355');

var u25 = document.getElementById('u25');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u25ann'), "<div id='u25Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u25Note').click(function(e) { ToggleWorkflow(e, 'u25', 300, 150, false); return false; });
var u25Ann = 
{
"label":"paragraph",
"Description":"Thể hiện thông tin về phần đánh giá nhân sự trong dự án. Phần này cần review thêm là thể hiện đơn giản hơn hay là thể hiện link đến trang performance?"};
gv_vAlignTable['u25'] = 'top';
var u309 = document.getElementById('u309');

u309.style.cursor = 'pointer';
if (bIE) u309.attachEvent("onclick", Clicku309);
else u309.addEventListener("click", Clicku309, true);
function Clicku309(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/1/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u228 = document.getElementById('u228');
gv_vAlignTable['u228'] = 'center';
var u81 = document.getElementById('u81');
gv_vAlignTable['u81'] = 'center';
var u88 = document.getElementById('u88');
gv_vAlignTable['u88'] = 'center';
var u304 = document.getElementById('u304');
gv_vAlignTable['u304'] = 'top';
var u282 = document.getElementById('u282');
gv_vAlignTable['u282'] = 'top';
var u76 = document.getElementById('u76');

var u123 = document.getElementById('u123');
gv_vAlignTable['u123'] = 'top';
var u278 = document.getElementById('u278');
gv_vAlignTable['u278'] = 'top';
var u240 = document.getElementById('u240');

var u296 = document.getElementById('u296');
gv_vAlignTable['u296'] = 'top';
var u137 = document.getElementById('u137');
gv_vAlignTable['u137'] = 'top';
var u33 = document.getElementById('u33');

var u254 = document.getElementById('u254');
gv_vAlignTable['u254'] = 'top';
var u173 = document.getElementById('u173');
gv_vAlignTable['u173'] = 'top';
var u343 = document.getElementById('u343');
gv_vAlignTable['u343'] = 'center';
var u290 = document.getElementById('u290');
gv_vAlignTable['u290'] = 'top';
var u213 = document.getElementById('u213');

var u303 = document.getElementById('u303');

u303.style.cursor = 'pointer';
if (bIE) u303.attachEvent("onclick", Clicku303);
else u303.addEventListener("click", Clicku303, true);
function Clicku303(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/28/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u281 = document.getElementById('u281');

u281.style.cursor = 'pointer';
if (bIE) u281.attachEvent("onclick", Clicku281);
else u281.addEventListener("click", Clicku281, true);
function Clicku281(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/17/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u94 = document.getElementById('u94');

var u122 = document.getElementById('u122');

u122.style.cursor = 'pointer';
if (bIE) u122.attachEvent("onclick", Clicku122);
else u122.addEventListener("click", Clicku122, true);
function Clicku122(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/13/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u358 = document.getElementById('u358');
gv_vAlignTable['u358'] = 'center';
var u5 = document.getElementById('u5');
gv_vAlignTable['u5'] = 'center';
var u317 = document.getElementById('u317');

u317.style.cursor = 'pointer';
if (bIE) u317.attachEvent("onclick", Clicku317);
else u317.addEventListener("click", Clicku317, true);
function Clicku317(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/5/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u295 = document.getElementById('u295');

u295.style.cursor = 'pointer';
if (bIE) u295.attachEvent("onclick", Clicku295);
else u295.addEventListener("click", Clicku295, true);
function Clicku295(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/24/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u19 = document.getElementById('u19');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u19ann'), "<div id='u19Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u19Note').click(function(e) { ToggleWorkflow(e, 'u19', 300, 150, false); return false; });
var u19Ann = 
{
"label":"paragraph",
"Description":"Show gantt chart"};

u19.style.cursor = 'pointer';
if (bIE) u19.attachEvent("onclick", Clicku19);
else u19.addEventListener("click", Clicku19, true);
function Clicku19(e)
{
windowEvent = e;


if (true) {

	self.location.href="Timelline_plan.html" + GetQuerystring();

}

}
gv_vAlignTable['u19'] = 'top';
var u51 = document.getElementById('u51');
gv_vAlignTable['u51'] = 'top';
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

SetWidgetFormText('u236', '11/3/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u172 = document.getElementById('u172');

u172.style.cursor = 'pointer';
if (bIE) u172.attachEvent("onclick", Clicku172);
else u172.addEventListener("click", Clicku172, true);
function Clicku172(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/8/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u359 = document.getElementById('u359');

u359.style.cursor = 'pointer';
if (bIE) u359.attachEvent("onclick", Clicku359);
else u359.addEventListener("click", Clicku359, true);
function Clicku359(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u340','','none',500);

}

}

if (bIE) u359.attachEvent("onmouseover", MouseOveru359);
else u359.addEventListener("mouseover", MouseOveru359, true);
function MouseOveru359(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u359',e)) return;
if (true) {

SetWidgetSelected('u353');
}

}

if (bIE) u359.attachEvent("onmouseout", MouseOutu359);
else u359.addEventListener("mouseout", MouseOutu359, true);
function MouseOutu359(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u359',e)) return;
if (true) {

SetWidgetNotSelected('u353');
}

}

var u267 = document.getElementById('u267');

u267.style.cursor = 'pointer';
if (bIE) u267.attachEvent("onclick", Clicku267);
else u267.addEventListener("click", Clicku267, true);
function Clicku267(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/10/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u46 = document.getElementById('u46');
gv_vAlignTable['u46'] = 'top';
var u280 = document.getElementById('u280');
gv_vAlignTable['u280'] = 'top';
var u121 = document.getElementById('u121');
gv_vAlignTable['u121'] = 'top';
var u316 = document.getElementById('u316');
gv_vAlignTable['u316'] = 'top';
var u294 = document.getElementById('u294');
gv_vAlignTable['u294'] = 'top';
var u135 = document.getElementById('u135');
gv_vAlignTable['u135'] = 'top';
var u108 = document.getElementById('u108');

u108.style.cursor = 'pointer';
if (bIE) u108.attachEvent("onclick", Clicku108);
else u108.addEventListener("click", Clicku108, true);
function Clicku108(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/6/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u252 = document.getElementById('u252');
gv_vAlignTable['u252'] = 'top';
var u171 = document.getElementById('u171');
gv_vAlignTable['u171'] = 'top';
var u191 = document.getElementById('u191');

var u266 = document.getElementById('u266');
gv_vAlignTable['u266'] = 'top';
var u64 = document.getElementById('u64');

var u239 = document.getElementById('u239');
gv_vAlignTable['u239'] = 'center';
var u301 = document.getElementById('u301');

u301.style.cursor = 'pointer';
if (bIE) u301.attachEvent("onclick", Clicku301);
else u301.addEventListener("click", Clicku301, true);
function Clicku301(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/27/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u120 = document.getElementById('u120');

u120.style.cursor = 'pointer';
if (bIE) u120.attachEvent("onclick", Clicku120);
else u120.addEventListener("click", Clicku120, true);
function Clicku120(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/12/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u2 = document.getElementById('u2');

u2.style.cursor = 'pointer';
if (bIE) u2.attachEvent("onclick", Clicku2);
else u2.addEventListener("click", Clicku2, true);
function Clicku2(e)
{
windowEvent = e;


if (true) {

	self.location.href="Home.html" + GetQuerystring();

}

}

var u169 = document.getElementById('u169');
gv_vAlignTable['u169'] = 'top';
var u315 = document.getElementById('u315');

u315.style.cursor = 'pointer';
if (bIE) u315.attachEvent("onclick", Clicku315);
else u315.addEventListener("click", Clicku315, true);
function Clicku315(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/4/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u293 = document.getElementById('u293');

u293.style.cursor = 'pointer';
if (bIE) u293.attachEvent("onclick", Clicku293);
else u293.addEventListener("click", Clicku293, true);
function Clicku293(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/23/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u21 = document.getElementById('u21');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u21ann'), "<div id='u21Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u21Note').click(function(e) { ToggleWorkflow(e, 'u21', 300, 150, false); return false; });
var u21Ann = 
{
"label":"paragraph",
"Description":"Show calendar của dự án, trong đó thể hiện các deliverable, giao diện tương tự trang Delivery, tuy nhiên sẽ không có cột bên tay trái thể hiện group"};

u21.style.cursor = 'pointer';
if (bIE) u21.attachEvent("onclick", Clicku21);
else u21.addEventListener("click", Clicku21, true);
function Clicku21(e)
{
windowEvent = e;


if (true) {

	self.location.href="Delivery_plan.html" + GetQuerystring();

}

}
gv_vAlignTable['u21'] = 'top';
var u134 = document.getElementById('u134');

u134.style.cursor = 'pointer';
if (bIE) u134.attachEvent("onclick", Clicku134);
else u134.addEventListener("click", Clicku134, true);
function Clicku134(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/19/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u251 = document.getElementById('u251');

u251.style.cursor = 'pointer';
if (bIE) u251.attachEvent("onclick", Clicku251);
else u251.addEventListener("click", Clicku251, true);
function Clicku251(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/2/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u170 = document.getElementById('u170');

u170.style.cursor = 'pointer';
if (bIE) u170.attachEvent("onclick", Clicku170);
else u170.addEventListener("click", Clicku170, true);
function Clicku170(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/7/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u319 = document.getElementById('u319');

u319.style.cursor = 'pointer';
if (bIE) u319.attachEvent("onclick", Clicku319);
else u319.addEventListener("click", Clicku319, true);
function Clicku319(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/6/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u82 = document.getElementById('u82');

var u16 = document.getElementById('u16');

var u238 = document.getElementById('u238');

u238.style.cursor = 'pointer';
if (bIE) u238.attachEvent("onclick", Clicku238);
else u238.addEventListener("click", Clicku238, true);
function Clicku238(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u240','toggle','none',500);

}

}

var u200 = document.getElementById('u200');
gv_vAlignTable['u200'] = 'center';
var u314 = document.getElementById('u314');
gv_vAlignTable['u314'] = 'top';
var u292 = document.getElementById('u292');
gv_vAlignTable['u292'] = 'top';
var u77 = document.getElementById('u77');
gv_vAlignTable['u77'] = 'center';
var u133 = document.getElementById('u133');
gv_vAlignTable['u133'] = 'top';
var u250 = document.getElementById('u250');
gv_vAlignTable['u250'] = 'top';
var u147 = document.getElementById('u147');
gv_vAlignTable['u147'] = 'top';
var u58 = document.getElementById('u58');
gv_vAlignTable['u58'] = 'top';
var u34 = document.getElementById('u34');
gv_vAlignTable['u34'] = 'center';
var u90 = document.getElementById('u90');

var u61 = document.getElementById('u61');
gv_vAlignTable['u61'] = 'top';
var u164 = document.getElementById('u164');

u164.style.cursor = 'pointer';
if (bIE) u164.attachEvent("onclick", Clicku164);
else u164.addEventListener("click", Clicku164, true);
function Clicku164(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/4/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u95 = document.getElementById('u95');
gv_vAlignTable['u95'] = 'center';
var u132 = document.getElementById('u132');

u132.style.cursor = 'pointer';
if (bIE) u132.attachEvent("onclick", Clicku132);
else u132.addEventListener("click", Clicku132, true);
function Clicku132(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/18/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u327 = document.getElementById('u327');

u327.style.cursor = 'pointer';
if (bIE) u327.attachEvent("onclick", Clicku327);
else u327.addEventListener("click", Clicku327, true);
function Clicku327(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/10/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u146 = document.getElementById('u146');

u146.style.cursor = 'pointer';
if (bIE) u146.attachEvent("onclick", Clicku146);
else u146.addEventListener("click", Clicku146, true);
function Clicku146(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/25/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u52 = document.getElementById('u52');
gv_vAlignTable['u52'] = 'top';
var u125 = document.getElementById('u125');
gv_vAlignTable['u125'] = 'top';
var u263 = document.getElementById('u263');

u263.style.cursor = 'pointer';
if (bIE) u263.attachEvent("onclick", Clicku263);
else u263.addEventListener("click", Clicku263, true);
function Clicku263(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/8/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u277 = document.getElementById('u277');

u277.style.cursor = 'pointer';
if (bIE) u277.attachEvent("onclick", Clicku277);
else u277.addEventListener("click", Clicku277, true);
function Clicku277(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/15/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u47 = document.getElementById('u47');

var u212 = document.getElementById('u212');

var u131 = document.getElementById('u131');
gv_vAlignTable['u131'] = 'top';
var u28 = document.getElementById('u28');

var u145 = document.getElementById('u145');
gv_vAlignTable['u145'] = 'top';
var u118 = document.getElementById('u118');

u118.style.cursor = 'pointer';
if (bIE) u118.attachEvent("onclick", Clicku118);
else u118.addEventListener("click", Clicku118, true);
function Clicku118(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/11/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u32 = document.getElementById('u32');
gv_vAlignTable['u32'] = 'center';
var u322 = document.getElementById('u322');
gv_vAlignTable['u322'] = 'top';
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

SetWidgetFormText('u236', '11/1/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u211 = document.getElementById('u211');
gv_vAlignTable['u211'] = 'center';
var u130 = document.getElementById('u130');

u130.style.cursor = 'pointer';
if (bIE) u130.attachEvent("onclick", Clicku130);
else u130.addEventListener("click", Clicku130, true);
function Clicku130(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/17/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u85 = document.getElementById('u85');
gv_vAlignTable['u85'] = 'center';
var u22 = document.getElementById('u22');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u22ann'), "<div id='u22Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u22Note').click(function(e) { ToggleWorkflow(e, 'u22', 300, 150, false); return false; });
var u22Ann = 
{
"label":"paragraph",
"Description":"Thể hiện list các issue\/bug trong dự án sắp xếp theo độ ưu tiên trong 1 table, có nút post bug(to, dễ nhìn), khi click sẽ mở popup cho phép tạo 1 issue\/bug mới"};

u22.style.cursor = 'pointer';
if (bIE) u22.attachEvent("onclick", Clicku22);
else u22.addEventListener("click", Clicku22, true);
function Clicku22(e)
{
windowEvent = e;


if (true) {

	self.location.href="resources/reload.html#" + encodeURI(PageUrl + GetQuerystring());

}

}
gv_vAlignTable['u22'] = 'top';
var u144 = document.getElementById('u144');

u144.style.cursor = 'pointer';
if (bIE) u144.attachEvent("onclick", Clicku144);
else u144.addEventListener("click", Clicku144, true);
function Clicku144(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/24/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u261 = document.getElementById('u261');

u261.style.cursor = 'pointer';
if (bIE) u261.attachEvent("onclick", Clicku261);
else u261.addEventListener("click", Clicku261, true);
function Clicku261(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/7/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u43 = document.getElementById('u43');

var u73 = document.getElementById('u73');
gv_vAlignTable['u73'] = 'center';
var u260 = document.getElementById('u260');
gv_vAlignTable['u260'] = 'top';
var u17 = document.getElementById('u17');
gv_vAlignTable['u17'] = 'center';
var u248 = document.getElementById('u248');

var u210 = document.getElementById('u210');

var u107 = document.getElementById('u107');
gv_vAlignTable['u107'] = 'top';
var u44 = document.getElementById('u44');
gv_vAlignTable['u44'] = 'top';
var u30 = document.getElementById('u30');
gv_vAlignTable['u30'] = 'top';
var u224 = document.getElementById('u224');
gv_vAlignTable['u224'] = 'center';
var u143 = document.getElementById('u143');
gv_vAlignTable['u143'] = 'top';
var u341 = document.getElementById('u341');

if (bIE) u341.attachEvent("onmouseover", MouseOveru341);
else u341.addEventListener("mouseover", MouseOveru341, true);
function MouseOveru341(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u341',e)) return;
if (true) {

	SetPanelVisibility('u340','hidden','none',500);

}

}

var u72 = document.getElementById('u72');

var u9 = document.getElementById('u9');
gv_vAlignTable['u9'] = 'center';
var u157 = document.getElementById('u157');
gv_vAlignTable['u157'] = 'top';
var u59 = document.getElementById('u59');

var u189 = document.getElementById('u189');

var u35 = document.getElementById('u35');

var u91 = document.getElementById('u91');
gv_vAlignTable['u91'] = 'center';
var u328 = document.getElementById('u328');
gv_vAlignTable['u328'] = 'top';
var u106 = document.getElementById('u106');

u106.style.cursor = 'pointer';
if (bIE) u106.attachEvent("onclick", Clicku106);
else u106.addEventListener("click", Clicku106, true);
function Clicku106(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/5/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u223 = document.getElementById('u223');

var u142 = document.getElementById('u142');

u142.style.cursor = 'pointer';
if (bIE) u142.attachEvent("onclick", Clicku142);
else u142.addEventListener("click", Clicku142, true);
function Clicku142(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/23/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u86 = document.getElementById('u86');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u86ann'), "<div id='u86Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u86Note').click(function(e) { ToggleWorkflow(e, 'u86', 300, 150, false); return false; });
var u86Ann = 
{
"label":"textfield - date",
"Description":"Only creator or PM can edit"};

var u265 = document.getElementById('u265');

u265.style.cursor = 'pointer';
if (bIE) u265.attachEvent("onclick", Clicku265);
else u265.addEventListener("click", Clicku265, true);
function Clicku265(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/9/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u340 = document.getElementById('u340');

var u237 = document.getElementById('u237');
gv_vAlignTable['u237'] = 'top';
var u156 = document.getElementById('u156');

u156.style.cursor = 'pointer';
if (bIE) u156.attachEvent("onclick", Clicku156);
else u156.addEventListener("click", Clicku156, true);
function Clicku156(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/30/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u7 = document.getElementById('u7');
gv_vAlignTable['u7'] = 'center';
var u188 = document.getElementById('u188');
gv_vAlignTable['u188'] = 'top';
var u354 = document.getElementById('u354');
gv_vAlignTable['u354'] = 'center';
var u273 = document.getElementById('u273');

u273.style.cursor = 'pointer';
if (bIE) u273.attachEvent("onclick", Clicku273);
else u273.addEventListener("click", Clicku273, true);
function Clicku273(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/13/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u105 = document.getElementById('u105');
gv_vAlignTable['u105'] = 'top';
var u222 = document.getElementById('u222');
gv_vAlignTable['u222'] = 'center';
var u6 = document.getElementById('u6');

u6.style.cursor = 'pointer';
if (bIE) u6.attachEvent("onclick", Clicku6);
else u6.addEventListener("click", Clicku6, true);
function Clicku6(e)
{
windowEvent = e;


if (true) {

	self.location.href="Project.html" + GetQuerystring();

}

}

var u36 = document.getElementById('u36');
gv_vAlignTable['u36'] = 'center';
var u29 = document.getElementById('u29');
gv_vAlignTable['u29'] = 'center';
var u155 = document.getElementById('u155');
gv_vAlignTable['u155'] = 'top';
var u209 = document.getElementById('u209');
gv_vAlignTable['u209'] = 'top';
var u353 = document.getElementById('u353');

var u272 = document.getElementById('u272');
gv_vAlignTable['u272'] = 'top';
var u336 = document.getElementById('u336');
gv_vAlignTable['u336'] = 'top';
var u104 = document.getElementById('u104');

u104.style.cursor = 'pointer';
if (bIE) u104.attachEvent("onclick", Clicku104);
else u104.addEventListener("click", Clicku104, true);
function Clicku104(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/4/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u308 = document.getElementById('u308');
gv_vAlignTable['u308'] = 'top';
var u56 = document.getElementById('u56');
gv_vAlignTable['u56'] = 'top';
var u221 = document.getElementById('u221');

var u119 = document.getElementById('u119');
gv_vAlignTable['u119'] = 'top';
var u232 = document.getElementById('u232');

var u235 = document.getElementById('u235');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u235ann'), "<div id='u235Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u235Note').click(function(e) { ToggleWorkflow(e, 'u235', 300, 150, false); return false; });
var u235Ann = 
{
"label":"link",
"Description":"Open attachment dialog"};
gv_vAlignTable['u235'] = 'top';
var u75 = document.getElementById('u75');
gv_vAlignTable['u75'] = 'center';
var u13 = document.getElementById('u13');
gv_vAlignTable['u13'] = 'center';
var u208 = document.getElementById('u208');
gv_vAlignTable['u208'] = 'center';
var u352 = document.getElementById('u352');
gv_vAlignTable['u352'] = 'top';
var u271 = document.getElementById('u271');

u271.style.cursor = 'pointer';
if (bIE) u271.attachEvent("onclick", Clicku271);
else u271.addEventListener("click", Clicku271, true);
function Clicku271(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/12/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u98 = document.getElementById('u98');

u98.style.cursor = 'pointer';
if (bIE) u98.attachEvent("onclick", Clicku98);
else u98.addEventListener("click", Clicku98, true);
function Clicku98(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/1/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u103 = document.getElementById('u103');
gv_vAlignTable['u103'] = 'top';
var u339 = document.getElementById('u339');
gv_vAlignTable['u339'] = 'top';
var u158 = document.getElementById('u158');

u158.style.cursor = 'pointer';
if (bIE) u158.attachEvent("onclick", Clicku158);
else u158.addEventListener("click", Clicku158, true);
function Clicku158(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/1/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u220 = document.getElementById('u220');
gv_vAlignTable['u220'] = 'center';
var u3 = document.getElementById('u3');
gv_vAlignTable['u3'] = 'center';
var u117 = document.getElementById('u117');
gv_vAlignTable['u117'] = 'top';
var u31 = document.getElementById('u31');

var u234 = document.getElementById('u234');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u234ann'), "<div id='u234Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u234Note').click(function(e) { ToggleWorkflow(e, 'u234', 300, 150, false); return false; });
var u234Ann = 
{
"label":"textarea",
"Description":"Auto expand height when typing"};

var u351 = document.getElementById('u351');
gv_vAlignTable['u351'] = 'center';
var u270 = document.getElementById('u270');
gv_vAlignTable['u270'] = 'top';
var u199 = document.getElementById('u199');

var u92 = document.getElementById('u92');

var u102 = document.getElementById('u102');

u102.style.cursor = 'pointer';
if (bIE) u102.attachEvent("onclick", Clicku102);
else u102.addEventListener("click", Clicku102, true);
function Clicku102(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/3/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u338 = document.getElementById('u338');
gv_vAlignTable['u338'] = 'top';
var u300 = document.getElementById('u300');
gv_vAlignTable['u300'] = 'top';
var u116 = document.getElementById('u116');

u116.style.cursor = 'pointer';
if (bIE) u116.attachEvent("onclick", Clicku116);
else u116.addEventListener("click", Clicku116, true);
function Clicku116(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/10/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u186 = document.getElementById('u186');
gv_vAlignTable['u186'] = 'top';
var u233 = document.getElementById('u233');

var u87 = document.getElementById('u87');

u87.style.cursor = 'pointer';
if (bIE) u87.attachEvent("onclick", Clicku87);
else u87.addEventListener("click", Clicku87, true);
function Clicku87(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u89','toggle','none',500);

}

}

var u350 = document.getElementById('u350');

var u347 = document.getElementById('u347');
gv_vAlignTable['u347'] = 'center';
var u247 = document.getElementById('u247');
gv_vAlignTable['u247'] = 'top';
var u68 = document.getElementById('u68');
gv_vAlignTable['u68'] = 'center';
var u226 = document.getElementById('u226');
gv_vAlignTable['u226'] = 'top';
var u198 = document.getElementById('u198');
gv_vAlignTable['u198'] = 'center';
var u101 = document.getElementById('u101');
gv_vAlignTable['u101'] = 'top';
var u0 = document.getElementById('u0');

u0.style.cursor = 'pointer';
if (bIE) u0.attachEvent("onclick", Clicku0);
else u0.addEventListener("click", Clicku0, true);
function Clicku0(e)
{
windowEvent = e;


if (true) {

	self.location.href="Deliver.html" + GetQuerystring();

}

}

var u190 = document.getElementById('u190');
gv_vAlignTable['u190'] = 'center';
var u115 = document.getElementById('u115');
gv_vAlignTable['u115'] = 'top';
var u313 = document.getElementById('u313');

u313.style.cursor = 'pointer';
if (bIE) u313.attachEvent("onclick", Clicku313);
else u313.addEventListener("click", Clicku313, true);
function Clicku313(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/3/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u291 = document.getElementById('u291');

u291.style.cursor = 'pointer';
if (bIE) u291.attachEvent("onclick", Clicku291);
else u291.addEventListener("click", Clicku291, true);
function Clicku291(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/22/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u168 = document.getElementById('u168');

u168.style.cursor = 'pointer';
if (bIE) u168.attachEvent("onclick", Clicku168);
else u168.addEventListener("click", Clicku168, true);
function Clicku168(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/6/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u246 = document.getElementById('u246');
gv_vAlignTable['u246'] = 'center';
var u62 = document.getElementById('u62');
gv_vAlignTable['u62'] = 'top';
var u219 = document.getElementById('u219');

var u259 = document.getElementById('u259');

u259.style.cursor = 'pointer';
if (bIE) u259.attachEvent("onclick", Clicku259);
else u259.addEventListener("click", Clicku259, true);
function Clicku259(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/6/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u114 = document.getElementById('u114');

u114.style.cursor = 'pointer';
if (bIE) u114.attachEvent("onclick", Clicku114);
else u114.addEventListener("click", Clicku114, true);
function Clicku114(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/9/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u57 = document.getElementById('u57');

var u312 = document.getElementById('u312');
gv_vAlignTable['u312'] = 'top';
var u231 = document.getElementById('u231');

var u187 = document.getElementById('u187');
gv_vAlignTable['u187'] = 'top';
var u326 = document.getElementById('u326');
gv_vAlignTable['u326'] = 'top';
var u70 = document.getElementById('u70');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u70ann'), "<div id='u70Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u70Note').click(function(e) { ToggleWorkflow(e, 'u70', 300, 150, false); return false; });
var u70Ann = 
{
"label":"?",
"Description":"Click open lightbox to display image alongs with its caption and description"};

var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'top';
var u218 = document.getElementById('u218');

var u262 = document.getElementById('u262');
gv_vAlignTable['u262'] = 'top';
var u99 = document.getElementById('u99');
gv_vAlignTable['u99'] = 'top';
var u286 = document.getElementById('u286');
gv_vAlignTable['u286'] = 'top';
var u349 = document.getElementById('u349');
gv_vAlignTable['u349'] = 'center';
var u311 = document.getElementById('u311');

u311.style.cursor = 'pointer';
if (bIE) u311.attachEvent("onclick", Clicku311);
else u311.addEventListener("click", Clicku311, true);
function Clicku311(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/2/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u230 = document.getElementById('u230');

var u127 = document.getElementById('u127');
gv_vAlignTable['u127'] = 'top';
var u325 = document.getElementById('u325');

u325.style.cursor = 'pointer';
if (bIE) u325.attachEvent("onclick", Clicku325);
else u325.addEventListener("click", Clicku325, true);
function Clicku325(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/9/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u244 = document.getElementById('u244');
gv_vAlignTable['u244'] = 'center';
var u361 = document.getElementById('u361');

var u27 = document.getElementById('u27');
gv_vAlignTable['u27'] = 'center';
var u83 = document.getElementById('u83');
gv_vAlignTable['u83'] = 'center';
var u310 = document.getElementById('u310');
gv_vAlignTable['u310'] = 'top';
var u207 = document.getElementById('u207');

var u185 = document.getElementById('u185');
gv_vAlignTable['u185'] = 'top';
var u40 = document.getElementById('u40');
gv_vAlignTable['u40'] = 'top';
var u324 = document.getElementById('u324');
gv_vAlignTable['u324'] = 'top';
var u243 = document.getElementById('u243');

var u360 = document.getElementById('u360');

u360.style.cursor = 'pointer';
if (bIE) u360.attachEvent("onclick", Clicku360);
else u360.addEventListener("click", Clicku360, true);
function Clicku360(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u340','','none',500);

}

}

if (bIE) u360.attachEvent("onmouseover", MouseOveru360);
else u360.addEventListener("mouseover", MouseOveru360, true);
function MouseOveru360(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u360',e)) return;
if (true) {

SetWidgetSelected('u350');
}

}

if (bIE) u360.attachEvent("onmouseout", MouseOutu360);
else u360.addEventListener("mouseout", MouseOutu360, true);
function MouseOutu360(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u360',e)) return;
if (true) {

SetWidgetNotSelected('u350');
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

SetWidgetFormText('u236', '11/5/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u69 = document.getElementById('u69');
gv_vAlignTable['u69'] = 'top';
var u289 = document.getElementById('u289');

u289.style.cursor = 'pointer';
if (bIE) u289.attachEvent("onclick", Clicku289);
else u289.addEventListener("click", Clicku289, true);
function Clicku289(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '11/21/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u45 = document.getElementById('u45');

var u206 = document.getElementById('u206');
gv_vAlignTable['u206'] = 'center';
var u184 = document.getElementById('u184');
gv_vAlignTable['u184'] = 'top';
var u323 = document.getElementById('u323');

u323.style.cursor = 'pointer';
if (bIE) u323.attachEvent("onclick", Clicku323);
else u323.addEventListener("click", Clicku323, true);
function Clicku323(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u236', '12/8/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u242 = document.getElementById('u242');
gv_vAlignTable['u242'] = 'center';
var u96 = document.getElementById('u96');
gv_vAlignTable['u96'] = 'top';
var u344 = document.getElementById('u344');

var u337 = document.getElementById('u337');
gv_vAlignTable['u337'] = 'top';
var u256 = document.getElementById('u256');
gv_vAlignTable['u256'] = 'top';
var u53 = document.getElementById('u53');

var u129 = document.getElementById('u129');
gv_vAlignTable['u129'] = 'top';
var u174 = document.getElementById('u174');

u174.style.cursor = 'pointer';
if (bIE) u174.attachEvent("onclick", Clicku174);
else u174.addEventListener("click", Clicku174, true);
function Clicku174(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/9/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u205 = document.getElementById('u205');

var u183 = document.getElementById('u183');
gv_vAlignTable['u183'] = 'top';
var u10 = document.getElementById('u10');
gv_vAlignTable['u10'] = 'top';
var u179 = document.getElementById('u179');
gv_vAlignTable['u179'] = 'top';
var u141 = document.getElementById('u141');
gv_vAlignTable['u141'] = 'top';
var u197 = document.getElementById('u197');

var u39 = document.getElementById('u39');
gv_vAlignTable['u39'] = 'center';
var u71 = document.getElementById('u71');
gv_vAlignTable['u71'] = 'center';
var u15 = document.getElementById('u15');
gv_vAlignTable['u15'] = 'top';
var u128 = document.getElementById('u128');

u128.style.cursor = 'pointer';
if (bIE) u128.attachEvent("onclick", Clicku128);
else u128.addEventListener("click", Clicku128, true);
function Clicku128(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/16/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u288 = document.getElementById('u288');
gv_vAlignTable['u288'] = 'top';
var u204 = document.getElementById('u204');
gv_vAlignTable['u204'] = 'center';
var u182 = document.getElementById('u182');
gv_vAlignTable['u182'] = 'top';
var u66 = document.getElementById('u66');
gv_vAlignTable['u66'] = 'top';
var u178 = document.getElementById('u178');

u178.style.cursor = 'pointer';
if (bIE) u178.attachEvent("onclick", Clicku178);
else u178.addEventListener("click", Clicku178, true);
function Clicku178(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '12/11/2009');

	SetPanelVisibility('u89','hidden','none',500);

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

SetWidgetFormText('u236', '11/4/2009');

	SetPanelVisibility('u240','hidden','none',500);

}

}

var u140 = document.getElementById('u140');

u140.style.cursor = 'pointer';
if (bIE) u140.attachEvent("onclick", Clicku140);
else u140.addEventListener("click", Clicku140, true);
function Clicku140(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/22/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u196 = document.getElementById('u196');
gv_vAlignTable['u196'] = 'center';
var u245 = document.getElementById('u245');

var u335 = document.getElementById('u335');
gv_vAlignTable['u335'] = 'top';
var u23 = document.getElementById('u23');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u23ann'), "<div id='u23Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u23Note').click(function(e) { ToggleWorkflow(e, 'u23', 300, 150, false); return false; });
var u23Ann = 
{
"label":"paragraph",
"Description":"Danh sách reports của dự án sắp xếp theo tứ tự thời gian, có 1 nút để tạo report mới, khi click mở một popup cho phép nhập theo dạng RTE đơn giản hoặc attach 1 file có sẵn"};
gv_vAlignTable['u23'] = 'top';
var u154 = document.getElementById('u154');

u154.style.cursor = 'pointer';
if (bIE) u154.attachEvent("onclick", Clicku154);
else u154.addEventListener("click", Clicku154, true);
function Clicku154(e)
{
windowEvent = e;


if (true) {

SetWidgetFormText('u86', '11/29/2009');

	SetPanelVisibility('u89','hidden','none',500);

}

}

var u264 = document.getElementById('u264');
gv_vAlignTable['u264'] = 'top';
var u203 = document.getElementById('u203');

var u181 = document.getElementById('u181');
gv_vAlignTable['u181'] = 'top';
var u84 = document.getElementById('u84');

u84.style.cursor = 'pointer';
if (bIE) u84.attachEvent("onclick", Clicku84);
else u84.addEventListener("click", Clicku84, true);
function Clicku84(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u218','','none',500);

}

}

var u258 = document.getElementById('u258');
gv_vAlignTable['u258'] = 'top';
var u320 = document.getElementById('u320');
gv_vAlignTable['u320'] = 'top';
var u4 = document.getElementById('u4');

var u217 = document.getElementById('u217');

u217.style.cursor = 'pointer';
if (bIE) u217.attachEvent("onclick", Clicku217);
else u217.addEventListener("click", Clicku217, true);
function Clicku217(e)
{
windowEvent = e;


if (true) {

	SetPanelVisibility('u193','','none',500);

}

}

if (bIE) u217.attachEvent("onmouseover", MouseOveru217);
else u217.addEventListener("mouseover", MouseOveru217, true);
function MouseOveru217(e)
{
windowEvent = e;

if (!IsTrueMouseOver('u217',e)) return;
if (true) {

SetWidgetSelected('u207');
}

}

if (bIE) u217.attachEvent("onmouseout", MouseOutu217);
else u217.addEventListener("mouseout", MouseOutu217, true);
function MouseOutu217(e)
{
windowEvent = e;

if (!IsTrueMouseOut('u217',e)) return;
if (true) {

SetWidgetNotSelected('u207');
}

}

var u195 = document.getElementById('u195');

var u225 = document.getElementById('u225');
gv_vAlignTable['u225'] = 'top';
var u41 = document.getElementById('u41');

var u334 = document.getElementById('u334');
gv_vAlignTable['u334'] = 'top';
var u153 = document.getElementById('u153');
gv_vAlignTable['u153'] = 'top';
if (window.OnLoad) OnLoad();
