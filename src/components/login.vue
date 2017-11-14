<!-- <template>
    <div class="pop" v-show="loginShow">
        <div class="content">
            <span @click="close">&times;</span>
            <div class="notice"></div>
            <p>提示</p>
            <div>您还没有登录，无法进行操作</div>
            <div>
                <a :href="loginUrl">登录</a>
                <a :href="registerUrl">注册</a>
            </div>
        </div>
    </div>
</template>
 -->
 <template>
    <div>
        <!--未登录弹窗-->
        <div class="pop" id="pop" v-show="loginShow"></div>
        <div class="login_warm diaglog" id="diaglog" v-show="loginShow">

            <span class="closeBtn" @click="hide" id="close">×</span>

            <form id="loginForm" method="post">
                <h3>观众登录</h3>
                <div class="input-item">
                    <input type="text" name="username" id="username" placeholder="用户名／邮箱／手机">
                </div>
                <div class="input-item">
                    <input type="password" name="password" id="password" placeholder="密码">
                    <a href="http://m.ofweek.com/users/forgetPassword.xhtml" class="fr">忘记密码？</a>
                </div>
                <input type="button" value="登录" class="login-btn" id="alogin-btn" @click="onSubmit()">
            </form>
            <!--手机号登录-->
            <form id="mobileloginForm" method="post">
                <h3 class="login-title">观众登录</h3>
                <div class="input-item">
                    <input type="text" name="mobile" id="mobile" placeholder="中国大陆手机号">
                </div>
                <div class="input-item">
                    <input type="text" name="code" id="code" placeholder="动态密码" disabled="disabled">
                    <a href="javascript:;" class="fr" id="getCode">获取动态密码</a>
                </div>
                <input type="button" value="登录" class="login-btn" id="mlogin-btn">
            </form>
            <p class="switch">			
				<input type="button" value="手机快捷登录" class="switch-btn">
			</p>		
			<!-- <div class="other-login">
		  		<a href="javascript:;" onclick="window.location.href='http://expo.ofweek.com/thirdPartyLogin.xhtml?method=qqLogin&callback='+location.href" class="qq"></a>
		  		<a href="javascript:;" onclick="window.location.href='http://expo.ofweek.com/thirdPartyLogin.xhtml?method=weiboLogin&callback='+location.href" class="sina"></a>
			</div> -->
			<p class="reg">还不是OFweek会员，<a href="javascript:;" onclick="location.href = 'http://m.ofweek.com/users/register.xhtml?regType=16&returnurl= ' + location.href">免费注册</a>
			</p>

			<div id="login-code" class="input-item"><input type="text" name="captcha" id="verifyCode" placeholder="验证码"> <img width="80" height="32" src="/servlet/validateCodeServlet?width=80&amp;amp;height=32&amp;amp;t=0.06074978317998436" onclick="this.src='/servlet/validateCodeServlet?width=80&amp;height=32&amp;t=' + Math.random()" class="code"></div>

        </div>
    </div>
