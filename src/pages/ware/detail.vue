<template>
	<section>
		<slef-header :title="'商品详情'"></slef-header>
		<div class="ware-swipe">
			<mt-swipe :showIndicators="false"  :style="{height: bannerHeight}">
				<mt-swipe-item v-for="(item, index) in bannerList" :key="index">
					<img :src="item.filePath">
				</mt-swipe-item>
			</mt-swipe>
			<div class="ware-code">
				编号：<span>{{wareDetail.wareCode}}</span>
			</div>
		</div>
		<div class="detail-section">
			<div class="detail-item">
				<h4 class="ware-name">
					{{wareDetail.wareName}}
				</h4>
			</div>
			<div class="detail-item">
				<div class="ware-price" v-if="isLogin">
					<p class="text-price"><i class="icon-rmb">￥</i><strong>{{wareDetail.suggestedPrice}}</strong>
					<span>{{wareDetail.unit}}</span>/起</p>
				</div>
				<div v-else>
					<p class="text-price">
						<router-link :to="'/login?redirect='+$route.fullPath" tag="span">
						登录后价格可见
						</router-link>
					</p>
				</div>
			</div>
			<div class="detail-item feature">
				<label class="features">行程特色：</label>
				<ul class="feature-list">
					<li v-for="(keyword, index) in keyWords" :key="index">{{keyword}}</li>
				</ul>
			</div>
			<div class="detail-item">
				<label class="srccity">出发地：</label>
				<p>{{wareDetail.srcCity}}</p>
			</div>
		</div>
		<div class="detail-section recommend">
			<h3 class="attr-title">店长推荐</h3>
			<div v-html="wareDetail.wareDesc"></div>
		</div>
		<div class="detail-section" v-for="(item, index) in attributeList" :key="index">
			<h3 class="attr-title">{{attributeName[item.title]}}</h3>
			<div v-html="item.content" class="ware-attr"></div>
		</div>
		<div style="height: 50px;"></div>
		<div class="fixed-footer">
			<ul class="footer-bar">
				<li class="collection">
					<a href="javascript:;" @click="handleCollect">
						<img v-show="isCollection != 1" src="/static/image/shou01.png">
						<img v-show="isCollection == 1" src="/static/image/shou02.png">
						<p>{{collection}}</p>
					</a>
				</li>
				<li class="service">
					<a href="tel:18500137582">
						<img src="/static/image/kefu.png">
						<p>客服</p>
					</a>
				</li>
				<li class="reserve">
					<button class="reserve-button" @click="handleReserve">查看档期/价格</button>
				</li>
			</ul>
		</div>
	</section>
