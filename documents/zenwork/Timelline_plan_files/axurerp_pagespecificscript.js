
var PageName = 'Timelline plan';
var PageId = '8025507bbcdf4430a004e636927bc626'
var PageUrl = 'Timelline_plan.html'
document.title = 'Timelline plan';
var PageNotes = 
{
"pageName":"Timelline plan",
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

var u31 = document.getElementById('u31');
gv_vAlignTable['u31'] = 'center';
var u16 = document.getElementById('u16');

var u17 = document.getElementById('u17');
gv_vAlignTable['u17'] = 'center';
var u28 = document.getElementById('u28');

var u29 = document.getElementById('u29');
gv_vAlignTable['u29'] = 'center';
var u8 = document.getElementById('u8');

var u30 = document.getElementById('u30');

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

var u15 = document.getElementById('u15');
gv_vAlignTable['u15'] = 'top';
var u13 = document.getElementById('u13');
gv_vAlignTable['u13'] = 'center';
var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'top';
var u4 = document.getElementById('u4');

var u1 = document.getElementById('u1');
gv_vAlignTable['u1'] = 'center';
var u26 = document.getElementById('u26');

var u10 = document.getElementById('u10');
gv_vAlignTable['u10'] = 'top';
var u11 = document.getElementById('u11');

var u3 = document.getElementById('u3');
gv_vAlignTable['u3'] = 'center';
var u12 = document.getElementById('u12');

var u9 = document.getElementById('u9');
gv_vAlignTable['u9'] = 'center';
var u27 = document.getElementById('u27');
gv_vAlignTable['u27'] = 'center';
var u7 = document.getElementById('u7');
gv_vAlignTable['u7'] = 'center';
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
var u19 = document.getElementById('u19');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u19ann'), "<div id='u19Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u19Note').click(function(e) { ToggleWorkflow(e, 'u19', 300, 150, false); return false; });
var u19Ann = 
{
"label":"paragraph",
"Description":"Show gantt chart"};
gv_vAlignTable['u19'] = 'top';
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
var u5 = document.getElementById('u5');
gv_vAlignTable['u5'] = 'center';
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

	self.location.href="Issue_tracking.html" + GetQuerystring();

}

}
gv_vAlignTable['u22'] = 'top';
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

if (window.OnLoad) OnLoad();
