<template>
    <nav class="myvedio" v-bind:style="{backgroundImage:'url('+reviewUrl+')'}">
        <div class="play-view" v-if="(model==0 || model==2 || model==3) && (user.payStatus || !room.isPay)" v-show="!isPlaying" v-on:click="clickPlay()">
            <img class="play-icon" src="../assets/play.png">
        </div>
        <div id="loading" v-show="loadingShow">
            <div class="content1">
                <div class="arc1"></div>
                <div class="arc2"></div>
                <div class="arc3"></div>
                <div class="arc4"></div>
            </div>
            <div class="content2">
                <div class="arc1"></div>
                <div class="arc2"></div>
                <div class="arc3"></div>
                <div class="arc4"></div>
            </div>
        </div>
        <!-- 视频直播 -->
        <div class="vedio" v-if="model==0 && (user.payStatus || !room.isPay)">
            <video v-if="hlsdownstream" id="hlsVideo" v-bind:src=hlsdownstream v-bind:poster="hlsimg" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline
 controls autoplay></video>
            <div v-if="!hlsdownstream" class="wait">
                当前为图文直播
            </div>
        </div>

        <!-- 直播预告 -->
        <div class="notice" v-if="model==1">
            <h4>直播倒计时</h4>
            <ul class="clearfix">
                <li class="d">
                    <span>{{day}}</span>天:
                </li>
                <li class="h">
                    <span>{{hour}}</span>时:
                </li>
                <li class="m">
                    <span>{{minute}}</span>分:
                </li>
                <li class="s">
                    <span>{{second}}</span>秒
                </li>
            </ul>
            <p class="fare" v-if="!user.payStatus && room.isPay">票价：¥ {{room.fare}}</p>
            <a v-if="registered" class="start-notice bgGray" href="javascript:;">已预约</a>
            <span v-else class="start-notice no_btn" @click="book">预约直播</span>          
        </div>

       <!-- 时间到了直播未开始 -->
        <div v-bind:class="[{ active: (user.payStatus || !room.isPay) }, waitClass]" v-if="model==7 || model==3">
            直播即将开始，请耐心等待
        </div>
        
        <!--直播结束 还没有回顾视频-->
        <div class="wait active" v-if="model == 6 && isVideo == 2 && (user.payStatus || !room.isPay)">
          直播已结束，敬请期待直播回顾！
        </div>

        <!-- 直播结束 -->
        <div class="living_end" v-if="(model == 6 && !isPlaying && isVideo == 1) && (user.payStatus || !room.isPay)">  
            <p @click="clickPlay()" v-show="!isPlaying">
            	<span></span>
            </p>
        </div>

      <!--直播预告-->
      <div v-if="room.status == 0 && !user.payStatus && room.isPay">
        
        <p class="pay-tips" style="margin-top:.2rem;">该直播须付费才能观看，付费请点击<a href="javascript:;" :payUrl="payUrl" @click="buy">立即购买</a></p>
      </div>

        <!--直播中和直播回顾-->
        <div class="liv-pay" v-if="(room.status == 2 || room.status == 4)">
          <div v-if="!user.payStatus && room.isPay">
            <p class="pay-tips">
                本场直播为付费直播，请购买后观看。<br>（已购买用户直接登录观看）
            </p>
            <p class="fare">票价：¥ {{room.fare}}</p> 
            <p class="pay-opera">
              <a href="javascript:;" @click="login()" class="start-notice btn1" v-if="isLogin == 2">登录</a>
              <a href="javascript:;" class="start-notice btn2" @click="buy">立即购买</a>
            </p>
          </div>
        </div>

        <!-- ppt直播 -->
        <div class="ppt_living" v-if="model == 5 && (user.payStatus || !room.isPay)">
			<!--<p>如果您听不到直播声音，建议用电脑观看PPT直播。</p>-->
            <audio v-if="hlsVoiceDownstream" id="voice" v-bind:src="hlsVoiceDownstream" controls autoplay>
               (#_#) 你的设备不支持播放视频直播... 
            </audio>
            
            <audio v-else id="media_audio" webkit-playsinline playsinline controls  autoplay v-bind:src=hlsdownstream>
                (#_#) 你的设备不支持播放视频直播... 
            </audio>

            <img v-bind:src="pptimg" alt="">
        </div>
        
        <!-- 视频直播 -->
        <div class="vodlook" v-if="model == 8 && (user.payStatus || !room.isPay)">
            <video v-bind:src="vodliving" v-bind:poster="reviewUrl" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline controls id="vodliving"></video>
        </div>

        <!-- 查看回顾 -->
        <div class="vodlook" v-if="model==6 && (user.payStatus || !room.isPay)">
            <video v-bind:src="vodvideo" v-bind:poster="reviewUrl" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline controls id="myAudio" onended="myFunction()"></video>
        </div>
    </nav>
</template>

<script>
import { getString, showLogin } from "../js/common";
export default {
  props: {
    room: {
      type: Object
    },
    user: {
      type: Object
    },
    model: {
      type: Number
    },
    hlsdownstream: {
      type: String
    },
    pptimg: {
      type: String
    },
    vodvideo: {
      type: String
    },
    registered: {
      type: Boolean
    },
    hlsimg: {
      type: String
    },
    isVideo: {
      type: Number
    },
    vodliving: {
      type: String
    },
    reviewUrl: {
      type: String
    },
    hlsVoiceDownstream: {
			type: String
		}
  },
  data() {
    return {
      isLogin: userLogin.loginType,
      isPlaying: false,
      loadingShow: false,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      payUrl:
        "http://live.ofweek.com/order/pay?userId=" +
        userLogin.userId +
        "&roomId=" +
        userLogin.roomId +
        "&source=WAP&backUrl=" +
        location.href,
        waitClass: 'wait'
    };
  },
  methods: {
    //查看回顾
    lookvod: function() {
      // this.$parent.ismodel = 6;
    },
    //预定
    book: function() {
      if (userLogin.loginType == 2) {
        showLogin();
        return;
      }
      let url = getString("0105");
      webSocket.send(url);
    },
    clickPlay: function() {
      document.querySelectorAll("video")[0].play();
      this.isPlaying = true;      
      this.loadingShow = true;
    },
    playing: function() {
      this.isPlaying = true;
      this.loadingShow = false;
      
    },

    buy() {
      if(is_weixn()) {
        alert("come")

      }else{
        if (userLogin.loginType == 2) {
            showLogin();
            return;
        }
        location.href = this.payUrl;
      }
     
    },
    login() {
      showLogin();
    }
  },
  watch: {
    room(newVal, oldVal) {
      //倒计时

      //倒计时结束
      setInterval(() => {
        let now = new Date();
        let startTime = newVal.startTime;
        //手机浏览器中直接 new Date('2017-12-13 11:11:00') 会报NaN错误，要把-替换成/
        startTime = startTime.replace(/\-/g, "/");
        startTime = new Date(startTime);
        let tol = (startTime - now) / 1000;

        tol = parseInt(tol);

        if (this.model != 1)
          //如果不在直播预告状态
          return;

        if (tol <= 0) {
          this.$parent.ismodel = 7;
          return;
        }

        this.day = Math.floor(tol / (60 * 60 * 24));
        this.hour = Math.floor((tol - this.day * 24 * 60 * 60) / 3600);
        this.minute = Math.floor(
          (tol - this.day * 24 * 60 * 60 - this.hour * 3600) / 60
        );
        this.second = Math.floor(
          tol - this.day * 24 * 60 * 60 - this.hour * 3600 - this.minute * 60
        );
      }, 1000);
    }
  }
};
</script>
<style>
.fl {
  float: left;
}
.fr {
  float: right;
}

#media_audio,#voice {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.myvedio {
  position: absolute;
  width: 100%;
  height: 4.05rem;
  top: 0.96rem;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  text-shadow: #000 0 1px 0;
}
video,
.video {
  width: 100%;
  height: 4.05rem;
  background: #000;
}

/*ppt*/
.ppt_living {
  height: 100%;
  line-height: 4.05rem;
  text-align: center;
  position: relative;
  background: #000;
}
.ppt_living p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.6rem;
  line-height: 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  padding-left: 0.3rem;
  color: #ffff00;
  text-align: left;
}
.ppt_living img {
  max-height: 100%;
  max-width: 100%;
}

