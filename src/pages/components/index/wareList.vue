<template>
	<ul class="ware-list">
		<li v-for="ware in wareData" :key="ware.id" class="ware-item">
			<router-link :to="'/ware/detail?id='+ware.id">
				<img v-lazy="ware.mainImg" class="ware-img">
				<div class="ware-detail">
					<h4 class="ware-name">{{ware.wareName}}</h4>
					<ul class="ware-keywords clearfix">
						<li v-for="(item, index) in ware.keyWords.split(',')" :key="index">{{item}}</li>
					</ul>
					<p class="price text-price" v-if="isLogin === 1">
						<i class="icon-rmb">￥</i><strong>{{ware.suggestedPrice}}</strong>
						<span>{{ware.unit}}</span>/起
					</p>
					<p v-else class="price text-price">
						<router-link :to="loginUrl" class="text-red" tag="span">
						登录后价格可见
						</router-link>
					</p>
				</div>
			</router-link>
		</li>
	</ul>
</template>
<script>
	export default {
		name: 'wareList',
		props: ['wareData', 'currentRoute'],
		computed: {
			loginUrl() {
				return this.currentRoute ? `/login?redirect=${this.currentRoute}` : '/login';
			},
			isLogin() {
				return this.$store.getters.isLogin;
			}
		},
	}
</script>
<style scoped lang="scss">
	.ware-list {
		padding: 15px;
		.ware-item {
			padding-bottom: 10px;
			margin-bottom: 20px;
			border-bottom: 1px solid #f0f0f0;
			a {
				display: flex;
				color: #666;
			}
			.ware-img {
				width: 128px;
				height: 92px;
				margin-right: 10px;
			}
			.ware-detail {
				flex: 1;
				.ware-name {
					font-weight: normal;
				}
				.ware-keywords {
					li {
						float: left;
						margin: 3px 6px 0 0;
						padding: 1px 3px;
						font-size: 12px;
						border: 1px solid #ccc;
					}
				}
				.price {
					margin-top: 5px;
				}
			}
		}
	}
</style>