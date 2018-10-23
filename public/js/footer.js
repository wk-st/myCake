$(function(){
    $.ajax({
        type:"get",
        url:"footer.html",
        success:function(res){
            $(res).replaceAll("#globalFooter");
            var $wxLink=$(".footer-container .footer-onlineBtn").last();
            var $wxImg=$wxLink.children().last();
            $wxLink.hover(
                function(){
                    $wxImg.toggle();
                }
            )
        }
    })
})