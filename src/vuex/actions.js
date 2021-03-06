import { isLogin } from '@/api'
export const changeLogin = ({ commit }, status) => {
	commit('CHANGE_LOGIN', status)
}
export const saveUserInfo = ({ commit }, userInfo) => {
	commit('SAVE_USERINFO', userInfo)
}
export const saveStoreInfo = ({ commit }, storeInfo) => {
	commit('SAVE_STOREINFO', storeInfo)
}
export const saveSelfInfo = ({ commit }, selfInfo) => {
	commit('SAVE_SELFINFO', selfInfo)
}
export const saveAddress = ({ commit }, address) => {
	commit('SAVE_ADDRESS', address)
}
export const loadUserInfo = ({ commit }) => {
	return new Promise((resolve, reject) => {
		isLogin().then(res => {
			if(res.data.status === 1) {
				commit('CHANGE_LOGIN', 1)
				commit('SAVE_USERINFO', res.data.data)
				resolve(1)
			} else {
				commit('CHANGE_LOGIN', 0)
				resolve(0)
			}
		}).catch(err => {
			resolve(0)
		})
	})
}