</template>
<script>
	import slefHeader from '../myCenter/selfHeader'
	import { wareDetail, wareAttribut, createWareCollection, cancelWareCollection } from '@/api'
	export default {
		components: {
			slefHeader
		},
		data () {
			return {
				wareId: '',
				bannerList: [],
				wareDetail: {},
				wareAttribute: {},
				attrOrder: [
					'CHANPINJIESHAO',
					'CHANPINCANSHU',
					'FEIYONGSHUOMING',
					'FEIYONGBAOHAN',
					'YUDINGXUZHI',
					'ZILIFEIYONG',
					'TUIGAIGUIZE',
					'QIANZHENGQIANZHU',
				],
				attributeName: {
					CHANPINJIESHAO: '产品介绍',
					CHANPINCANSHU: '产品参数',
					FEIYONGSHUOMING: '费用说明',
					FEIYONGBAOHAN: '费用包含',
					YUDINGXUZHI: '预定须知',
					ZILIFEIYONG: '自理费用',
					TUIGAIGUIZE: '退改规则',
					QIANZHENGQIANZHU: '签证/签注',
				},
				attributeList: [],
				keyWords: [],
				bannerHeight: '210px',
				collection: '收藏',
				isCollection: 0,
			}
		},
		methods: {
			getWareDetail(wareId) {
				let data = {
					id: wareId
				}
				wareDetail(data).then(res => {
					if(res.data.status === 1) {
						// console.log(res.data.data)
						this.wareDetail = res.data.data;
						document.title = this.wareDetail.wareName;
						this.isCollection = this.wareDetail.collectStatus;
						sessionStorage.setItem('wareName', this.wareDetail.wareName)
						this.keyWords = this.wareDetail.keyWords.split(',').splice(0,3);
						this.bannerList = this.wareDetail.wareImgInfos;
					}
				})
			},
			getWareAttribute(wareId) {
				let data = {
					wareId
				}
				wareAttribut(data).then(res => {
					if(res.data.status === 1) {
						this.attrOrder.forEach(attr => {
							let attrObj = {
								title: attr,
								content: res.data.data[attr]
							}
							if(attrObj.content) {
								this.attributeList.push(attrObj)
							}
						})
					}
				})
			},
			handleCollect() {
				if(!this.isLogin) {
					this.$showToast('请先登录')
					return;
				}
				let data = {
					wareId: this.wareId
				}
				if(this.isCollection == 1) {
					cancelWareCollection(data).then(res => {
						if(res.data.status === 1) {
							this.$showToast('取消收藏成功')
							this.collection = '收藏';
							this.isCollection = 0;
						} else {
							this.$showToast('取消收藏失败')
						}
					})
				} else {
					createWareCollection(data).then(res => {
						if(res.data.status === 1) {
							this.$showToast('收藏成功')
							this.collection = '已收藏';
							this.isCollection = 1;
						} else {
							this.$showToast('收藏失败')
						}
					})
				}
				
			},
			handleReserve() {
				this.$router.push(`/ware/reserve?wareId=${this.wareId}`)
				// if(this.isLogin) {
				// } else {
				// 	this.$showToast('请先登录')
				// 	this.$router.push(`/login?redirect=${this.$route.fullPath}`)
				// }
			}
		},
		computed: {
			isLogin() {
				return this.$store.getters.isLogin;
			}
		},
		created() {
			this.$store.dispatch('loadUserInfo')
			this.wareId = this.$route.query.id;
			if(this.wareId) {
				this.getWareDetail(this.wareId)
				this.getWareAttribute(this.wareId)
			}
		},
		mounted() {
			this.bannerHeight = (document.body.clientWidth / 2.18) + 'px';
			window.onresize = () => {
				this.bannerHeight = (document.body.clientWidth / 2.18) + 'px';
			}
		},
	}
</script>
<style scoped lang="scss">
	.ware-swipe {
		position: relative;
		.mint-swipe-item {
			display: block;
			width: 100%;
		}
		img {
			display: block;
			width: 100%;
			height: auto;
		}
		.ware-code {
			position: absolute;
			right: 10px;
			bottom: 10px;
			z-index:2;
			padding: 1px 8px;
			color: #fff;
			border-radius: 10px;
			background: rgba(0,0,0,.3);
		}
	}
	.detail-section {
		padding: 5px 15px;
		background: #fff;
		&.recommend {
			margin-top: 20px;
		}
		.attr-title {
			padding: 0;
			margin-bottom: 5px;
			font-size: 16px;
			&::before {
				content: '';
				display: inline-block;
				width: 3px;
				height: 12px;
				margin-right: 8px;
				background: #00aaef;
			}
		}
		.detail-item {
			display: flex;
			margin-bottom: 10px;
			&:last-child {
				margin-bottom: 0;
			}
			label {
				width: 80px;
			}
			&.feature {
				padding: 10px 0;
				border-top: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
			}
			.feature-list {
				overflow: hidden;
				white-space: nowrap;
				li {
					display: inline-block;
					margin-right: 5px;
					margin-bottom: 5px;
					padding: 2px 5px;
					font-size: 12px;
					border: 1px solid #ccc;
				}
			}
		}
		.ware-name {
			font-weight: normal;
		}
		.ware-attr {
			padding: 5px 0 15px;
			border-bottom: 1px solid #ccc;
		}
	}
	.fixed-footer {
		position: fixed;
		bottom: 0;
		z-index: 99;
		width: 100%;
		background: #fff;
		.footer-bar {
			display: flex;
			height: 50px;
			line-height: 50px;
			li {
				flex: 1;
				text-align: center;
				a {
					display: block;
					width: 100%;
					color: #666;
				}
				img {
					width: 17px;
					height: 19px;
				}
				p {
					margin-top: -15px;
					line-height: 1;
				}
			}
			.reserve {
				flex: 2;
				.reserve-button {
					width: 100%;
					color: #fff;
					font-size: 16px;
					background: rgb(0, 161, 229);
				}
			}
		}
	}
</style>