</template>
<script>
    import { MessageBox } from 'mint-ui';
    import {showVideos,closeLogin} from '../js/common.js'


    export default {
		data (){
			return {
				loginUrl:'http://live.ofweek.com/wap/login?callback='+location.href,
				registerUrl:'http://m.ofweek.com/users/register.xhtml',
                isSubmit:true
			}	
		},
		props:{
			loginShow:{
				type:Boolean
			},
            watchMode:{
                type:Number
            }	
		},
		methods:{
            showMessage(msg){
                MessageBox.alert(msg,'',{
                    closeOnClickModal:false
                });
            },
			close:function(){
				closeLogin();
			},
            onSubmit(){
                let $loginForm=$("#loginForm"),
                    $loginBtn=$(".login-btn"),
                    account=$.trim($("#username").val()),
                    password=$.trim($("#password").val()),
                    verifyCode=$.trim($("#verifyCode").val());

                if(account==""){
                    this.showMessage('请输入用户名/邮箱/手机');
                   
                    return
                }
                if(password==""){
                    this.showMessage('请输入密码');
                    return
                }
                if($loginForm.find("#login-code").length && verifyCode==""){
                    this.showMessage('请输入验证码');
                    return;

                }
                
                let $this=this;

                if($this.isSubmit){
                    $this.isSubmit=false;
                    $loginBtn.val('正在登录中...');                
                    
                    var formContent = $loginForm.serialize();

                    $.ajax({
                        url: 'http://live.ofweek.com/api/audience/audienceLogin',
                        type: 'POST',
                        dataType: 'json',
                        data: formContent,
                        success: function (data) {
                            if (data.data.result){
                                //有些安卓机微信不支持location.reload()
                                location.href = location.href;
                                
                            } else {

                                $this.showMessage(data.data.msg);
                                $this.isSubmit=true;
                                $loginBtn.val('登录');
                                $(".code").attr("src",'/servlet/validateCodeServlet?width=80&amp;height=32&amp;t=' + Math.random())

                                if (data.data.isValidateCodeLogin) {
                                    $("#diaglog").addClass("codeAfterDiaglog");
                                    $("#login-code").insertBefore('#alogin-btn').show();
                                }

                            }
                        },
                        error: function () {
                            $this.isSubmit=true;
                            $loginBtn.val('登录'); 
                            $(".code").attr("src",'/servlet/validateCodeServlet?width=80&amp;height=32&amp;t=' + Math.random())               
                        }
                    });

                }

            },
            hide:function(){
                //会员模式
                if(this.watchMode == 1){
                    MessageBox.confirm('你确定要退出吗？建议登录后观看','',{
                        confirmButtonText:'确定退出',
                        cancelButtonText:'返回',
                        cancelButtonClass:'cancel-login',       
                        closeOnClickModal:false
                    })
                    .then(action => {
                        showVideos();
                        window.location.href="http://live.ofweek.com";
                    });

                }else{
                    this.close();
                }

                    
            }
		},
        mounted(){
                var $loginForm = $("#loginForm"),
                    $mloginFrom = $("#mobileloginForm"),
                    $aloginBtn = $("#alogin-btn"),
                    $mloginBtn = $("#mlogin-btn"),
                    $mobile = $("#mobile"),
                    $code = $("#code"),
                    $getCode= $("#getCode"),
                    mobileReg = /^1[3-9]\d{9}$/,
                    mobilePass = true,
                    isSubmit = true,
                    isMSubmit = true,
                    $this=this;

            $(".switch-btn").click(function(){
                var $this=$(this);
                if($this.val()=="手机快捷登录"){
                    $this.val("账号登录");

                }else{
                    $this.val("手机快捷登录");
                }
                $loginForm.toggle();
                $mloginFrom.toggle();

            });

                //手机快捷登录
    function mobileCheck() {
        if (!mobileReg.test($mobile.val())) {
            mobilePass = false
            $this.showMessage('请输入正确的手机号');
            return false;
        } else {
            $.ajax({
                url: 'http://live.ofweek.com/api/aud/login/checkMobileMailExsit',
                data: { mobile: $mobile.val() },
                dataType: 'json',
                async: false,
                success: function(data) {
                    if (data.status == 0) {
                        $this.showMessage("手机号未注册，请先注册")
                        mobilePass = false
                        return;
                    }
                    mobilePass = true
                }
            })
        }

    }

    //用户输入完手机号直接点击获取动态密码
    $mobile.keyup(function() {
        if($.trim($mobile.val()).length==11){
            mobileCheck();
        }else{
            $code.prop("disabled","disabled");
            $getCode.removeClass("active");
            mobilePass=false;
        }
        if(mobilePass){
            $code.prop("disabled",false);
            $getCode.addClass("active");
        }
        else{
            $code.prop("disabled","disabled");
            $getCode.removeClass("active");
        }
    })


    $mloginBtn.click(function() {
        mobileCheck();
        if (!mobilePass) {
            return;
        }

        if ($code.val() == "") {
            $this.showMessage('请输入动态密码');
            return
        }
        var codeReg = /^\d+$/
        if (!codeReg.test($code.val())) {
            $this.showMessage('动态密码不正确');
            return
        }
       
        var formContent = $mloginFrom.serialize();

        if (isMSubmit) {
            isMSubmit = false;
            //手机登录提交
            $mloginBtn.val("正在登录中...");
            $.ajax({
                url: 'http://live.ofweek.com/api/aud/login/quickLogin',
                type: 'POST',
                dataType: 'json',
                data: formContent,
                success: function(data) {
                    if (data.status == 0) {
                        //登录成功
                        location.reload();
                        location.href = location.href;
                    } else {
                        if(data.status == 7){
                            $this.showMessage("验证码已过期，请重新获取验证码");
                        }else{
                            $this.showMessage(data.msg);
                        }

                        isMSubmit = true;
                        $mloginBtn.val('登录');

                    }
                },
                error: function() {
                    isMSubmit = true;
                    $mloginBtn.val('登录');
                }
            });
        }

    });

    //验证码
    //验证码倒计时
    var bClick = true;
    function sendCode(btn) {
        $(btn).on('click', function() {
            var iCount = 60,
                _this = $(this),
                timer = null;
           
            if (_this.hasClass("active") && bClick) {
                bClick = false;
                _this.html("验证码发送中...");

                $.ajax({
                    dataType: "json",
                    url: 'http://live.ofweek.com/api/aud/login/sendSMSValicode',
                    data: { mobile: $mobile.val() },
                    success: function(rs) {
                        //status:0表示发送验证码成功；1表示发送验证码失败；3表示发送到达上限；   6表示验证码已发送，60s不能再发
                        if (rs.status == "6") {
                            $this.showMessage("验证码已发送，请注意查收");
                            _this.html(iCount + "秒后重新发送");
                            timer = setInterval(function() {
                                iCount--;
                                if (iCount == 0) {
                                    _this.html("重新发送");
                                    clearInterval(timer);
                                    bClick = true;
                                } else {
                                    _this.html(iCount + "秒后重新发送");
                                }

                            }, 1000);
                        } else {
                            _this.html("获取动态密码");
                            $this.showMessage(rs.msg)
                            bClick = true;

                        }

                    }
                });

            }
        });

    }

    //获取动态密码
    sendCode("#getCode");
            
        }

    }
