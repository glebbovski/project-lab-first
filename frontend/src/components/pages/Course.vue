<template>
  <v-container>
      <v-layout align-center justify-center>
          <v-img :src="course['url_for_image']" max-height="400"></v-img>
      </v-layout>
      <br/>
      <b>Full Description: </b>
      <v-text>
          {{ course['long_description'] }}
      </v-text>
      <br/>
      <!-- <b>Your Status: </b>
      <v-text class="red--text">
          Not Applied
      </v-text> -->
      <v-container>
        <v-card>
          <v-card-title>Quiz</v-card-title>
          <v-card-text>
            <div v-for="(question, index) in questions" :key="index">
              <div>{{ question.text }}</div>
              <v-radio-group v-model="question.selectedOption" :disabled="question.submitted">
                <v-radio
                  v-for="(option, optionIndex) in question.options"
                  :key="optionIndex"
                  :label="option.text"
                  :value="optionIndex"
                ></v-radio>
              </v-radio-group>
              <v-icon v-if="question.submitted && question.options[question.selectedOption].isCorrect" color="green">mdi-check-circle</v-icon>
              <v-icon v-if="question.submitted && !question.options[question.selectedOption].isCorrect" color="red">mdi-close-circle</v-icon>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="submitQuiz" color="primary" :disabled="isSubmitDisabled" id="submitButton">Submit</v-btn>
            <v-btn @click="retryQuiz" color="primary" :disabled="isRetryDisabled" id="retryButton">Retry</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <!-- <v-footer absolute id="mainFooter"> -->
          <v-container>
              <br />
              <v-row justify="center" no-gutters class="bg-grey-lighten-1" id="backBtnRow">
                  <v-btn
                  v-for="link in links"
                  :id="link.id"
                  :key="link.name"
                  color="black"
                  variant="text"
                  class="mx-2 white--text"
                  rounded
                  :to="link.href"
                  >
                  {{ link.name }}
                  </v-btn>
                  <v-col class="text-center mt-4" cols="12">
                  {{ new Date().getFullYear() }}
                  </v-col>
              </v-row>
          </v-container>
      <!-- </v-footer> -->
  </v-container>
</template>





<style scoped>
/* .center {
margin: auto;
width: 50%;
padding: 10px;
} */

.center {
display: block;
margin-left: auto;
margin-right: auto;
width: 50%;
}

.d-flex {
display: flex;
}

.align-center {
align-items: center;
}

.justify-center {
justify-content: center;
}


#mainFooter {
background: white;
}

.hero {
background: url('../../assets/sky_back.png');
height: 100vh;
}


</style>

<script>

