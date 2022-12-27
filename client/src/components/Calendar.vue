<template>
 <b-row>
    <b-col md="auto">
      <!-- ADD INFORMATION IF THERE IS NO APPOINTMENT THAT DAY -->
      <b-calendar v-model="value" @context="onContext" locale="en-EU"></b-calendar>
    </b-col>
    <b-col>
      <p>Value: <b>'{{ value }}'</b></p>
      <p class="mb-0">Context:</p>
      <pre class="small">{{ context }}</pre>
    </b-col>
  </b-row>
</template>

<script>

export default {

}
</script>