.living_end {
  text-align: center;
  font-size: 0.32rem;
  height: 100%;
}
.wait {
  text-align: center;
  font-size: 0.32rem;
  color: #fff;
  margin-top: 0.44rem;
}
.living_end {
  position: relative;
}
.living_end img {
  width: 100%;
  height: 100%;
}
.notice .bgGray {
  background: rgba(0, 0, 0, 0.2);
}
.living_end p {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
}
.living_end p span {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background: url(../assets/look.png) no-repeat center center;
  background-size: 1.5rem auto;
}
.living_end h2 {
  color: #ffffff;
  font-size: 0.36rem;
  font-weight: normal;
  line-height: 0.6rem;
  padding-top: 1rem;
  position: absolute;
  z-index: 2;
  width: 100%;
  padding: 0 0.3rem;
  left: 0;
  top: 1rem;
}

.notice {
  text-align: center;
}

.notice h4 {
  color: #fff;
  font-size: 0.28rem;
  line-height: 0.82rem;
  font-weight: normal;
  padding: 0.2rem 0 0.3rem 3.3rem;
  background: url(../assets/countdown.png) 2.5rem 0.2rem no-repeat;
  background-size: 0.62rem 0.82rem;
  text-align: left;
}
.notice ul {
  text-align: center;
  font-size: 0;
}
.notice ul li {
  font-size: 0.48rem;
  line-height: 0.56rem;
  display: inline-block;
  padding: 0 0.15rem;
  color: #fff;
}