import swal from 'sweetalert2';
import router from '../../router';
import axios from 'axios';
export default {
name: "About",

data: () => ({

    // questions: [ 
    //     {
    //       text: 'What is the capital of France?',
    //       options: [
    //         { text: 'London', isCorrect: false },
    //         { text: 'Paris', isCorrect: true },
    //         { text: 'Berlin', isCorrect: false }
    //       ],
    //       selectedOption: null,
    //       submitted: false
    //     },
    //     {
    //       text: 'Which planet is known as the Red Planet?',
    //       options: [
    //         { text: 'Venus', isCorrect: false },
    //         { text: 'Mars', isCorrect: true },
    //         { text: 'Jupiter', isCorrect: false }
    //       ],
    //       selectedOption: null,
    //       submitted: false
    //     },
    //     {
    //       text: 'What is the right answer for 2+2?',
    //       options: [
    //         { text: '5', isCorrect: false },
    //         { text: '4', isCorrect: true },
    //         { text: '1', isCorrect: false }
    //       ],
    //       selectedOption: null,
    //       submitted: false
    //     }
    //     // Add more questions as needed
    //   ],

    questions: [],
    course: { "id": -1,
              "title": "",
              "description": "",
              "short_href": "" },
    backend_url: 'http://127.0.0.1:8000/',
    links: [
      {name: 'Back to Main Page', href: '/', id: 'backButton'}
    ],
    isRetryDisabled: true,
}),
async created() {
  var success = this.checkLoggedIn();``
  if (success) {
      console.log(this.$session.get('course'))
      this.course['id'] = this.$session.get('course')['id'];
      this.course['title'] = this.$session.get('course')['title'];
      this.course['description'] = this.$session.get('course')['description'];
      this.course['short_href'] = this.$session.get('course')['short_href'];
      this.course['url_for_image'] = this.$session.get('course')['url_for_image'];
      this.course['long_description'] = this.$session.get('course')['long_description'];

      try {
        var access_token = "";

        const res = await axios.post(this.backend_url + 'api/token/refresh/', {
          "refresh": this.$session.get('refresh')
        });
        access_token = res.data['access'];
        this.$session.set('refresh', res.data['refresh']);
        this.$session.set('access', access_token);

        const config = {
        headers: { 'Authorization': 'Bearer ' + access_token,
                  'Content-Type': 'application/json' 
                }
        };

        this.allQuestions = []
        var countOfQuestions = -1;

        const resQuestions = await axios.get(this.backend_url + 'api/questions/?course=' + this.$session.get('course')['id'], config)
        // this.$session.set('countOfQuestions', resQuestions.data.length)

        for (let i = 0; i < resQuestions.data.length; i++) {

          var question = {}
          question = { "id": resQuestions.data[i]['id'],
                      "text": resQuestions.data[i]['question'],
                      "selectedOption": null,
                      "submitted": false,
                      "course": resQuestions.data[i]['course'], 
                      "options": [] }

          console.log(question)
          this.$session.set('question-' + resQuestions.data[i]['id'], question)
        
        }


        for (let i = 0; i < resQuestions.data.length; i++) {
          const resAnswers = await axios.get(this.backend_url + 'api/answers/?question=' + resQuestions.data[i]['id'], config)
          this.$session.set('question-' + resQuestions.data[i]['id'] + "-answers", resAnswers.data)
        }


        for (let i = 0; i < resQuestions.data.length; i++) {
          var question = this.$session.get('question-' + resQuestions.data[i]['id'])
          var answers = this.$session.get('question-' + resQuestions.data[i]['id'] + "-answers")
          for (let j = 0; j < answers.length; j++) {
            question.options.push({ 'id': answers[j]['id'],
                                   'text': answers[j]['answer'],
                                   'isCorrect': answers[j]['isRight']})
          }
          this.$session.set('question-' + resQuestions.data[i]['id'], question)
          this.$session.set('question-' + resQuestions.data[i]['id'] + "-answers", null)
        }

        for (let i = 0; i < resQuestions.data.length; i++) {
          var question = this.$session.get('question-' + resQuestions.data[i]['id'])
          this.questions.push(question)
        }
        
        const previousResults = await axios.get(this.backend_url + "api/previousresult/?course=" + this.$session.get('course')['id'] + "&user=" + this.$session.get('user_id'), config)
        if (previousResults.data.length > 0) {
          this.isRetryDisabled = false;
          for(let i = 0; i < previousResults.data.length; i++) {
            const question = this.questions.find(q => q.id === previousResults.data[i].question);
            question.submitted = true
            for (let j = 0; j < question.options.length; j++) {
              if (question.options[j].id === previousResults.data[i].answer) {
                question.selectedOption = j;
              }
            }
          }
          console.log(this.questions)
        }
        // console.log(previousResults.data.length)

      } catch (e) {
        console.log(e);
      }



  }
},
computed: {
    isSubmitDisabled() {
      return this.questions.some(question => question.selectedOption === null && !question.submitted) || this.allQuestionsSubmitted;
    },
    allQuestionsSubmitted() {
      return this.questions.every(question => question.submitted);
    }
},
methods: {
  checkLoggedIn() {
    this.$session.start();
    if (!this.$session.has("refresh") || this.$session.get("refresh") === null) {
      router.push("/login");
      return false;
    }
    return true;
  },
  async submitQuiz() {
      // console.log("User: " + this.$session.get('user_id') + ", Course: " + this.$session.get('course')['id'])
      const config = {
        headers: { 'Authorization': 'Bearer ' + this.$session.get('access'),
                  'Content-Type': 'application/json' 
                }
      };
      this.questions.forEach(question => {
        question.submitted = true;
        // console.log(", Question: " + question['id'] + ", Answer: " + question.options[question.selectedOption]['id'])
        // console.log(question.options[question.selectedOption]);
        console.log(question.selectedOption)
        var json = {
          "user": this.$session.get('user_id'),
          "course": this.$session.get('course')['id'],
          "question": question['id'],
          "answer": question.options[question.selectedOption]['id']
        }
        const submitRes = axios.post(this.backend_url + "api/previousresult/", json, config)
        question.options.forEach(option => {
          option.text = option.isCorrect ? `✔ ${option.text}` : `✘ ${option.text}`;
        })
      });
      this.isRetryDisabled = false;
  },
  async retryQuiz() {
    const config = {
        headers: { 'Authorization': 'Bearer ' + this.$session.get('access'),
                  'Content-Type': 'application/json' 
                }
    };
    const previousResults = await axios.get(this.backend_url + "api/previousresult/?course=" + this.$session.get('course')['id'] + "&user=" + this.$session.get('user_id'), config)
    if(previousResults !== null) {
      for (let i = 0; i < previousResults.data.length; i++) {
        await axios.delete(this.backend_url + 'api/previousresult/' + previousResults.data[i].id + "/", config)
      }
    }

    this.questions.forEach(question => {
      question.submitted = false;
      question.selectedOption = null;
      question.options.forEach(option => {
        if (option.text.includes('✔') || option.text.includes('✘')) {
          option.text = option.text.substring(2);
        }
      })
    })
    this.$session.set('previousResults', null)
    this.isRetryDisabled = true;
  }
}
};
</script>