<template>
    <div class="home">
      <img id="image" src="https://i0.wp.com/thedentistsdorridge.co.uk/wp-content/uploads/2019/11/be_a_denist.jpg?fit=1024%2C683&ssl=1"/>
      <section class="hero is-dark">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              <!-- ADD SOME TEXT OR W/E HERE? -->
            </h1>
          <h2 class="subtitle">
            <!-- ADD SOME TEXT OR W/E HERE? -->
          </h2>
        </div>
      </div>
    </section>
    </div>
  </template>
<script>

export default {
  name: 'home',
  components: {}
}

</script>
<style>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  background-color: #80BAB2;
}
#image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
