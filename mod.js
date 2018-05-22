	app={
		config:{
			domain 	: "192.168.1.222",
			path 	: "www.hellobonsai.com",
			localStorage: "mmUserName",
			ajax:{
				ipInfo 	: 'https://ipapi.co/json',
				login 	: 'https://api.platinumstrade.com/account/logon',
				logout 	: 'https://api.platinumstrade.com/account/logoff',
				register: 'https://api.platinumstrade.com/Registration/Full',
			},
		},
		do:{
			getInfo:function(){
				$.get(app.config.ajax.ipInfo, function(data) {
					getInfo=data;
					$('#user_phone_code').val(getInfo.country_calling_code);
					$('#user_phone_number').val(getInfo.country_calling_code);
				});
			},
			login:function(email,password){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": app.config.ajax.login,
					"method": "POST",
					"data": {	
								"email"    : email,
								"password" : password
							}
				}).done(function (response,status,xhr) {
					if (status="success") {
						window.localStorage.setItem(app.config.localStorage,response.firstName+' '+response.lastName);
						app.do.goto("deposit");
					}
				}).fail(function(response){
					console.log(JSON.parse(response.responseText).message);
					errors=JSON.parse(response.responseText).message;
					alert(errors.replace(/\. /g,'\n'));
					$('#login-user-password').val('');
				});
			},
			logout:function(){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": app.config.ajax.logout,
					"method": "POST",
				})
				.done(function(response) {
					window.localStorage.removeItem(app.config.localStorage);
					app.do.goto("login");
				})
				.fail(function() {
					console.log("error");
				});
			},
			registration:function(){
				var fname=$('#user_full_name').val().split(' ')[0];
				var lname=$('#user_full_name').val().split(' ')[1];
				var phone=$('#user_phone_number').val().substring(getInfo.country_calling_code.length,$('#user_phone_number').val().length);
				var phone_code=$('#user_phone_number').val().substring(0,getInfo.country_calling_code.length).replace('+','');
				var phone_operator=$('#user_phone_number').val().substring(phone_code.length+1,phone_code.length+3);
				console.log(phone);

				$.ajax({
					url: app.config.ajax.register,
					type: 'GET',
					xhrFields: { withCredentials: true },
					data:{	
						FirstName: fname,
						LastName:  lname,
						Email: 	  $('#user_email').val(),
						Password: $('#user_password').val(),
						PhoneCountry: phone_code,
						PhoneOperator: phone_operator,
						PhoneNumber:  phone.substring(phone_operator.length,phone.length),
						Country:getInfo.country,
						Terms:    true
					},
				})
				.done(function(response) {
					app.do.login($('#user_email').val(),$('#user_password').val());
					console.log(response);
				})
				.fail(function(response) {
					console.log(JSON.parse(response.responseText).message);
					errors=JSON.parse(response.responseText).message;
					alert(errors.replace(/\. /g,'\n'));
				});
			},
			home:function(){
				console.log('test');
				$('.signup-btn').on('click',function(event) {
					
					event.preventDefault();
					
					if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('#user_email').val()))){
				        alert('Please enter a valid email');
				        $('#user_email').focus();
				        return false;
				     }
				     window.location.href='signup?full_name='+$('#user_full_name').val()+'&email='+$('#user_email').val();
				});
			},
			run:function() {
			    var route=window.location.pathname.split("/");
			    route=route[route.length-2];
			    console.log('route -> '+route);
				switch(route) {
					case "signin":
						$('.btn-sign-in').on('click',function(event) {
							event.preventDefault();
							app.do.login($('#login-user-email').val(),$('#login-user-password').val());
						});
						break;
					case "signup":
						app.do.getInfo();
						var url= new URL(window.location.href);
						if(url.searchParams.get('full_name')){
							$('#user_full_name').val(url.searchParams.get('full_name'));
						}
						if(url.searchParams.get('email')){
							$('#user_email').val(url.searchParams.get('email'));
						}
						$('.signup-btn').on('click',function(event) {
							event.preventDefault();
							app.do.registration();
						});	
						break;
					case "deposit":
						if (!localStorage.getItem(app.config.localStorage)) {
							app.do.goto("signin");
							return;
						}
						$('.user-name').text(window.localStorage.getItem(app.config.localStorage));
						$('#logout-btn').on('click',function(event) {
							event.preventDefault();
							app.do.logout();
						});
						break;
					case "settings":
						$('.user-name').text(window.localStorage.getItem(app.config.localStorage));
						break;
					case "":
					case app.config.path:
					case app.config.domain:
						app.do.home();
						break;
				}
			},
			goto:function(to){
				var paths = location.pathname.split('/');
				paths[ paths.length-2 ] = to;
				location.pathname = paths.join('/');
			}
		}
	}
$(document).ready(function(){
	app.do.run();
});