.notice ul li p {
  color: #fff;
  font-size: 0.24rem;
  margin-top: 0.8rem;
}

.start-notice {
  display: block;
  width: 2.16rem;
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  font-size: 0.28rem;
  background: #c60000;
  color: #fff;
  border-radius: 0.08rem;
  margin: 0.44rem auto 0;
}
.clearfix:after {
  clear: both;
  content: "";
  height: 0;
  display: block;
}
.play-view {
  position: relative;
  width: 100%;
  height: 100%;
}
.play-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  margin: -25px 0 0 -25px;
}
.pay-tips {
  line-height: 0.4rem;
  font-size: 0.28rem;
  color: #fff;
  margin-top: 0.44rem;
  text-align: center;
}
.pay-tips a {
  color: #5aabff;
  margin-left: 0.3rem;
}
.pay-opera {
  font-size: 0;
  text-align: center;
}
.liv-pay a {
  display: inline-block;
  margin: 0.44rem 0.32rem 0;
}
.liv-pay .btn1 {
  background: #e0e0e0;
}
.wait.active {
   line-height: 4.05rem;
   margin-top: 0;
}

.fare {
  font-size: .28rem;
  line-height: .32rem;
  color:#fff;
  text-align: center;
  margin-top:.2rem;
}
.fare + .start-notice {
  margin-top:.1rem;
}

#loading{width:25px;height: 25px; position: absolute;left:50%;top:40%;margin:0 0 0 -12px;}
#loading .content1 , #loading .content2{ width:25px; height:25px; position:absolute;}
#loading .content1 div , #loading .content2 div{ width:8px; height:8px; background:#fff; position:absolute; border-radius:50%; animation:2s linear infinite loadingMove; -webkit-animation:2s linear infinite loadingMove;}
#loading .content1 .arc1 , #loading .content2 .arc1{ left:0; top:0;}
#loading .content1 .arc2 , #loading .content2 .arc2{ right:0; top:0;}
#loading .content1 .arc3 , #loading .content2 .arc3{ right:0; bottom:0;}
#loading .content1 .arc4 , #loading .content2 .arc4{ left:0; bottom:0;}
#loading .content2{ transform:rotate(45deg); -webkit-transform:rotate(45deg);}
@keyframes loadingMove{
    0%{ transform:scale(1);}
    50%{ transform:scale(0);}
    100%{ transform:scale(1);}
}
@-webkit-keyframes loadingMove{
    0%{ -webkit-transform:scale(1);}
    50%{ -webkit-transform:scale(0);}
    100%{ -webkit-transform:scale(1);}
}

#loading .content1 .arc1{ animation-delay:-1.5s;}
#loading .content2 .arc1{ animation-delay:-1.3s;}
#loading .content1 .arc2{ animation-delay:-1.1s;}
#loading .content2 .arc2{ animation-delay:-0.9s;}
#loading .content1 .arc3{ animation-delay:-0.7s;}
#loading .content2 .arc3{ animation-delay:-0.5s;}
#loading .content1 .arc4{ animation-delay:-0.3s;}
#loading .content2 .arc4{ animation-delay:-0.1s;}



</style>
