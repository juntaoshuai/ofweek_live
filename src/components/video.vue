<template>
    <nav class="myvedio" v-bind:style="{backgroundImage:'url('+reviewUrl+')'}">
        <div class="play-view" v-if="model==0 || model==2 || model==3" v-show="!isPlaying" v-on:click="clickPlay()">
            <img class="play-icon" src="../assets/play.png">
        </div>
        <!-- 视频直播 -->
        <div class="vedio" v-if="model==0">
            <video v-if="hlsdownstream" id="hlsVideo" v-bind:src=hlsdownstream v-bind:poster="hlsimg" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline
 controls autoplay></video>
            <div v-if="!hlsdownstream" class="wait">
                当前为图文直播
            </div>
        </div>

        <!-- 直播预告 -->
        <div class="notice" v-if="model==1">
            <h4>开播倒计时</h4>
            <ul class="clearfix">
                <li class="d">
                    <span>{{day}}</span>
                    天:
                </li>
                <li class="h">
                    <span>{{hour}}</span>
                    时:
                </li>
                <li class="m">
                    <span>{{minute}}</span>
                    分:
                </li>
                <li class="s">
                    <span>{{second}}</span>
                    秒
                </li>
            </ul>
            <a v-if="registered" class="start-notice bgGray" href="javascript:;">已预约</a>
            <span v-else class="start-notice no_btn" @click="book">预约直播</span>
            <p class="pay-tips" v-if="!user.payStatus && room.isPay">该直播须付费才能观看，付费请点击<a href="#">立即购买</a></p>
        </div>

        <!-- 直播结束 -->
        <div class="living_end" v-if="model==6 && !isPlaying">
            <h2 v-if="isVideo==2" class="look_notice">直播已结束，感谢收看。<br>敬请期待直播回顾</h2>
            <p v-if="isVideo==1" @click="clickPlay()">
            	<span></span>
            </p>
        </div>
        <!-- 时间到了直播未开始 -->
        <div class="wait" v-if="model==7 || model==3">
            直播即将开始，请耐心等待
        </div>

        <!-- ppt直播 -->
        <div class="ppt_living" v-if="model==5">
			<!--<p>如果您听不到直播声音，建议用电脑观看PPT直播。</p>-->
           <audio id="media_audio" webkit-playsinline="" controls  autoplay playsinline="" v-bind:src=hlsdownstream>
                (#_#) 你的设备不支持播放视频直播... 
            </audio>
            <img v-bind:src="pptimg" alt="">
        </div>
        
        <!-- 视频直播 -->
        <div class="vodlook" v-if="model==8">
            <video v-bind:src="vodliving" v-bind:poster="reviewUrl" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline controls id="vodliving"></video>
        </div>

        <!-- 查看回顾 -->
        <div class="vodlook" v-if="model==6">
            <video v-bind:src="vodvideo" v-bind:poster="reviewUrl" v-show="isPlaying" v-on:playing="playing" webkit-playsinline playsinline controls id="myAudio" onended="myFunction()"></video>
        </div>
    </nav>
</template>

<script>
import { getString } from "../js/common";
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
    }
  },
  data() {
    return {
      isPlaying: false,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
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
        this.$parent.loginShow = true;
        return;
      }
      let url = getString("0105");
      webSocket.send(url);
    },
    clickPlay: function() {
      document.querySelectorAll("video")[0].play();
    },
    playing: function() {
      this.isPlaying = true;
    }
  },
  watch: {
    room(newVal, oldVal) {
      //倒计时

        //倒计时结束
        setInterval(() => {
             let now = new Date().getTime();
       let tol = (new Date(newVal.startTime) - now) / 1000;
        tol = parseInt(tol);

        // if (this.model != 1)
        //   //如果不在直播预告状态
          
        //   return;

        // if (tol <= 0) {
        //   $this.$parent.ismodel = 7;
        //   return;
        // }

        this.day = Math.floor(tol / (60 * 60 * 24));
        this.hour = Math.floor((tol - this.day * 24 * 60 * 60) / 3600);
        this.minute = Math.floor((tol - this.day * 24 * 60 * 60 - this.hour * 3600) / 60);
        this.second = Math.floor(tol - this.day * 24 * 60 * 60 - this.hour * 3600 - this.minute * 60);
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

#media_audio {
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

.living_end,
.wait {
  text-align: center;
  font-size: 0.32rem;
  height: 100%;
}
.wait {
  line-height: 4.05rem;
  color: #ffffff;
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
  height: 100%;
  text-align: center;
}
.notice h4 {
  color: #fff;
  font-size: 0.28rem;
  font-weight: normal;
  padding: 0.6rem 0 0.3rem 0;
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

/* .notice ul li span{display: block;width: .6rem;height: .77rem;background: url(../assets/timebg.png);background-size: 100% 100%;font-size: .6rem;line-height: .77rem;} */
.notice ul li p {
  color: #fff;
  font-size: 0.24rem;
  margin-top: 0.8rem;
}
.start-notice {
  display: block;
  width: 2.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  font-size: 0.3rem;
  background: #c60000;
  color: #fff;
  margin-top: 0.4rem;
  border-radius: 0.04rem;
  margin: 0.4rem auto 0 auto;
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
}
.pay-tips a {
  color: #5aabff;
}
</style>
