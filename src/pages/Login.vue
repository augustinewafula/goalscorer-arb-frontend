<template>
  <div class="container h-100">
		<div class="d-flex justify-content-center h-100">
			<div class="user_card">
				<div class="d-flex justify-content-center">
					<div class="brand_logo_container">
						<img src="img/icons/android-icon-192x192.png" width="100" class="brand_logo" alt="Logo">
					</div>
				</div>  
                <base-alert v-show="form_has_error" type="info">
                    <span>{{error_message}}</span>
                </base-alert>                                
				<div class="d-flex justify-content-center form_container">                    
					<form v-on:submit.prevent="onSubmit">
						<div class="input-group mb-3">
							<input type="text" name="" v-model="username" class="form-control input_user" value="" placeholder="username" required>
						</div>
						<div class="input-group mb-2">
							<input type="password" name="" v-model="password" class="form-control input_pass" value="" placeholder="password" required>
						</div>
                        <div class="input-group mb-2">                            
                            <button type="submit" style="margin-top: 20px" name="button" class="btn login_btn">
                                <div v-show="isLoading" class="ld ld-ring ld-spin"></div>
                                <span v-show="!isLoading">Login</span>
                            </button>
                        </div>
					</form>
				</div>
				<!-- <div class="d-flex justify-content-center mt-3 login_container">
					<button type="button" @click="submit" name="button" class="btn login_btn">
                        <div v-show="isLoading" class="ld ld-ring ld-spin"></div>
                        <span v-show="!isLoading">Login</span>
                    </button>
				</div> -->
			</div>
		</div>
	</div>
</template>
<style>
@import 'https://loading.io/css/loading.css';
@import 'https://loading.io/css/loading-btn.css';    
</style>
<script>
import axios from 'axios'
import NotificationTemplate from './Notifications/NotificationTemplate';
import { BaseAlert } from '@/components';
export default {
    components: {
      BaseAlert
    },
    data: () => ({  
        username : '',
        password : '',
        type: ["", "info", "success", "warning", "danger"],
        form_has_error : false,
        error_message : '',
        isLoading : false,
    }),
    methods: {
        onSubmit () {
            if(!(this.username && this.password)){
                console.log('Fill all the details')
                return
            }
            this.isLoading = true
            axios.get('/login', {
                auth : {
                    username: this.username,
                    password: this.password
                }
            })
            .then((response)=>{
                this.isLoading = false
                localStorage.setItem('token', response.data.token)
                axios.defaults.headers.common['x-access-token'] = response.data.token
                this.$router.push({path: '/dashboard'})
            })
            .catch((error)=>{
                this.isLoading = false
                this.error_message = error.response.data
                this.form_has_error = true
            });
        }
    },
};
</script>

<style scoped>
.user_card {
    height: 380px;
    width: 360px;
    margin-top: 100px;
    margin-bottom: auto;
    background: #27293D;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 5px;

    }
    .brand_logo_container {
        position: absolute;
        height: 170px;
        width: 170px;
        top: -75px;
        border-radius: 50%;
        background: rgb(44, 45, 61);
        padding: 10px;
        text-align: center;
    }
    .brand_logo {
        height: 150px;
        width: 150px;
        border-radius: 50%;
        border: 2px solid white;
    }
    .form_container {
        margin-top: 0;
    }
    form{
        width : 80%;
    }
    .login_btn {
        width: 100%;
        color: white !important;
    }
    .login_btn:focus {
        box-shadow: none !important;
        outline: 0px !important;
    }
    .login_container {
        padding: 0 2rem;
    }
    .input-group-text {
        background: #c0392b !important;
        color: white !important;
        border: 0 !important;
        border-radius: 0.25rem 0 0 0.25rem !important;
    }
    .input_user,
    .input_pass:focus {
        box-shadow: none !important;
        outline: 0px !important;
    }
</style>

