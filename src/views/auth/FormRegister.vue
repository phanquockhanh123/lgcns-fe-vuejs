<template>
  <div class="wrapper">
    <!----------------------------- Form box ----------------------------------->
    <div class="form-box">
      <!------------------- registration form -------------------------->
      <div class="register-container" id="register">
        <div class="top">
          <span
            >Have an account?
            <router-link to="/login">Sign In</router-link></span
          >
          <header>Sign Up</header>
        </div>
        <div class="two-forms">
          <div class="input-box">
            <input
              type="text"
              class="form-control"
              v-model="user.firstName"
              placeholder="Firstname"
              @blur="validateField('firstName')"
              :class="['form-control', { 'is-invalid': errors.firstName }]"
            />
            <span class="text-error" v-if="errors.firstName">{{
              errors.firstName
            }}</span>
            <i class="bx bx-user"></i>
          </div>
          <div class="input-box">
            <input
              type="text"
              class="form-control"
              v-model="user.lastName"
              placeholder="Lastname"
              @blur="validateField('lastName')"
              :class="['form-control', { 'is-invalid': errors.lastName }]"
            />
            <span class="text-error" v-if="errors.lastName">{{
              errors.lastName
            }}</span>
            <i class="bx bx-user"></i>
          </div>
        </div>
        <div class="input-box">
          <input
            type="text"
            class="form-control"
            v-model="user.email"
            placeholder="Email"
            @blur="validateField('email')"
            :class="['form-control', { 'is-invalid': errors.email }]"
          />
          <span class="text-error" v-if="errors.email">{{ errors.email }}</span>
          <i class="bx bx-envelope"></i>
        </div>
        <div class="input-box">
          <input
            type="password"
            class="form-control"
            v-model="user.password"
            placeholder="Password"
            @blur="validateField('password')"
            :class="['form-control', { 'is-invalid': errors.password }]"
          />
          <span class="text-error" v-if="errors.password">{{
            errors.password
          }}</span>
          <i class="bx bx-lock-alt"></i>
        </div>
        <div class="input-box">
          <input
            type="password"
            class="form-control"
            v-model="user.confirmPassword"
            placeholder="Confirm password"
            @blur="validateField('confirmPassword')"
            :class="['form-control', { 'is-invalid': errors.confirmPassword }]"
          />
          <span class="text-error" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</span>
          <i class="bx bx-lock-alt"></i>
        </div>
        <span class="text-error" v-if="errors.rsapi">{{ errors.rsapi }}</span>
        <div class="input-box">
          <input
            type="submit"
            class="submit"
            @click.prevent="register"
            value="Register"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import axiosInterceptor from "@/service/AxiosInteceptorToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { defineComponent, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const user = reactive({
  firstName: "",
  lastName: "",
  email: "",
  confirmPassword: "",
  password: "",
  address: "",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  confirmPassword: "",
  password: "",
  rsapi: "",
  address: "",
});

const hasErrors = () => {
  return Object.values(errors).some((error) => error !== "");
};


const register = async () => {
  const dataRegister = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: "USER",
  };

  const hasErrors = Object.values(errors).some(
        (error) => error !== ""
      );

  if (!hasErrors) {
    try {
      const res = await axiosInterceptor.post("/auth/signup", dataRegister);
      if (res.data.statusCode === 200) {
        toast.success("Register success!", {
          autoClose: 1000,
        });
        console.log("Register successful:", res.data);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        alert("Register failed!");
      }
    } catch (e: any) {
      console.log(e);
      errors.rsapi = e.error;
    }
  }
};

const validateField = (field) => {
  switch (field) {
    case "password":
      errors.password = user.password
        ? user.password.length < 3
          ? "Password must be at least 3 characters"
          : ""
        : "Password is required";
      break;
    case "confirmPassword":
      errors.confirmPassword = user.confirmPassword
        ? user.password !== user.confirmPassword
          ? "Password and Confirm Password must match"
          : ""
        : "Confirm Password is required";
      break;
    case "email":
      const emailPattern = /^[^\s@]+@gmail\.com$/;
      errors.email = user.email
        ? !emailPattern.test(user.email)
          ? "Email is not valid"
          : ""
        : "Email is required";
      break;
    case "firstName":
      errors.firstName = user.firstName ? "" : "First name is required";
      break;
    case "lastName":
      errors.lastName = user.lastName ? "" : "Last name is required";
      break;
    case "address":
      errors.address = user.address ? "" : "Address is required";
      break;
    default:
      break;
  }
};
</script>