</script>

<style>
/* #diaglog,#pop{display:none}  */
.pop{width: 100%;height: 100%;position: absolute;z-index: 8000;background: rgba(0,0,0,.67);top: 0;left: 0;}
.login_warm{/*height: 6.5rem;*/width: 100%;position: absolute;z-index: 8001;bottom: 0;left: 0;background: #fff;padding-top: .35rem;}

.login_warm span.closeBtn{font-size: .42rem;font-weight: bold; color:#b4b4b4;position: absolute;right: .1rem;top: .1rem;background-size: 100% 100%;text-align: center;}
#diaglog form{padding:0 .32rem;}
#diaglog form + form{display: none;}
.reg + .input-item{display: none;}
#diaglog form h3{text-align: center;font-size: .36rem;line-height: .42rem; color:#333;font-weight: normal;}
#diaglog .input-item{border-bottom: 1px solid #EFEFEF;height: .8rem;line-height: .8rem;margin-top: .34rem;padding:0 .1rem;position: relative;}
#diaglog .input-item input{border:none;width:100%;font-size: .32rem;background: #fff;}
#diaglog a{font-size: .28rem;color: #0084FF;}
.input-item:nth-of-type(2){padding-right: 1.5rem !important;}
.input-item:nth-of-type(3){padding-right: 90px !important;}
.input-item a,.code{position: absolute;right:0;top:0;}
#diaglog input[name='code']+a{color:#b4b4b4;}
#diaglog input[name='code']+a.active{color:#0084FF;}

#diaglog .login-btn{height: .8rem;background: #c00;line-height: .8rem;font-size: .32rem;color:#fff;width:100%;border:none;border-radius: .08rem;margin-top: .48rem;}
.reg{font-size: .28rem;line-height: .4rem; color: #B4B4B4;margin-top: .2rem;margin-bottom: .2rem;text-align: center;}
.other-login{font-size: 0;text-align: center;margin-top: .3rem;}
.other-login a{display: inline-block;width:.76rem;height: .76rem;background:url(../assets/QQ.png) 0 0 no-repeat;background-size: contain;}
.other-login .qq{margin-right: .78rem;}
.other-login .sina{background-image:url(../assets/sina.png);}

.switch{margin:.32rem .32rem 0;}
.switch-btn{width:100%;height: .8rem;line-height: .8rem; border: 1px solid #DEDEDE;border-radius: .08rem;background: #fff;font-size: .32rem;color:#333;}

.codeAfterDiaglog .input-item{margin-top: .14rem !important;}
.codeAfterDiaglog .login-btn{margin-top: .4rem !important;}
.codeAfterDiaglog .other-login{margin-top: .25rem !important;}
.codeAfterDiaglog .reg{margin-top: .15rem;}

.v-modal{z-index: 9000 !important;}
.mint-msgbox-wrapper{z-index: 9001 !important;}
.mint-msgbox{font-size: 14px;border-radius: .24rem;}
.mint-msgbox-message{font-size: .32rem;}
.cancel-login{color:#26a2ff;}
.mint-msgbox-btn{font-size: .34rem;}

</style>