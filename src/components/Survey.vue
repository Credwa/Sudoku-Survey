<template>
  <v-container>
    <v-layout align-center justify-center column fill-height style="margin-top:20vh">
      <v-stepper v-model="e1" class="survey-stepper">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            {{gender ? gender : 'Gender'}}
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">
            {{refer ? refer : 'Referral Site'}}
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :complete="e1 > 3">
            {{experience ? experience : 'Experience'}}
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card
              class="survey-card"
            >
              <v-radio-group
               @change="genderChange"
               v-model="gender">
                <v-radio
                  v-for="n in ['Male', 'Female']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-radio-group>
              <v-card-actions>
                <v-btn outline color="purple" @click="nextStep">Next</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="survey-card">
              <v-radio-group @change="referChange" v-model="refer">
                <v-radio
                  v-for="n in ['Amazon Mechanical Turk', 'Reddit', 'Sudoku Forum', 'Other']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
                <v-text-field v-if="refer === 'Other'"
                  label="Referrer"
                  v-model="other"
                ></v-text-field>
              </v-radio-group>
              <v-card-actions>
                <v-btn outline color="red" @click="prevStep">Previous</v-btn>
                <v-btn outline color="purple" @click="nextStep">Next</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card class="survey-card">
              <v-radio-group @change="experienceChange" v-model="experience">
                <v-radio
                  v-for="n in ['Beginner', 'Experienced', 'Expert']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-radio-group>
              <v-card-actions>
                <v-btn outline color="red" @click="prevStep">Previous</v-btn>
                <v-btn outline color="purple" @click="e1++">Next</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-layout v-if="e1 > 3" row style="margin-top:5vh">
        <v-chip class="survey-summary" @click="e1 = 1" label color="blue" text-color="white">
          <v-icon left>label</v-icon>{{gender}}
        </v-chip>
        <v-chip label color="blue" class="survey-summary" @click="e1 = 2" text-color="white">
          <v-icon left>label</v-icon>{{refer === 'Other' ? other : refer}}
        </v-chip>
        <v-chip label class="survey-summary" color="blue" @click="e1 = 3" text-color="white">
          <v-icon left>label</v-icon>{{experience}}
        </v-chip>
      </v-layout>

      <v-layout v-if="e1 > 3  && !loading" style="margin-top:5vh" row>
        <v-btn color="red" @click="e1 = 1">Go Back</v-btn>
        <v-btn color="blue" @click="submit">Submit</v-btn>
      </v-layout>
      <v-progress-circular
      indeterminate
      :size='100'
      color="green"
      v-if="loading"
      ></v-progress-circular>

    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import firebase from '../config/firebaseinit';

export default {
  data() {
    return {
      e1: 0,
      gender: null,
      refer: null,
      other: '',
      experience: 'Beginner',
      loading: false,
    };
  },
  methods: {
    ...mapMutations('main', ['changeAppDisplay', 'setUserKey']),
    ...mapMutations('sudoku', ['newUser']),
    genderChange() {
      this.e1++;
    },
    referChange() {
      if (this.refer !== 'Other') {
        this.e1++;
      }
    },
    experienceChange() {
      this.e1++;
    },
    nextStep() {
      if (this.gender) {
        this.e1++;
      }
    },
    prevStep() {
      this.e1--;
    },
    submit() {
      const date = new Date();
      const user = {
        gender: this.gender,
        referralSite: this.refer === 'Other' ? this.other : this.refer,
        experience: this.experience,
        created: `${date.toDateString()} ${date.getUTCHours()}:${date.getUTCMinutes()}`,
      };
      this.newUser(user);
      this.changeAppDisplay(1);
    },
    async getUserIP() {
      const response = await fetch('https://api.ipify.org?format=json');
      const json = await response.json();
      this.compareIPs(json.ip);
    },
    compareIPs(ip) {
      firebase
        .database()
        .ref('/user-ip-list')
        .once('value')
        .then((snapshot) => {
          console.log(snapshot.val());
          const allIps = snapshot.val();
          Object.values(allIps).forEach((val) => {
            if (val.IP === ip) {
              this.changeAppDisplay(-1);
            }
          });
        });
    },
  },
  created() {
    this.getUserIP();
  },
};
</script>

<style scoped>
.survey-card {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  justify-items: center;
}

@media only screen and (max-width: 500px) {
  .survey-stepper {
    width: 100%;
  }
}

@media only screen and (max-width: 900px) {
  .survey-stepper {
    width: 80%;
  }
}

.survey-summary {
  cursor: pointer;
}
</style>

