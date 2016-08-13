/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	owner.saveUser=function (data) {
		$.ajax({
			type:"POST",
			url:posturl.login,
			dataType:'json',
			data:{
				sex:data.sex,
				name:data.name,
				avatar:data.avatar,
				location:data.location
			},
			success:function () {
				mui.toast("用户信息保存成功！");
			},
			error:function () {
				mui.toast("请检查网络连接！");
			}
		});
	},
	owner.createState = function(data, callback) {
		var state = owner.getState();
		var sex=data.gender;
		var ulocation=data.province+' '+data.city;
		if (sex=='m') {
			sex='男';
		}
		state.token=1;
		state.sex=sex||(data.sex==1?"男":"女");
		state.name = data.nickname||data.screen_name;
		state.avatar = data.figureurl_qq_2||data.headimgurl||data.avatar_large;
		state.location=data.location||ulocation;
		owner.setState(state);
		owner.saveUser(state);
		return callback();
	};
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));