<template>
    <v-card>
      <v-card-title>
        <div class="layout row ma-0 justify-space-between pb-1">
          <div class="headline blue-grey--text">{{ title }}</div>
          <div class="icon">
            <v-icon :color="color">{{ icon }}</v-icon>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="justify-center row layout ma-0">
          <v-progress-circular
            :size="150"
            :width="15"
            :rotate="-90"
            :value="parseFloat(value)"
            :color="color">
            <h4>{{ value }} %</h4>
          </v-progress-circular>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-chip color="green" text-color="white" style="width: 80%; margin-left: 10%;">
          <v-avatar class="indigo lighten-4">
            <v-icon :color="colorState">{{iconState}}</v-icon>
          </v-avatar>
          <strong>{{ state }}</strong>
        </v-chip>
      </v-card-actions>
    </v-card>     
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    state: String,
    iconState: String,
    colorState: String,
    value: String,
    color: String
  }
};
</script>

<style>
</style>