<style scoped>
/* POPPINS FONT */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.wrapper {
  background: url("../../assets/images/1.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 110vh;
  /* background: rgba(39, 39, 39, 0.4); */
}

.nav {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100px;
  line-height: 100px;
  background: linear-gradient(rgba(39, 39, 39, 0.6), transparent);
  z-index: 100;
}

.nav-logo p {
  color: white;
  font-size: 25px;
  font-weight: 600;
}

.nav-menu ul {
  display: flex;
}

.nav-menu ul li {
  list-style-type: none;
}

.nav-menu ul li .link {
  text-decoration: none;
  font-weight: 500;
  color: #fff;
  padding-bottom: 15px;
  margin: 0 25px;
}

.link:hover,
.active {
  border-bottom: 2px solid #fff;
}

.nav-button .btn {
  width: 130px;
  height: 40px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn.white-btn {
  background: rgba(255, 255, 255, 0.7);
}

.btn.btn.white-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nav-menu-btn {
  display: none;
}

.form-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 512px;
  height: 420px;
  /* overflow: hidden; */
  z-index: 2;
}

.login-container {
  position: absolute;
  left: 4px;
  width: 500px;
  display: flex;
  flex-direction: column;
  transition: 0.5s ease-in-out;
}

.register-container {
  position: absolute;
  width: 500px;
  display: flex;
  flex-direction: column;
  transition: 0.5s ease-in-out;
}

.top span {
  color: #fff;
  font-size: small;
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

.top span a {
  font-weight: 500;
  color: #fff;
  margin-left: 5px;
}

header {
  color: #fff;
  font-size: 30px;
  text-align: center;
  padding: 10px 0 30px 0;
}

.two-forms {
  display: flex;
  gap: 10px;
}

input.form-control {
  font-size: 15px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  height: 50px;
  width: 100%;
  padding: 0 10px 0 45px;
  border-radius: 30px;
  outline: none;
  transition: 0.2s ease;
  margin-top: 10px;
}

input.form-control:hover,
input.form-control:focus {
  background: rgba(255, 255, 255, 0.25);
}

::-webkit-input-placeholder {
  color: #fff;
}

.input-box i {
  position: relative;
  top: -35px;
  left: 17px;
  color: #fff;
}

.submit {
  font-size: 15px;
  font-weight: 500;
  color: black;
  height: 45px;
  width: 100%;
  border: none;
  border-radius: 30px;
  outline: none;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-top: 10px;
}

.submit:hover {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.2);
}

.two-col {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: small;
  margin-top: 10px;
}

.two-col .one {
  display: flex;
  gap: 5px;
}

.two label a {
  text-decoration: none;
  color: #fff;
}

.two label a:hover {
  text-decoration: underline;
}

span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}

@media only screen and (max-width: 786px) {
  .nav-button {
    display: none;
  }

  .nav-menu.responsive {
    top: 100px;
  }

  .nav-menu {
    position: absolute;
    top: -800px;
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    width: 100%;
    height: 90vh;
    backdrop-filter: blur(20px);
    transition: 0.3s;
  }

  .nav-menu ul {
    flex-direction: column;
    text-align: center;
  }

  .nav-menu-btn {
    display: block;
  }

  .nav-menu-btn i {
    font-size: 25px;
    color: #fff;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
  }

  .nav-menu-btn i:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

@media only screen and (max-width: 540px) {
  .wrapper {
    min-height: 100vh;
  }

  .form-box {
    width: 100%;
    height: 500px;
  }

  .register-container,
  .login-container {
    width: 100%;
    padding: 0 20px;
  }

  .register-container .two-forms {
    flex-direction: column;
    gap: 0;
  }
}
</style>
