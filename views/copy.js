<div class="hero-unit">
    <h1>Welcome to Myblog</h1>
    <p>Myblog is based on Node.js</p>
    <p>
        <form>
        <table class="bsgrid" id='searchTable'>
        <tr>
            <th w_check="true" w_index="machine_id"></th>
            <th w_index="machine_id">ID</th>
             <th w_index="machine_ip">机器名</th>
             <th w_index="machine_port">机器端口号</th>
            <th>保留</th>
          </tr>
        </table>
        </form>
        <input  class="btn btn-danger btn-lg" type="button" id="submit" value="submit" />
        <a class="btn btn-primary btn-large" href="/login">login</a>
        <a class="btn btn-large" href="/reg">join now</a>
    </p>
</div>
<div class="row">
    <div class="span4">
        <h2>from hefy</h2>
        <p>Today is nice day</p>
    </div>
</div>
<script type="text/javascript">
//$(document).ready(function() {       
//    $('#submit').click(function(){
//        var ids=[];
//        
//        $("input[type=='checkbox']").each(function(){
//			 console.log($(this).prop("checked"));
//   			 if (true == $(this).prop("checked") {
//    			ids.push($(this).prop("id"));
//    			//alert($(this).prop("id"));
//   			 }
//		});
//        //var data="{'data':["+ids+"]}";
//        $.ajax({
//              	type:"post",
//              	url:"/post",
//              	data:{'data': JSON.stringify(ids)}
//              	}).done(function(resdata){
//              		alert(success);
//              	});
//		});
//
//});
</script>
<script type='text/javascript'>
var gridObj;
$(function(){
    gridObj = $.fn.bsgrid.init('searchTable',{
        url: '/query',
        dataType: 'json'
    });
});
</script>
