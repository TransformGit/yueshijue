<template>
  <section class="order-page">
      <slef-header :title="'完善订单信息'"></slef-header>
      <div class="panel">
          <div class="panel-header">
              <h3 class="panel-title">线路信息</h3>
          </div>
          <div class="panel-body">
              <ul class="panel-content-list order-info">
                  <li class="panel-content-item">
                      <label class="item-label required">线路信息</label>
                      <p class="item-text">{{wareName}}</p>
                  </li>
                   <li class="panel-content-item">
                      <label class="item-label required">出行日期</label>
                      <p class="item-text">{{wareOrderInfo.skuDate}}</p>
                  </li>
                  <li class="panel-content-item">
                      <label class="item-label required">总 价</label>
                      <p class="item-text">￥{{wareOrderInfo.totalAmount || 0}}</p>
                  </li>
                  <li class="panel-content-item">
                      <label class="item-label required">基 础</label>
                      <p class="item-text"><i>￥</i>{{wareOrderInfo.adultPrice + ' * ' + wareOrderInfo.adultNum}}</p>
                  </li>
                  <li class="panel-content-item">
                      <label  class="item-label" style="padding-left: 10px">其 他</label>
                      <p class="item-text"><i>￥</i>{{wareOrderInfo.servicePrice || 0}}</p>
                  </li>
              </ul>
          </div>
      </div>
      <div class="panel">
          <div class="panel-header">
              <h3 class="panel-title">
                  联系人信息
              </h3>
          </div>
          <div class="panel-body">
              <form action="" class="contact-form">
                  <div class="form-item">
                      <label class="form-item-label required">姓 名</label>
                      <input type="text" v-model="contactForm.contactName" class="form-item-input" placeholder="输入联系人姓名">
                  </div>
                  <div class="form-item">
                    <label class="form-item-label required">性 别</label>
                    <div class="form-item-radio">
                        <label class="radio" @click="handleRadio(1)">
                            <span class="radio-core" :class="{checked: contactForm.sex === 1}"></span>
                            <span class="">男</span>
                        </label>
                        <label class="radio" @click="handleRadio(0)">
                            <span class="radio-core" :class="{checked: contactForm.sex === 0}"></span>
                            <span class="">女</span>
                        </label>
                    </div>
                  </div>
                  <div class="form-item">
                    <label class="form-item-label required">手机号码</label>
                    <input type="text" v-model="contactForm.contactMobile" class="form-item-input" placeholder="输入手机号码">
                  </div>
                  <div class="form-item">
                    <label class="form-item-label required">邮 箱</label>
                    <input type="text" v-model="contactForm.contactEmail" class="form-item-input" placeholder="输入邮箱号">
                  </div>
              </form>
          </div>
      </div>
      <div class="fixed-footer">
          <button class="submit-button" @click="submitOrder">提交订单</button>
      </div>
  </section>
</template>
<script>
    import slefHeader from '../myCenter/selfHeader'
    import { createOrder } from '@/api'
export default {
    components: {
            slefHeader
    },
    data() {
        return {
            wareName: '',
            wareOrderInfo: {},
            contactForm: {
                contactName: '',
                contactMobile: '',
                contactEmail: '',
                sex: 1,
            },
        }
    },
    methods: {
        handleRadio(val) {
            this.contactForm.sex = val;
        },
        submitOrder() {
                if(!this.contactForm.contactName) {
                        this.$toast({
                            message: '请输入联系人姓名',
                            duration: 1000,
                        })
                        return;
                    } else if (!this.contactForm.contactMobile.match(/^(13|14|15|17|18)\d{9}$/)) {
                        this.$toast({
                            message: '请输入正确手机号',
                            duration: 1000,
                        })
                        return;
                    } else if (!this.contactForm.contactEmail.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                        this.$toast({
                        message: '请输入正确邮箱号',
                        duration: 1000,
                        })
                        return;
                    }
                    console.log(Object.assign({},this.contactForm))
                    let wareOrderInfo = Object.assign({},this.wareOrderInfo)
                    let { contactName, contactMobile, contactEmail, sex } = this.contactForm;
                    wareOrderInfo.contactName = contactName;
                    wareOrderInfo.contactMobile = contactMobile;
                    wareOrderInfo.contactEmail = contactEmail;
                    wareOrderInfo.sex = sex;
                    console.log(wareOrderInfo)
                    createOrder(wareOrderInfo).then(res => {
                        console.log(res)
                        // this.$router.push('/ware/pay?payId=415177136070425')
                        if(res.data.status === 1) {
                            let payId = res.data.data;
                            sessionStorage.setItem('wareOrderInfo', JSON.stringify(wareOrderInfo))
                            this.$router.push('/ware/pay?payId='+payId)
                        } else {
                            this.$toast({
                                message: res.data.msg || '服务器响应失败',
                                duration: 1000
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        this.$catchError(err)
                    })
            }
        },
        created() {
            this.wareName = sessionStorage.getItem('wareName');
            this.wareOrderInfo = JSON.parse(sessionStorage.getItem('wareOrderInfo'));
        }
}
</script>
<style lang="scss" scoped>
    .order-page {
        padding: 15px 15px 50px 15px;
        background: #fff;
    }
    .radio-core {
        box-sizing: border-box;
        display: inline-block;
        background-color: #fff;
        border-radius: 100%;
        border: 1px solid #ccc;
        position: relative;
        top: -2px;
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 2px;
        &.checked {
            background-color: #26a2ff;
            border-color: #26a2ff;
            &:after {
                background-color: #fff;
                transform: scale(1);
            }
        }
        &:after {
            content: " ";
            position: absolute;
            top: 4px;
            left: 4px;
            width: 6px;
            height: 6px;
            border-radius: 100%;
            transition: transform .2s;
            transform: scale(0); 
        }
    }
    .form-item {
        height: 40px;
        line-height: 25px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ccc;
        .form-item-label {
            width: 80px;
        }
        .form-item-input {
            padding-left: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
            vertical-align: middle;
        }
        .radio {
            margin-right: 15px;
        }
    }
    .fixed-footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        .submit-button {
            width: 100%;
            padding: 12px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            background:  #00aaef;
        }
    }
</style>

