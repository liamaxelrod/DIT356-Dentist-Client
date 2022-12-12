<template>
    <div class="center">
        <div>
            <p>{{this.stateIfSuccessful}}</p>
        </div>
        <div class="bittpnLogin">
            <button class="btn btn-success btn-lg">login</button>

        </div>
        <div class="bittpnRegister">
            <button class="btn btn-success btn-lg">register</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      stateIfSuccessful: ''
    }
  }
}
</script>

<style>
.bittpnLogin {
    display: inline-block;
    margin: 10px;

    /* background-color: red; */
}
.bittpnRegister {
    display: inline-block;
    margin: 10px;

    /* background-color: red; */
}
</style>